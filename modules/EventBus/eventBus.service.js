const amqp = require('amqplib');

class EventBus {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.EXCHANGE_NAME = 'payment_events';
        this.DLX_NAME = 'payment_events_dlx';
        
        this.RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
    }

    async connect() {
        if (this.connection) return;

        try {
            this.connection = await amqp.connect(this.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();

            
            await this.channel.assertExchange(this.DLX_NAME, 'topic', { durable: true });

           
            await this.channel.assertExchange(this.EXCHANGE_NAME, 'topic', { durable: true });

            console.log('[EventBus] Successfully connected to RabbitMQ');
        } catch (error) {
            console.error('[EventBus] Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    
    async publish(topic, payload) {
        if (!this.channel) {
            await this.connect();
        }

        const message = Buffer.from(JSON.stringify(payload));
       
        const success = this.channel.publish(this.EXCHANGE_NAME, topic, message, {
            persistent: true,
            contentType: 'application/json',
            timestamp: Date.now()
        });

        if (success) {
            console.log(`[EventBus] Published event '${topic}'`);
        } else {
            console.error(`[EventBus] Failed to publish event '${topic}'. Channel buffer full.`);
        }
    }

   
    async subscribe(queueName, topicPattern, handler) {
        if (!this.channel) {
            await this.connect();
        }

        const dlqName = `${queueName}_dlq`;

       
        await this.channel.assertQueue(dlqName, { durable: true });
        await this.channel.bindQueue(dlqName, this.DLX_NAME, '#');

       
        await this.channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': this.DLX_NAME,
                'x-dead-letter-routing-key': topicPattern 
            }
        });

        await this.channel.bindQueue(queueName, this.EXCHANGE_NAME, topicPattern);

       
        this.channel.prefetch(1);

        console.log(`[EventBus] Subscribed to queue '${queueName}' with pattern '${topicPattern}'`);

        this.channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                try {
                    const payload = JSON.parse(msg.content.toString());
                    await handler(payload, msg);
                    
                    this.channel.ack(msg);
                } catch (error) {
                    console.error(`[EventBus] Error processing message in queue '${queueName}':`, error);
                    
                    this.channel.nack(msg, false, false);
                }
            }
        });
    }
}

// Export as singleton
module.exports = new EventBus();

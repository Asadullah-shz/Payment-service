class Merchant {
    constructor(client) {
        this.client = client;
    }

    async getProfile() {
        return this.client.request('GET', '/merchant/profile'); // Adjust endpoint path if needed
    }
}

module.exports = Merchant;

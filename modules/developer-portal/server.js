const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());


const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));


const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Payment Infrastructure API Documentation"
};


app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`[Developer Portal] Swagger UI running on port ${PORT}`);
});

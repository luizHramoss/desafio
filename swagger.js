const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Order API',
            version: '1.0.0',
            description: 'API para gerenciamento de pedidos'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./routes/orderRoutes.js']
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
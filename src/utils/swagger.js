const swaggerAutogen = require('swagger-autogen')()
const outputFile  = './src/swagger_output.json';

const endpointsFiles = ['./src/index.js'];
    
const doc = {
    info: {
      title: 'PANULL API',
      description: 'API para projeto de aplicação do curso de sistemas de informação.',
    },
    host: process.env.HOST || 'localhost:3333',
    schemes: ['http', 'https'],
    securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
        }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
};

swaggerAutogen(outputFile , endpointsFiles, doc)

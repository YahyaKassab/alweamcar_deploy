const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Website API',
      version: '1.0.0',
      description: 'Car Website API documentation',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/*.js', 'src/models/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Custom Swagger UI options
const swaggerUiOptions = {
  explorer: true, // Optional: enables the search bar
  swaggerOptions: {
    docExpansion: 'none', // Collapses all tags/folders by default
  },
};

module.exports = {
  swaggerUi,
  swaggerDocs,
  swaggerUiOptions, // Export the options to use in your app
};

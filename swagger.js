const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Billing Management System API",
        version: "1.0.0",
        description: "API documentation for Billing Managemnt System",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Santosh",
          url: "https://smartsantosh1928.netlify.app",
          email: "smartsantosh1928@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };

const specs = swaggerJsdoc(options);

module.exports = specs;

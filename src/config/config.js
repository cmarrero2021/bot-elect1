const path = require('path');

const config = {
  // Configuración de WhatsApp
  whatsapp: {
    nombreGrupoObjetivo: process.env.GRUPO_OBJETIVO || 'PRUEBA',
    puppeteerOptions: {
      headless: process.env.PUPPETEER_HEADLESS !== 'false'
    }
  },

  // Configuración de base de datos
  database: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || '_bot',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT) || 5432,
  },

  // Configuración de archivos
  files: {
    rutaGrupos: process.env.GRUPOS_FILE || path.join(__dirname, '..', '..', 'grupos_detectados.json')
  },

  // Configuración de cédulas
  cedulas: {
    longitudMinima: 6,
    longitudMaxima: 8
  }
};

module.exports = config;

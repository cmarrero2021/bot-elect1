const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config/config');

// Importar adaptadores
const PostgreSQLAdapter = require('./infrastructure/adapters/PostgreSQLAdapter');
const WhatsAppAdapter = require('./infrastructure/adapters/WhatsAppAdapter');
const FileSystemAdapter = require('./infrastructure/adapters/FileSystemAdapter');

// Importar repositorios
const PostgreSQLCedulaRepository = require('./infrastructure/repositories/PostgreSQLCedulaRepository');
const FileSystemGrupoRepository = require('./infrastructure/repositories/FileSystemGrupoRepository');

// Importar servicios de dominio
const CedulaService = require('./domain/services/CedulaService');
const GrupoService = require('./domain/services/GrupoService');

// Importar casos de uso
const ProcesarMensajeUseCase = require('./application/usecases/ProcesarMensajeUseCase');

// Configuración desde archivo centralizado
const { whatsapp, database, files } = config;

class BotApplication {
  constructor() {
    this.inicializarDependencias();
    this.configurarWhatsApp();
  }

  inicializarDependencias() {
    // Adaptadores
    this.databaseAdapter = new PostgreSQLAdapter(database);
    this.fileSystemAdapter = new FileSystemAdapter(files.rutaGrupos);

    // Repositorios
    this.cedulaRepository = new PostgreSQLCedulaRepository(this.databaseAdapter);
    this.grupoRepository = new FileSystemGrupoRepository(this.fileSystemAdapter);

    // Servicios de dominio
    this.cedulaService = new CedulaService(this.cedulaRepository);
    this.grupoService = new GrupoService(this.grupoRepository);
  }

  configurarWhatsApp() {
    // Cliente de WhatsApp
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: whatsapp.puppeteerOptions
    });

    // Adaptador de WhatsApp
    this.whatsAppAdapter = new WhatsAppAdapter(this.client);

    // Casos de uso
    this.procesarMensajeUseCase = new ProcesarMensajeUseCase(
      this.cedulaService,
      this.grupoService,
      this.whatsAppAdapter
    );

    // Eventos de WhatsApp
    this.client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log(`✅ Bot conectado y escuchando el grupo ${whatsapp.nombreGrupoObjetivo}`);
    });

    this.client.on('message', async message => {
      try {
        await this.procesarMensajeUseCase.ejecutar(message, whatsapp.nombreGrupoObjetivo);
      } catch (error) {
        console.error('❌ Error procesando mensaje:', error);
      }
    });
  }

  async iniciar() {
    try {
      console.log('🚀 Iniciando bot...');
      await this.client.initialize();
    } catch (error) {
      console.error('❌ Error iniciando el bot:', error);
      process.exit(1);
    }
  }

  async detener() {
    try {
      console.log('🛑 Deteniendo bot...');
      await this.client.destroy();
      await this.databaseAdapter.close();
      console.log('✅ Bot detenido correctamente');
    } catch (error) {
      console.error('❌ Error deteniendo el bot:', error);
    }
  }
}

// Manejo de señales para cierre limpio
const bot = new BotApplication();

process.on('SIGINT', async () => {
  console.log('\n🛑 Recibida señal de interrupción...');
  await bot.detener();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Recibida señal de terminación...');
  await bot.detener();
  process.exit(0);
});

// Iniciar la aplicación
bot.iniciar().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

module.exports = BotApplication;

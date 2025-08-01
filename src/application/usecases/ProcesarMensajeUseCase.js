const Mensaje = require('../../domain/entities/Mensaje');

class ProcesarMensajeUseCase {
  constructor(cedulaService, grupoService, whatsAppPort) {
    this.cedulaService = cedulaService;
    this.grupoService = grupoService;
    this.whatsAppPort = whatsAppPort;
  }

  /**
   * Procesa un mensaje recibido de WhatsApp
   * @param {Object} message - Mensaje de WhatsApp
   * @param {string} nombreGrupoObjetivo - Nombre del grupo objetivo
   * @returns {Promise<void>}
   */
  async ejecutar(message, nombreGrupoObjetivo) {
    const chat = await this.whatsAppPort.obtenerChat(message);
    const contacto = await this.whatsAppPort.obtenerContacto(message);
    
    const mensaje = new Mensaje(
      message.body,
      message.from,
      message.timestamp,
      contacto,
      chat
    );

    // Filtrar solo mensajes del grupo objetivo
    if (!mensaje.esDelGrupoObjetivo(nombreGrupoObjetivo)) {
      return;
    }

    // Guardar información del grupo
    await this.grupoService.guardarGrupo(mensaje.from, mensaje.chat.name);

    // Manejar comando de listar grupos
    if (mensaje.esComandoListarGrupos()) {
      const listaGrupos = await this.grupoService.obtenerListaGrupos();
      await this.whatsAppPort.responder(message, listaGrupos);
      return;
    }

    // Procesar cédulas
    const { cedulasValidas, rechazadasFormato } = this.cedulaService.extraerCedulas(mensaje.body);

    if (cedulasValidas.length === 0) {
      await this.whatsAppPort.responder(message, '⚠️ No se detectaron cédulas válidas en tu mensaje.');
      return;
    }

    // Insertar cédulas válidas
    const nombreRemitente = mensaje.obtenerNombreRemitente();
    const numeroTelefono = mensaje.obtenerNumeroTelefono();
    const fechaRecibido = mensaje.obtenerFechaRecibido();

    const resultado = await this.cedulaService.insertarCedulas(
      cedulasValidas,
      nombreRemitente,
      numeroTelefono,
      fechaRecibido
    );

    // Generar respuesta
    const totalRechazadas = rechazadasFormato.length + resultado.duplicadas.length;
    const respuesta = `✅ Cédulas insertadas: ${resultado.insertadas}\n🚫 Rechazadas (formato + duplicadas): ${totalRechazadas}`;
    
    await this.whatsAppPort.responder(message, respuesta);
  }
}

module.exports = ProcesarMensajeUseCase;

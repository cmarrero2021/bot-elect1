const WhatsAppPort = require('../../application/ports/WhatsAppPort');

class WhatsAppAdapter extends WhatsAppPort {
  constructor(client) {
    super();
    this.client = client;
  }

  /**
   * Responde a un mensaje
   * @param {Object} message - Mensaje original
   * @param {string} respuesta - Texto de respuesta
   * @returns {Promise<void>}
   */
  async responder(message, respuesta) {
    await message.reply(respuesta);
  }

  /**
   * Obtiene información del contacto de un mensaje
   * @param {Object} message - Mensaje
   * @returns {Promise<Object>} - Información del contacto
   */
  async obtenerContacto(message) {
    return await message.getContact();
  }

  /**
   * Obtiene información del chat de un mensaje
   * @param {Object} message - Mensaje
   * @returns {Promise<Object>} - Información del chat
   */
  async obtenerChat(message) {
    return await message.getChat();
  }
}

module.exports = WhatsAppAdapter;

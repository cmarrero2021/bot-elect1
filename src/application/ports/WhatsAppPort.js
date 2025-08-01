/**
 * Puerto para la comunicación con WhatsApp
 * Define la interfaz que debe implementar el adaptador de WhatsApp
 */
class WhatsAppPort {
  /**
   * Responde a un mensaje
   * @param {Object} message - Mensaje original
   * @param {string} respuesta - Texto de respuesta
   * @returns {Promise<void>}
   */
  async responder(message, respuesta) {
    throw new Error('Método responder() debe ser implementado');
  }

  /**
   * Obtiene información del contacto de un mensaje
   * @param {Object} message - Mensaje
   * @returns {Promise<Object>} - Información del contacto
   */
  async obtenerContacto(message) {
    throw new Error('Método obtenerContacto() debe ser implementado');
  }

  /**
   * Obtiene información del chat de un mensaje
   * @param {Object} message - Mensaje
   * @returns {Promise<Object>} - Información del chat
   */
  async obtenerChat(message) {
    throw new Error('Método obtenerChat() debe ser implementado');
  }
}

module.exports = WhatsAppPort;

/**
 * Puerto para la comunicación con la base de datos
 * Define la interfaz que debe implementar el adaptador de base de datos
 */
class DatabasePort {
  /**
   * Ejecuta una consulta en la base de datos
   * @param {string} query - Consulta SQL
   * @param {Array} params - Parámetros de la consulta
   * @returns {Promise<Object>} - Resultado de la consulta
   */
  async query(query, params = []) {
    throw new Error('Método query() debe ser implementado');
  }

  /**
   * Cierra la conexión a la base de datos
   * @returns {Promise<void>}
   */
  async close() {
    throw new Error('Método close() debe ser implementado');
  }
}

module.exports = DatabasePort;

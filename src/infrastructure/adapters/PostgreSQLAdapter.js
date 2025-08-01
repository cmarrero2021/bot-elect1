const DatabasePort = require('../../application/ports/DatabasePort');
const { Pool } = require('pg');

class PostgreSQLAdapter extends DatabasePort {
  constructor(config) {
    super();
    this.pool = new Pool(config);
  }

  /**
   * Ejecuta una consulta en la base de datos
   * @param {string} query - Consulta SQL
   * @param {Array} params - Parámetros de la consulta
   * @returns {Promise<Object>} - Resultado de la consulta
   */
  async query(query, params = []) {
    return await this.pool.query(query, params);
  }

  /**
   * Cierra la conexión a la base de datos
   * @returns {Promise<void>}
   */
  async close() {
    await this.pool.end();
  }
}

module.exports = PostgreSQLAdapter;

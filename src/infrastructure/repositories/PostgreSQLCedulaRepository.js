const CedulaRepository = require('../../domain/repositories/CedulaRepository');

class PostgreSQLCedulaRepository extends CedulaRepository {
  constructor(databaseAdapter) {
    super();
    this.db = databaseAdapter;
  }

  /**
   * Verifica si una cédula ya existe en el repositorio
   * @param {string} cedula - Número de cédula a verificar
   * @returns {Promise<boolean>} - True si existe, false si no
   */
  async existe(cedula) {
    const resultado = await this.db.query('SELECT 1 FROM cedulas WHERE cedula = $1', [cedula]);
    return resultado.rowCount > 0;
  }

  /**
   * Inserta una nueva cédula en el repositorio
   * @param {Cedula} cedula - Objeto cédula a insertar
   * @returns {Promise<void>}
   */
  async insertar(cedula) {
    await this.db.query(
      'INSERT INTO cedulas (cedula, enviado_por, telefono, recibido) VALUES ($1, $2, $3, $4)',
      [cedula.numero, cedula.enviadoPor, cedula.telefono, cedula.recibido]
    );
  }

  /**
   * Obtiene todas las cédulas del repositorio
   * @returns {Promise<Cedula[]>} - Array de cédulas
   */
  async obtenerTodas() {
    const resultado = await this.db.query('SELECT * FROM cedulas ORDER BY recibido DESC');
    return resultado.rows.map(row => ({
      numero: row.cedula,
      enviadoPor: row.enviado_por,
      telefono: row.telefono,
      recibido: row.recibido
    }));
  }
}

module.exports = PostgreSQLCedulaRepository;

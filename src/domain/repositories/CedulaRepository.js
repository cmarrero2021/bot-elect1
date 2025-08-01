/**
 * Interfaz del repositorio de cédulas
 * Define los métodos que debe implementar cualquier adaptador de persistencia
 */
class CedulaRepository {
  /**
   * Verifica si una cédula ya existe en el repositorio
   * @param {string} cedula - Número de cédula a verificar
   * @returns {Promise<boolean>} - True si existe, false si no
   */
  async existe(cedula) {
    throw new Error('Método existe() debe ser implementado');
  }

  /**
   * Inserta una nueva cédula en el repositorio
   * @param {Cedula} cedula - Objeto cédula a insertar
   * @returns {Promise<void>}
   */
  async insertar(cedula) {
    throw new Error('Método insertar() debe ser implementado');
  }

  /**
   * Obtiene todas las cédulas del repositorio
   * @returns {Promise<Cedula[]>} - Array de cédulas
   */
  async obtenerTodas() {
    throw new Error('Método obtenerTodas() debe ser implementado');
  }
}

module.exports = CedulaRepository;

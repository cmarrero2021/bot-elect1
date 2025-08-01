/**
 * Interfaz del repositorio de grupos
 * Define los métodos que debe implementar cualquier adaptador de persistencia
 */
class GrupoRepository {
  /**
   * Verifica si un grupo ya existe en el repositorio
   * @param {string} id - ID del grupo a verificar
   * @returns {Promise<boolean>} - True si existe, false si no
   */
  async existe(id) {
    throw new Error('Método existe() debe ser implementado');
  }

  /**
   * Guarda un nuevo grupo en el repositorio
   * @param {Grupo} grupo - Objeto grupo a guardar
   * @returns {Promise<void>}
   */
  async guardar(grupo) {
    throw new Error('Método guardar() debe ser implementado');
  }

  /**
   * Obtiene todos los grupos del repositorio
   * @returns {Promise<Grupo[]>} - Array de grupos
   */
  async obtenerTodos() {
    throw new Error('Método obtenerTodos() debe ser implementado');
  }
}

module.exports = GrupoRepository;

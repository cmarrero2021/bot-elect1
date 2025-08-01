const GrupoRepository = require('../../domain/repositories/GrupoRepository');
const Grupo = require('../../domain/entities/Grupo');

class FileSystemGrupoRepository extends GrupoRepository {
  constructor(fileSystemAdapter) {
    super();
    this.fs = fileSystemAdapter;
  }

  /**
   * Verifica si un grupo ya existe en el repositorio
   * @param {string} id - ID del grupo a verificar
   * @returns {Promise<boolean>} - True si existe, false si no
   */
  async existe(id) {
    const grupos = await this.fs.leer();
    return grupos.some(grupo => grupo.id === id);
  }

  /**
   * Guarda un nuevo grupo en el repositorio
   * @param {Grupo} grupo - Objeto grupo a guardar
   * @returns {Promise<void>}
   */
  async guardar(grupo) {
    const grupos = await this.fs.leer();
    grupos.push({
      id: grupo.id,
      nombre: grupo.nombre,
      timestamp: grupo.timestamp
    });
    await this.fs.escribir(grupos);
  }

  /**
   * Obtiene todos los grupos del repositorio
   * @returns {Promise<Grupo[]>} - Array de grupos
   */
  async obtenerTodos() {
    const grupos = await this.fs.leer();
    return grupos.map(g => new Grupo(g.id, g.nombre, g.timestamp));
  }
}

module.exports = FileSystemGrupoRepository;

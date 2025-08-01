const Grupo = require('../entities/Grupo');

class GrupoService {
  constructor(grupoRepository) {
    this.grupoRepository = grupoRepository;
  }

  /**
   * Guarda información de un grupo si no existe
   * @param {string} from - ID del grupo
   * @param {string} nombre - Nombre del grupo
   * @returns {Promise<boolean>} - True si se guardó, false si ya existía
   */
  async guardarGrupo(from, nombre) {
    if (!Grupo.esGrupo(from)) {
      return false;
    }

    const existe = await this.grupoRepository.existe(from);
    
    if (!existe) {
      const grupo = new Grupo(from, nombre || 'Grupo sin nombre');
      await this.grupoRepository.guardar(grupo);
      console.log("📥 Grupo detectado y guardado:", grupo);
      return true;
    }

    return false;
  }

  /**
   * Obtiene la lista formateada de todos los grupos
   * @returns {Promise<string>} - Lista formateada de grupos
   */
  async obtenerListaGrupos() {
    const grupos = await this.grupoRepository.obtenerTodos();
    
    if (grupos.length === 0) {
      return '⚠️ No hay grupos registrados aún.';
    }

    const lista = grupos.map(grupo => grupo.toString()).join('\n');
    return `📄 Grupos detectados:\n\n${lista}`;
  }
}

module.exports = GrupoService;

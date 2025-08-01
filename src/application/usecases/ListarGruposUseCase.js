class ListarGruposUseCase {
  constructor(grupoService) {
    this.grupoService = grupoService;
  }

  /**
   * Obtiene la lista de grupos registrados
   * @returns {Promise<string>} - Lista formateada de grupos
   */
  async ejecutar() {
    return await this.grupoService.obtenerListaGrupos();
  }
}

module.exports = ListarGruposUseCase;

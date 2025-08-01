class InsertarCedulasUseCase {
  constructor(cedulaService) {
    this.cedulaService = cedulaService;
  }

  /**
   * Inserta cédulas extraídas de un texto
   * @param {string} texto - Texto que contiene las cédulas
   * @param {string} remitente - Nombre del remitente
   * @param {string} numeroTelefono - Número de teléfono
   * @param {Date} fechaRecibido - Fecha de recepción
   * @returns {Promise<Object>} - Resultado de la inserción
   */
  async ejecutar(texto, remitente, numeroTelefono, fechaRecibido) {
    const { cedulasValidas, rechazadasFormato } = this.cedulaService.extraerCedulas(texto);
    
    if (cedulasValidas.length === 0) {
      return {
        insertadas: 0,
        duplicadas: [],
        rechazadasFormato,
        mensaje: '⚠️ No se detectaron cédulas válidas en el texto.'
      };
    }

    const resultado = await this.cedulaService.insertarCedulas(
      cedulasValidas,
      remitente,
      numeroTelefono,
      fechaRecibido
    );

    const totalRechazadas = rechazadasFormato.length + resultado.duplicadas.length;
    const mensaje = `✅ Cédulas insertadas: ${resultado.insertadas}\n🚫 Rechazadas (formato + duplicadas): ${totalRechazadas}`;

    return {
      ...resultado,
      rechazadasFormato,
      mensaje
    };
  }
}

module.exports = InsertarCedulasUseCase;

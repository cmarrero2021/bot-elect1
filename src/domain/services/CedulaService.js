const Cedula = require('../entities/Cedula');

class CedulaService {
  constructor(cedulaRepository) {
    this.cedulaRepository = cedulaRepository;
  }

  /**
   * Extrae cédulas válidas de un texto
   * @param {string} texto - Texto a procesar
   * @returns {Object} - {cedulasValidas: Cedula[], rechazadasFormato: string[]}
   */
  extraerCedulas(texto) {
    const partes = texto.split(/\s+/);
    const cedulasValidas = [];
    const rechazadasFormato = [];

    for (const parte of partes) {
      if (Cedula.esValida(parte)) {
        const numeroLimpio = Cedula.limpiar(parte);
        cedulasValidas.push(numeroLimpio);
      } else {
        rechazadasFormato.push(parte);
      }
    }

    return { cedulasValidas, rechazadasFormato };
  }

  /**
   * Inserta cédulas en el repositorio evitando duplicados
   * @param {string[]} cedulas - Array de números de cédula
   * @param {string} remitente - Nombre del remitente
   * @param {string} numeroTelefono - Número de teléfono
   * @param {Date} recibido - Fecha de recepción
   * @returns {Promise<Object>} - {insertadas: number, duplicadas: string[]}
   */
  async insertarCedulas(cedulas, remitente, numeroTelefono, recibido) {
    let insertadas = 0;
    const duplicadas = [];

    for (const numeroCedula of cedulas) {
      try {
        const existe = await this.cedulaRepository.existe(numeroCedula);
        
        if (!existe) {
          const cedula = new Cedula(numeroCedula, remitente, numeroTelefono, recibido);
          await this.cedulaRepository.insertar(cedula);
          insertadas++;
        } else {
          duplicadas.push(numeroCedula);
        }
      } catch (error) {
        console.error(`❌ Error al insertar ${numeroCedula}:`, error.message);
      }
    }

    return { insertadas, duplicadas };
  }
}

module.exports = CedulaService;

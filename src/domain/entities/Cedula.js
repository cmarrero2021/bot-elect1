const config = require('../../config/config');

class Cedula {
  constructor(numero, enviadoPor, telefono, recibido = new Date()) {
    this.numero = numero;
    this.enviadoPor = enviadoPor;
    this.telefono = telefono;
    this.recibido = recibido;
  }

  static esValida(numero) {
    const limpia = numero.replace(/\D+/g, '');
    const { longitudMinima, longitudMaxima } = config.cedulas;
    return limpia.length >= longitudMinima && limpia.length <= longitudMaxima;
  }

  static limpiar(numero) {
    return numero.replace(/\D+/g, '');
  }

  toString() {
    return this.numero;
  }
}

module.exports = Cedula;

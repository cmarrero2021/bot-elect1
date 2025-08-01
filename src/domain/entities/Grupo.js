class Grupo {
  constructor(id, nombre, timestamp = new Date().toISOString()) {
    this.id = id;
    this.nombre = nombre;
    this.timestamp = timestamp;
  }

  static esGrupo(from) {
    return from.endsWith('@g.us');
  }

  toString() {
    return `🟢 ${this.nombre}: ${this.id}`;
  }
}

module.exports = Grupo;

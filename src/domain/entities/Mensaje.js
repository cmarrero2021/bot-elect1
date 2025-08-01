class Mensaje {
  constructor(body, from, timestamp, contacto, chat) {
    this.body = body;
    this.from = from;
    this.timestamp = timestamp;
    this.contacto = contacto;
    this.chat = chat;
  }

  esDelGrupoObjetivo(nombreGrupo) {
    return this.chat.isGroup && this.chat.name === nombreGrupo;
  }

  esComandoListarGrupos() {
    return this.body === '!listargrupos';
  }

  obtenerNombreRemitente() {
    return this.contacto.name || this.contacto.pushname || this.contacto.id._serialized;
  }

  obtenerNumeroTelefono() {
    return this.contacto.id._serialized.replace('@c.us', '');
  }

  obtenerFechaRecibido() {
    return this.timestamp ? new Date(this.timestamp * 1000) : new Date();
  }
}

module.exports = Mensaje;

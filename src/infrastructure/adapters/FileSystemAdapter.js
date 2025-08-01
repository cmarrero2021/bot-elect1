const fs = require('fs');
const path = require('path');

class FileSystemAdapter {
  constructor(rutaArchivo) {
    this.rutaArchivo = rutaArchivo;
  }

  /**
   * Lee el contenido del archivo JSON
   * @returns {Promise<Array>} - Contenido del archivo
   */
  async leer() {
    try {
      if (!fs.existsSync(this.rutaArchivo)) {
        return [];
      }
      
      const contenido = fs.readFileSync(this.rutaArchivo, 'utf8');
      return JSON.parse(contenido);
    } catch (error) {
      console.error("⚠️ Error leyendo archivo:", error);
      return [];
    }
  }

  /**
   * Escribe contenido al archivo JSON
   * @param {Array} datos - Datos a escribir
   * @returns {Promise<void>}
   */
  async escribir(datos) {
    try {
      const directorio = path.dirname(this.rutaArchivo);
      if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio, { recursive: true });
      }
      
      fs.writeFileSync(this.rutaArchivo, JSON.stringify(datos, null, 2));
    } catch (error) {
      console.error("⚠️ Error escribiendo archivo:", error);
      throw error;
    }
  }

  /**
   * Verifica si el archivo existe
   * @returns {boolean} - True si existe, false si no
   */
  existe() {
    return fs.existsSync(this.rutaArchivo);
  }
}

module.exports = FileSystemAdapter;

const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const { Pool } = require('pg');

const RUTA_GRUPOS = path.join(__dirname, 'grupos_detectados.json');
const NOMBRE_GRUPO_OBJETIVO = 'PRUEBA';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: '_bot',
  password: 'postgres',
  port: 5432,
});

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot conectado y escuchando el grupo PRUEBA');
});

function guardarGrupo(message) {
  const from = message.from;

  if (from.endsWith('@g.us')) {
    const nombreGrupo = message.chat?.name || 'Grupo sin nombre';
    const grupoInfo = {
      id: from,
      nombre: nombreGrupo,
      timestamp: new Date().toISOString(),
    };

    let grupos = [];

    if (fs.existsSync(RUTA_GRUPOS)) {
      try {
        grupos = JSON.parse(fs.readFileSync(RUTA_GRUPOS));
      } catch (e) {
        console.error("⚠️ Error leyendo grupos_detectados.json:", e);
      }
    }

    const existe = grupos.find(g => g.id === from);
    if (!existe) {
      grupos.push(grupoInfo);
      fs.writeFileSync(RUTA_GRUPOS, JSON.stringify(grupos, null, 2));
      console.log("📥 Grupo detectado y guardado:", grupoInfo);
    }
  }
}

function extraerCedulas(texto) {
  const partes = texto.split(/\s+/);
  const cedulasValidas = [];
  const rechazadasFormato = [];

  for (const p of partes) {
    const limpia = p.replace(/\D+/g, '');
    if (limpia.length >= 6 && limpia.length <= 8) {
      cedulasValidas.push(limpia);
    } else {
      rechazadasFormato.push(p);
    }
  }

  return { cedulasValidas, rechazadasFormato };
}

async function insertarCedulasEnDB(cedulas, remitente, numeroTelefono, recibido) {
  let insertadas = 0;
  let duplicadas = [];

  for (const cedula of cedulas) {
    try {
      const existe = await pool.query('SELECT 1 FROM cedulas WHERE cedula = $1', [cedula]);
      if (existe.rowCount === 0) {
        await pool.query(
          'INSERT INTO cedulas (cedula, enviado_por, telefono, recibido) VALUES ($1, $2, $3, $4)',
          [cedula, remitente, numeroTelefono, recibido]
        );
        insertadas++;
      } else {
        duplicadas.push(cedula);
      }
    } catch (err) {
      console.error(`❌ Error al insertar ${cedula}:`, err.message);
    }
  }

  return { insertadas, duplicadas };
}

client.on('message', async message => {
  const chat = await message.getChat();

  // 🛑 Filtrar solo mensajes del grupo PRUEBA
  if (!chat.isGroup || chat.name !== NOMBRE_GRUPO_OBJETIVO) return;

  guardarGrupo(message);

  if (message.body === '!listargrupos') {
    if (fs.existsSync(RUTA_GRUPOS)) {
      const grupos = JSON.parse(fs.readFileSync(RUTA_GRUPOS));
      const lista = grupos.map(g => `🟢 ${g.nombre}: ${g.id}`).join('\n');
      await message.reply(`📄 Grupos detectados:\n\n${lista}`);
    } else {
      await message.reply('⚠️ No hay grupos registrados aún.');
    }
    return;
  }

  const { cedulasValidas, rechazadasFormato } = extraerCedulas(message.body);

  if (cedulasValidas.length === 0) {
    await message.reply('⚠️ No se detectaron cédulas válidas en tu mensaje.');
    return;
  }

  const contacto = await message.getContact();
  const nombreRemitente = contacto.name || contacto.pushname || contacto.id._serialized;
  const recibido = message.timestamp ? new Date(message.timestamp * 1000) : new Date();
  const numeroTelefono = contacto.id._serialized.replace('@c.us', '');
  const resultado = await insertarCedulasEnDB(cedulasValidas, nombreRemitente, numeroTelefono, recibido);
  const totalRechazadas = rechazadasFormato.length + resultado.duplicadas.length;
  const respuesta = `✅ Cédulas insertadas: ${resultado.insertadas}\n🚫 Rechazadas (formato + duplicadas): ${totalRechazadas}`;
  await message.reply(respuesta);
});

client.initialize();
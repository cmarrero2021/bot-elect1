# Bot WhatsApp - Arquitectura Hexagonal

Este proyecto ha sido refactorizado a una arquitectura hexagonal (también conocida como Ports and Adapters) para mejorar la mantenibilidad, testabilidad y separación de responsabilidades.

## 🏗️ Estructura del Proyecto

```
src/
├── domain/                 # Capa de Dominio (lógica de negocio)
│   ├── entities/           # Entidades del dominio
│   │   ├── Cedula.js      # Entidad cédula con validaciones
│   │   ├── Grupo.js       # Entidad grupo de WhatsApp
│   │   └── Mensaje.js     # Entidad mensaje con métodos de utilidad
│   ├── repositories/       # Interfaces de repositorios
│   │   ├── CedulaRepository.js
│   │   └── GrupoRepository.js
│   └── services/           # Servicios de dominio
│       ├── CedulaService.js    # Lógica de procesamiento de cédulas
│       └── GrupoService.js     # Lógica de manejo de grupos
├── application/            # Capa de Aplicación (casos de uso)
│   ├── usecases/
│   │   ├── ProcesarMensajeUseCase.js   # Caso de uso principal
│   │   ├── ListarGruposUseCase.js      # Listar grupos registrados
│   │   └── InsertarCedulasUseCase.js   # Insertar cédulas
│   └── ports/              # Puertos de aplicación (interfaces)
│       ├── WhatsAppPort.js     # Interfaz para WhatsApp
│       └── DatabasePort.js     # Interfaz para base de datos
├── infrastructure/         # Capa de Infraestructura (adaptadores)
│   ├── adapters/
│   │   ├── WhatsAppAdapter.js      # Implementación WhatsApp
│   │   ├── PostgreSQLAdapter.js    # Implementación PostgreSQL
│   │   └── FileSystemAdapter.js    # Implementación sistema de archivos
│   └── repositories/       # Implementaciones de repositorios
│       ├── PostgreSQLCedulaRepository.js
│       └── FileSystemGrupoRepository.js
├── config/
│   └── config.js          # Configuración centralizada
└── main.js                # Punto de entrada y configuración DI
```

## 🚀 Cómo Ejecutar

### Prerequisitos
- Node.js instalado
- PostgreSQL con base de datos `_bot` configurada
- Tabla `cedulas` creada en la base de datos

### Instalación
```bash
npm install
```

### Ejecución
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## ⚙️ Configuración

El proyecto usa variables de entorno para configuración. Puedes crear un archivo `.env` o usar las siguientes variables:

```bash
# WhatsApp
GRUPO_OBJETIVO=PRUEBA
PUPPETEER_HEADLESS=true

# Base de datos
DB_USER=postgres
DB_HOST=localhost
DB_NAME=_bot
DB_PASSWORD=postgres
DB_PORT=5432

# Archivos
GRUPOS_FILE=./grupos_detectados.json
```

## 🏛️ Principios de Arquitectura Hexagonal

### Capa de Dominio (Centro)
- **Entidades**: Objetos de negocio con comportamiento
- **Servicios de Dominio**: Lógica de negocio compleja
- **Repositorios**: Interfaces para persistencia (sin implementación)

### Capa de Aplicación
- **Casos de Uso**: Orquestación de la lógica de negocio
- **Puertos**: Interfaces para comunicación externa

### Capa de Infraestructura (Externa)
- **Adaptadores**: Implementaciones concretas de los puertos
- **Repositorios**: Implementaciones de persistencia

## 🔄 Flujo de Datos

1. **WhatsApp** → **WhatsAppAdapter** → **ProcesarMensajeUseCase**
2. **Caso de Uso** → **Servicios de Dominio** → **Repositorios**
3. **Repositorios** → **Adaptadores** → **PostgreSQL/FileSystem**

## 🧪 Beneficios de la Refactorización

- **Testabilidad**: Cada capa puede ser testeada independientemente
- **Mantenibilidad**: Separación clara de responsabilidades
- **Flexibilidad**: Fácil cambio de adaptadores (ej: cambiar de PostgreSQL a MongoDB)
- **Escalabilidad**: Estructura preparada para crecimiento
- **Inversión de dependencias**: El dominio no depende de la infraestructura

## 📝 Comandos Disponibles

El bot responde a los siguientes comandos en el grupo configurado:

- `!listargrupos`: Muestra todos los grupos registrados
- Cualquier mensaje con números de 6-8 dígitos será procesado como cédulas

## 🛠️ Desarrollo

Para agregar nuevas funcionalidades:

1. **Nueva entidad**: Crear en `src/domain/entities/`
2. **Nueva lógica de negocio**: Agregar a servicios de dominio
3. **Nuevo caso de uso**: Crear en `src/application/usecases/`
4. **Nueva integración externa**: Crear adaptador en `src/infrastructure/adapters/`

## 📊 Migración desde Versión Anterior

El archivo original `index.js` ha sido refactorizado manteniendo toda la funcionalidad:

- ✅ Conexión a WhatsApp mantenida
- ✅ Procesamiento de cédulas idéntico
- ✅ Almacenamiento en PostgreSQL preservado
- ✅ Gestión de grupos en JSON conservada
- ✅ Todos los comandos funcionan igual

La nueva estructura permite mayor flexibilidad y mantenimiento sin cambiar el comportamiento del bot.

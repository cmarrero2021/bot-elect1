@echo off
echo 🧩 Forzando descarga de Chromium en el puppeteer de whatsapp-web.js...
npx puppeteer browsers install chrome --platform win64 --path "node_modules/whatsapp-web.js/node_modules/puppeteer"

echo 📁 Verificando descarga...
if exist "node_modules\whatsapp-web.js\node_modules\puppeteer\chrome\win64*" (
    echo 🛠️ Generando MiApp.exe con Chromium incluido...
    pkg index.js --target node18-win-x64 --output MiApp.exe --assets "node_modules/whatsapp-web.js/node_modules/puppeteer/chrome/**/*"
    echo ✅ ¡Listo! MiApp.exe incluye Chromium y es autónomo.
) else (
    echo ❌ Error: No se encontró Chromium descargado.
    echo Revisa la carpeta node_modules\whatsapp-web.js\node_modules\puppeteer\chrome
)

pause
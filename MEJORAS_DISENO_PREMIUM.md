# NEXUSFORENSE · Rediseño premium

Actualización realizada a partir del proyecto ZIP original, manteniendo Flask, modelos, rutas de API, formulario y panel administrativo.

## Cambios visuales
- Nuevo esquema azul noche / negro / rojo / blanco, logo gráfico inicial N rojo-blanco (provisional).
- Portada cinematográfica con ilustración conceptual de paisaje limeño y alegoría de la justicia; el archivo está empaquetado sin depender de una URL externa.
- Menú fijo responsive, menú móvil desplegable, resaltado de sección activa y barra de progreso de lectura.
- Formato de 6 tarjetas de especialidad, con selección de área al pulsar la flecha de cada tarjeta.
- Banda de cuatro atributos sin métricas no verificadas.
- Nosotros, valores, metodología en 4 etapas, llamado a la acción, formulario, FAQs y pie de página.
- Botón flotante de WhatsApp **solo si** completas `VITE_WHATSAPP_NUMBER`.
- El panel administrativo y la API conservan sus funciones.
- Respeto a la preferencia del navegador de reducir animaciones.

## Archivos modificados
- `frontend/src/App.jsx`
- `frontend/src/styles.css`
- `frontend/index.html`
- `frontend/public/favicon.svg`
- `frontend/public/images/lima-justicia-hero.webp` (nuevo)

## Archivos conservados
- `backend/app.py` y `backend/requirements.txt`
- `tests/test_api.py`
- `setup_windows.bat`, `iniciar_web.bat`, `compilar_produccion.bat`

## Probar
1. Ejecuta `setup_windows.bat` tras descomprimir.
2. Ejecuta `iniciar_web.bat`.
3. Comprueba el menú, las tarjetas de especialidades y la página `/admin`.
4. Envía una consulta de prueba; debe mostrarse en administración.

## Pendientes antes de publicar
- Sustituir logo provisional por logo autorizado y confirmar la denominación legal exacta.
- Registrar contacto, dominio, política de privacidad, manejo de datos sensibles y contenido validado del equipo.
- Probar API+frontend en Windows, porque no fue posible instalar las dependencias externas en el entorno donde se realizó este rediseño.
- Este sitio **solicita consultas**, todavía no reserva horarios reales ni procesa pagos.

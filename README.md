# NEXUSFORENSE CONSULTARIA LEGAL S.R.L.

**Sitio web corporativo y panel privado para gestión de solicitudes legales.**

Versión premium rediseñada (MVP) hecha con React + Vite + Tailwind CSS (estilos de marca personalizados) y Python Flask + SQLAlchemy. Para empezar usa SQLite; opcionalmente PostgreSQL en producción.

## Incluye

- Diseño premium responsive en azul noche, negro, rojo y blanco, inspirado en la maqueta aprobada.
- Portada cinematográfica con ilustración conceptual de Lima y justicia incorporada localmente (`frontend/public/images/lima-justicia-hero.webp`).
- Barra de navegación fija con sección activa, indicador de lectura, tarjetas con animaciones sutiles, servicios con selección automática en el formulario y acceso a WhatsApp solo cuando se configura un número real.
- Proceso de atención en cuatro etapas, banda de fortalezas y sección de preguntas frecuentes.
- Inicio, las **6 especialidades**, nosotros, fortalezas, metodología, preguntas frecuentes y contacto.
- Formulario que valida y **guarda solicitudes** en la base de datos.
- Elección de atención virtual, presencial o por coordinar.
- Login administrativo privado y credenciales locales generadas aleatoriamente.
- Bandeja para buscar, filtrar, ver detalles, cambiar estados y eliminar solicitudes; exportar CSV.
- Integración opcional de WhatsApp, email, dirección y horario sin datos ficticios.
- Comprobación de salud `/api/health` para despliegue.

## Requisitos de Windows

1. **Python 3.11 o superior** (instalación con la casilla `Add Python to PATH`).
2. **Node.js 20 o superior** (incluye npm).
3. **Visual Studio Code**.

## Inicio rápido — Windows 11

1. Descomprime el ZIP en una carpeta, por ejemplo `C:\Proyectos\NEXUSFORENSE_WEB`.
2. Entra en la carpeta `NEXUSFORENSE_WEB` y ejecuta **`setup_windows.bat`** una vez. Necesita conexión a internet para instalar paquetes.
3. Lee **`CREDENCIALES_LOCALES.txt`**: el script habrá generado email y contraseña aleatoria para el panel. No publiques ese archivo.
4. Ejecuta **`iniciar_web.bat`**. Abre automáticamente **http://127.0.0.1:5173**.
5. Para abrir el panel, entra a **http://127.0.0.1:5173/admin** e ingresa las credenciales del paso 3.
6. Prueba una consulta desde la web; revisa que aparezca en el panel.

Para cerrar el servidor local, cierra las dos ventanas de consola que abrió `iniciar_web.bat` o presiona `Ctrl+C` en cada una.

## Iniciar manualmente desde Visual Studio Code

Abre la carpeta del proyecto con VS Code. Abre **dos terminales**:

**Terminal 1 — Flask**

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python app.py
```

Si Windows bloquea la activación de PowerShell, usa sin activar:

```powershell
cd backend
.\.venv\Scripts\python.exe app.py
```

**Terminal 2 — React/Vite**

```powershell
cd frontend
npm run dev
```

Frontend: http://127.0.0.1:5173  
API: http://127.0.0.1:5000/api/health

## Probar la API

Una vez ejecutado `setup_windows.bat`, desde la carpeta principal:

```powershell
backend\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Las pruebas crean una base temporal; no modifican los mensajes que hayas registrado en tu base local habitual.

## Personaliza los datos públicos

El nombre del negocio está en `frontend/src/config.js`, respetando el texto proporcionado: **NEXUSFORENSE CONSULTARIA LEGAL S.R.L.** Confirma que coincide con el nombre oficialmente registrado antes de publicar; no cambiamos automáticamente «CONSULTARIA» por «CONSULTORÍA».

Para añadir información verificada de contacto, copia `frontend/.env.example` como `frontend/.env` y completa:

```ini
VITE_WHATSAPP_NUMBER=51XXXXXXXXX
VITE_CONTACT_EMAIL=correo@empresa.com
VITE_OFFICE_ADDRESS=Dirección confirmada
VITE_OFFICE_HOURS=Lun. a vie. (horario confirmado)
```

Los valores de arriba son **ejemplos**, no datos reales. No pongas claves privadas en variables `VITE_`: son **públicas** en la compilación. Reinicia Vite después de cambiar `.env`.

Contenido de especialidades: `frontend/src/App.jsx` → `SERVICE_DATA`.  
Diseño y paleta: `frontend/src/styles.css` (bloque final `NEXUSFORENSE · REDESIGN PREMIUM 2026`).
El icono corporativo es **provisional** y puede reemplazarse por el logo registrado. Las imágenes de la maqueta/hero son ilustraciones conceptuales, no fotografías documentales de Lima.

**Importante sobre contenido verificable:** no se publican números de casos, reconocimientos, clasificaciones de éxito ni testimonios inventados. La versión de referencia sí contenía ejemplos ficticios; se sustituyeron por atributos del servicio sin estadísticas. Los testimonios reales solo deben añadirse con autorización.

## Base de datos

En desarrollo, las solicitudes se guardan en `backend/instance/nexusforense.sqlite` de forma persistente entre reinicios. El archivo está excluido de Git por privacidad.

Para PostgreSQL, crea la base de datos y configura en `backend/.env`:

```ini
DATABASE_URL=postgresql://usuario:contraseña@host:5432/base_de_datos
```

La primera vez, SQLAlchemy crea las tablas. Para producción con cambios de esquema posteriores, preparar migraciones con Alembic; **no uses `create_all` como sistema de migración**.

## Compilar para servir desde Flask

En `frontend`:

```bash
npm run build
```

Luego Flask sirve React compilado desde **http://127.0.0.1:5000** (y `/admin`). `compilar_produccion.bat` facilita este paso.

Para servidor Linux, tras construir React y configurar secretos en el entorno:

```bash
cd backend
python -m pip install -r requirements.txt
gunicorn -b 0.0.0.0:${PORT:-5000} app:app
```

**IMPORTANTE antes de publicar:**
- Usa HTTPS, dominio y un hosting con disco o PostgreSQL **persistente** (no depender de SQLite en hosting efímero).
- Sustituye la cuenta `admin@nexusforense.local` por un correo administrativo propio; crea un hash de contraseña nueva mediante `werkzeug.security.generate_password_hash` y actualiza `ADMIN_PASSWORD_HASH`.
- Define `SESSION_COOKIE_SECURE=true` detrás de HTTPS y un `SECRET_KEY` estable y aleatorio. No subas `backend/.env` ni `CREDENCIALES_LOCALES.txt` a GitHub.
- Este MVP tiene límite sencillo de peticiones por IP en memoria. Para web pública usa protección adicional, registro de auditoría, respaldo cifrado de datos y gestión de acceso por roles si crece el equipo.
- Completa y valida los textos de privacidad, condiciones de uso, titularidad, RUC, colegio/habilitación profesional, autorizaciones de imagen/nombres y políticas de conservación de consultas, según corresponda. El formulario no se debe utilizar para enviar evidencia o datos altamente sensibles.
- Verifica el contenido jurídico, la publicidad profesional y la información del equipo antes del lanzamiento.
- Prueba cuidadosamente el entorno real (sesiones, proxy, copias de seguridad y manejo de datos personales). No se incluye pasarela de pagos ni calendario externo todavía.

## Rutas de API

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/consultas` | Registrar solicitud validada |
| POST | `/api/admin/login` | Iniciar sesión |
| GET | `/api/admin/me` | Verificar sesión |
| POST | `/api/admin/logout` | Cerrar sesión |
| GET | `/api/admin/consultas` | Listar últimas 500 solicitudes |
| PATCH | `/api/admin/consultas/<id>` | Cambiar estado |
| DELETE | `/api/admin/consultas/<id>` | Borrar solicitud |

## Estructura

```
NEXUSFORENSE_WEB/
├─ frontend/
│  ├─ src/            # React, estilos y configuración pública
│  ├─ public/         # Favicon
│  ├─ package.json
│  └─ vite.config.js   # Proxy de /api hacia Flask
├─ backend/
│  ├─ app.py          # API + modelos + panel protegido
│  ├─ requirements.txt
│  └─ .env.example
├─ scripts/
│  └─ bootstrap_env.py
├─ setup_windows.bat
├─ iniciar_web.bat
├─ compilar_produccion.bat
└─ README.md
```

**Nota**: este proyecto es una versión inicial funcional, no un producto publicado ni una garantía de seguridad exhaustiva para casos legales. Los datos de contacto y los perfiles del equipo deben completarse únicamente con información confirmada por la empresa.

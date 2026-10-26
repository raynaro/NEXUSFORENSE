"""Crea secretos locales y contraseña admin aleatoria sin sobrescribir una instalación existente."""
from pathlib import Path
import secrets

from werkzeug.security import generate_password_hash

ROOT = Path(__file__).resolve().parent.parent
ENV = ROOT / 'backend' / '.env'
CREDS = ROOT / 'CREDENCIALES_LOCALES.txt'

if ENV.exists():
    print('Ya existe backend/.env. No se modificó; conserva tus credenciales anteriores.')
else:
    secret = secrets.token_urlsafe(48)
    password = secrets.token_urlsafe(15)
    email = 'admin@nexusforense.local'
    ENV.write_text(
        f'SECRET_KEY={secret}\n'
        f'ADMIN_EMAIL={email}\n'
        f'ADMIN_PASSWORD_HASH={generate_password_hash(password)}\n'
        'DATABASE_URL=\nSESSION_COOKIE_SECURE=false\nDEBUG=false\nPORT=5000\n',
        encoding='utf-8'
    )
    CREDS.write_text(
        'CREDENCIALES DE PRUEBA LOCALES — NO COMPARTIR NI SUBIR A GITHUB\n'
        '=========================================================\n'
        'Acceso: http://localhost:5173/admin\n'
        f'Correo: {email}\n'
        f'Contraseña: {password}\n\n'
        'IMPORTANTE: Cambia la contraseña y correo antes de publicar.\n'
        'Este archivo es local, está excluido por .gitignore.\n',
        encoding='utf-8'
    )
    print('Configuración segura creada en backend/.env')
    print('Credenciales escritas en CREDENCIALES_LOCALES.txt')
    print(f'Administrador: {email}')
    print(f'Contraseña temporal: {password}')

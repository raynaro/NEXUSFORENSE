"""NEXUSFORENSE — API de consultas, almacenamiento y administración."""
from __future__ import annotations

import os
import re
import time
from collections import defaultdict, deque
from datetime import datetime, timezone, timedelta
from functools import wraps
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
load_dotenv(BASE_DIR / '.env')
(BASE_DIR / 'instance').mkdir(exist_ok=True)

app = Flask(__name__, static_folder=str(PROJECT_DIR / 'frontend' / 'dist'), static_url_path='')
app.config.update(
    SECRET_KEY=os.getenv('SECRET_KEY') or os.urandom(32),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    MAX_CONTENT_LENGTH=16 * 1024,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=os.getenv('SESSION_COOKIE_SECURE', 'false').lower() == 'true',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=8),
)

uri = os.getenv('DATABASE_URL', '').strip()
if uri.startswith('postgres://'):
    uri = 'postgresql://' + uri[len('postgres://'):]
if uri.startswith('postgresql://'):
    uri = 'postgresql+psycopg://' + uri[len('postgresql://'):]
if not uri:
    uri = f"sqlite:///{(BASE_DIR / 'instance' / 'nexusforense.sqlite').as_posix()}"
app.config['SQLALCHEMY_DATABASE_URI'] = uri

db = SQLAlchemy(app)

AREAS = {
    'Derecho Penal y Procesal Penal',
    'Peritajes y asesoría forense',
    'Derecho Civil',
    'Derecho de Familia',
    'Derecho Laboral',
    'Derecho Constitucional',
}
MODALIDADES = {'Virtual', 'Presencial', 'Por coordinar'}
ESTADOS = {'Nueva', 'En revisión', 'Contactada', 'Cerrada'}


class Consulta(db.Model):
    __tablename__ = 'consultas'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(180), nullable=False)
    telefono = db.Column(db.String(25), nullable=False)
    area = db.Column(db.String(100), nullable=False)
    modalidad = db.Column(db.String(30), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    acepta_datos = db.Column(db.Boolean, nullable=False)
    estado = db.Column(db.String(30), nullable=False, default='Nueva')
    creada_en = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    def as_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'telefono': self.telefono,
            'area': self.area,
            'modalidad': self.modalidad,
            'mensaje': self.mensaje,
            'estado': self.estado,
            'creada_en': self.creada_en.replace(tzinfo=timezone.utc).isoformat(),
        }


with app.app_context():
    db.create_all()

# Límite simple por dirección IP (en memoria). Para múltiples instancias usar Redis/WAF.
request_times = defaultdict(deque)
login_times = defaultdict(deque)


def limited(history, limit, window_seconds):
    ip = request.remote_addr or 'desconocido'
    now = time.monotonic()
    samples = history[ip]
    while samples and samples[0] < now - window_seconds:
        samples.popleft()
    if len(samples) >= limit:
        return True
    samples.append(now)
    return False


def admin_required(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        if session.get('admin') is not True:
            return jsonify(error='Sesión no autorizada.'), 401
        return handler(*args, **kwargs)
    return wrapper


def clean(value):
    return value.strip() if isinstance(value, str) else ''


@app.after_request
def security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Frame-Options'] = 'DENY'
    if request.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response


@app.get('/api/health')
def health():
    return jsonify(status='ok', project='nexusforense')


@app.post('/api/consultas')
def crear_consulta():
    if limited(request_times, 8, 3600):
        return jsonify(error='Demasiadas solicitudes. Intenta más tarde.'), 429
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify(error='Datos inválidos.'), 400
    if clean(data.get('website')):
        return jsonify(message='Solicitud recibida.'), 201  # honeypot antispam

    nombre = clean(data.get('nombre'))
    email = clean(data.get('email'))
    telefono = clean(data.get('telefono'))
    area = clean(data.get('area'))
    modalidad = clean(data.get('modalidad'))
    mensaje = clean(data.get('mensaje'))

    if not (3 <= len(nombre) <= 120):
        return jsonify(error='Ingresa un nombre entre 3 y 120 caracteres.'), 400
    if not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email) or len(email) > 180:
        return jsonify(error='El correo electrónico no es válido.'), 400
    if not re.fullmatch(r'[0-9+()\s\-]{7,25}', telefono):
        return jsonify(error='El teléfono no es válido.'), 400
    if area not in AREAS or modalidad not in MODALIDADES:
        return jsonify(error='Selecciona un área y una modalidad válidas.'), 400
    if not (15 <= len(mensaje) <= 2000):
        return jsonify(error='Describe tu consulta entre 15 y 2000 caracteres.'), 400
    if data.get('acepta_datos') is not True:
        return jsonify(error='Debes autorizar el uso de tus datos para recibir respuesta.'), 400

    consulta = Consulta(
        nombre=nombre, email=email.lower(), telefono=telefono, area=area,
        modalidad=modalidad, mensaje=mensaje, acepta_datos=True
    )
    db.session.add(consulta)
    db.session.commit()
    return jsonify(message='Tu solicitud fue registrada correctamente.', id=consulta.id), 201


@app.post('/api/admin/login')
def admin_login():
    if limited(login_times, 10, 900):
        return jsonify(error='Demasiados intentos. Vuelve a intentarlo después.'), 429
    admin_email = os.getenv('ADMIN_EMAIL', '').strip().lower()
    pw_hash = os.getenv('ADMIN_PASSWORD_HASH', '').strip()
    if not admin_email or not pw_hash:
        return jsonify(error='Administrador no configurado. Ejecuta el script de preparación.'), 503
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify(error='Datos inválidos.'), 400
    if (clean(data.get('email')).lower() != admin_email or
            not check_password_hash(pw_hash, str(data.get('password', '')))):
        return jsonify(error='Correo o contraseña incorrectos.'), 401
    session.clear()
    session['admin'] = True
    session['email'] = admin_email
    session.permanent = True
    return jsonify(ok=True, email=admin_email)


@app.get('/api/admin/me')
def admin_me():
    if session.get('admin') is not True:
        return jsonify(authenticated=False), 401
    return jsonify(authenticated=True, email=session.get('email'))


@app.post('/api/admin/logout')
@admin_required
def admin_logout():
    session.clear()
    return jsonify(ok=True)


@app.get('/api/admin/consultas')
@admin_required
def admin_consultas():
    consultas = Consulta.query.order_by(Consulta.creada_en.desc(), Consulta.id.desc()).limit(500).all()
    return jsonify(items=[c.as_dict() for c in consultas], total=Consulta.query.count())


@app.patch('/api/admin/consultas/<int:identificador>')
@admin_required
def actualizar_consulta(identificador):
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify(error='Datos inválidos.'), 400
    estado = clean(data.get('estado'))
    if estado not in ESTADOS:
        return jsonify(error='Estado inválido.'), 400
    consulta = db.session.get(Consulta, identificador)
    if consulta is None:
        return jsonify(error='Consulta no encontrada.'), 404
    consulta.estado = estado
    db.session.commit()
    return jsonify(item=consulta.as_dict())


@app.delete('/api/admin/consultas/<int:identificador>')
@admin_required
def eliminar_consulta(identificador):
    consulta = db.session.get(Consulta, identificador)
    if consulta is None:
        return jsonify(error='Consulta no encontrada.'), 404
    db.session.delete(consulta)
    db.session.commit()
    return jsonify(ok=True)


@app.get('/')
@app.get('/admin')
def index():
    if (PROJECT_DIR / 'frontend' / 'dist' / 'index.html').is_file():
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify(message='Frontend no compilado. Ejecuta npm run dev desde frontend.'), 404


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.getenv('PORT', '5000')), debug=os.getenv('DEBUG', 'false').lower() == 'true')

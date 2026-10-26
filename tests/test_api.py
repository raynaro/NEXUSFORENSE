"""Pruebas básicas de la API. Ejecutar: backend/.venv/Scripts/python.exe -m unittest discover -s tests"""
import os
import sys
import tempfile
import unittest
from pathlib import Path

from werkzeug.security import generate_password_hash

root = Path(__file__).resolve().parents[1]
workdir = tempfile.TemporaryDirectory()
os.environ['DATABASE_URL'] = f"sqlite:///{(Path(workdir.name) / 'test.sqlite').as_posix()}"
os.environ['ADMIN_EMAIL'] = 'prueba@local.test'
os.environ['ADMIN_PASSWORD_HASH'] = generate_password_hash('PruebaSegura!234')
os.environ['SECRET_KEY'] = 'prueba-local-secreta-de-prueba-no-publicar'
sys.path.insert(0, str(root / 'backend'))
from app import app, db, Consulta  # noqa: E402

class TestNexusforense(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        with app.app_context():
            db.drop_all()
            db.create_all()

    def test_health(self):
        self.assertEqual(self.client.get('/api/health').status_code, 200)

    def test_auth_required(self):
        self.assertEqual(self.client.get('/api/admin/consultas').status_code, 401)

    def test_consulta_validation(self):
        r = self.client.post('/api/consultas', json={'nombre': 'Ana'})
        self.assertEqual(r.status_code, 400)

    def test_full_workflow(self):
        payload = {
            'nombre': 'Persona de prueba', 'email': 'correo@ejemplo.com',
            'telefono': '+51 999 888 777', 'area': 'Derecho Civil',
            'modalidad': 'Virtual', 'mensaje': 'Solicito información sobre un contrato civil.',
            'acepta_datos': True,
        }
        creation = self.client.post('/api/consultas', json=payload)
        self.assertEqual(creation.status_code, 201)
        ident = creation.json['id']
        login = self.client.post('/api/admin/login', json={
            'email':'prueba@local.test','password':'PruebaSegura!234'
        })
        self.assertEqual(login.status_code, 200)
        listing = self.client.get('/api/admin/consultas')
        self.assertEqual(listing.json['total'],1)
        updated = self.client.patch(f'/api/admin/consultas/{ident}',json={'estado':'Contactada'})
        self.assertEqual(updated.json['item']['estado'],'Contactada')
        self.assertEqual(self.client.delete(f'/api/admin/consultas/{ident}').status_code, 200)
        self.assertEqual(self.client.get('/api/admin/consultas').json['total'], 0)
        self.assertEqual(self.client.post('/api/admin/logout').status_code, 200)
        self.assertEqual(self.client.get('/api/admin/consultas').status_code, 401)

if __name__ == '__main__':
    unittest.main()

PROPIETARIO CREDENCIALES: 

  
  "email": "juan@gmail.com",
  "password": "123456",

ADMIN CREDENCIALES: 

  
  "email": "carlos.admin@ejemplo.com", 
  "password": "123456",

INQUILINO CREDENCIALES: 

  
"email": "ana.lopez.test@gmail.com",
  "password": "123456",



----- FUNCIONES DEL PROPIETARIO------------------

http://localhost:4000/api/auth/register

http://localhost:4000/api/auth/login

http://localhost:4000/api/edificios

http://localhost:4000/api/usuarios/admin

http://localhost:4000/api/edificios/asignar-admin

http://localhost:4000/api/edificios/upgrade-plan

http://localhost:4000/api/edificios/{edificioId}/historial


----- FUNCIONES DEL ADMINISTRADOR------------------

http://localhost:4000/api/auth/login

http://localhost:4000/api/unidades

http://localhost:4000/api/usuarios/inquilino-usuario ->crear usuario con rol inquilinos

http://localhost:4000/api/usuarios/inquilinos-usuarios ->Listar inquilinos usuarios

http://localhost:4000/api/inquilinos  ->Con esta ruta se crea el inquilino y se le asigna le cuarto

http://localhost:4000/api/vehiculos

------COMANDOS PARA CORRER LA IA------------------

pip install -r requirements.txt

python detection_service.py

------COMANDOS PARA CORRER EL PROYECTO-------------

npm install

npx prisma generate

npm run dev

"# Depamanager-repo3" 
"# Depamanager-Vers3" 

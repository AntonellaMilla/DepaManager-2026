# 🏢 DepaManager

### Plataforma web para la gestión de departamentos y seguridad residencial

DepaManager es una aplicación web desarrollada como proyecto **Capstone / Tesis**, orientada a facilitar la administración de edificios, departamentos, usuarios e inquilinos mediante una plataforma centralizada.

El sistema implementa **control de acceso basado en roles**, permitiendo gestionar diferentes funcionalidades según el tipo de usuario: **Propietario, Administrador e Inquilino**.

Además, incorpora un módulo de **inteligencia artificial para la detección y reconocimiento de placas vehiculares**, orientado a mejorar la seguridad y el control de acceso al edificio.
<img width="1061" height="575" alt="image" src="https://github.com/user-attachments/assets/576a9b7f-3c2e-41cd-8422-cab5ac69be58" />

---

## ✨ Funcionalidades principales

### 👤 Propietario

* Registro e inicio de sesión.
* Creación y gestión de edificios.
* Asignación de administradores.
* Gestión de planes.
* Consulta del historial del edificio.
* Administración de usuarios y permisos.

### 🛠️ Administrador

* Gestión de unidades/departamentos.
* Registro de inquilinos.
* Creación de usuarios con rol de inquilino.
* Consulta y gestión de inquilinos.
* Registro y gestión de vehículos.
* Administración de las unidades del edificio.

### 🏠 Inquilino

* Acceso mediante autenticación.
* Consulta de información relacionada con su unidad.
* Gestión de información personal y vehículos según los permisos establecidos.

### 🤖 Inteligencia Artificial

* Detección de placas vehiculares mediante procesamiento de imágenes.
* Servicio independiente desarrollado en Python.
* Integración del servicio de detección con la plataforma.

---

## 🧑‍💻 Tecnologías utilizadas

### Frontend

* React
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Prisma ORM
* REST API
* JWT

### Base de datos

* PostgreSQL

### Inteligencia Artificial

* Python
* OpenCV
* EasyOCR

### Herramientas

* Git
* GitHub
* Figma

---

## 🏗️ Arquitectura

El proyecto está compuesto por diferentes servicios que se comunican mediante APIs:

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ React + Vite        │
                    │ Tailwind CSS        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Node.js + Prisma    │
                    │ JWT Authentication  │
                    └───────┬───────┬─────┘
                            │       │
                            ▼       ▼
                    ┌──────────┐  ┌──────────────┐
                    │PostgreSQL│  │ AI Service   │
                    │ Database │  │ Python       │
                    └──────────┘  │ OpenCV/OCR   │
                                  └──────────────┘
```

---

## 🔐 Control de acceso

DepaManager utiliza diferentes roles para controlar el acceso a las funcionalidades del sistema:

| Rol               | Función principal                                   |
| ----------------- | --------------------------------------------------- |
| 👤 Propietario    | Gestión general del edificio                        |
| 🛠️ Administrador | Gestión de unidades e inquilinos                    |
| 🏠 Inquilino      | Acceso a funcionalidades relacionadas con su unidad |

La autenticación se realiza mediante **JWT** y las rutas están protegidas según el rol del usuario.

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/AntonellaMilla/Depamanager-Vers3.git
cd Depamanager-Vers3
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Prisma

```bash
npx prisma generate
```

> ⚠️ Asegúrate de configurar previamente las variables de entorno necesarias para la conexión con PostgreSQL.

### 4. Ejecutar el backend

```bash
npm run dev
```

---

## 🤖 Ejecutar el servicio de IA

El servicio de detección utiliza Python.

Instala las dependencias:

```bash
pip install -r requirements.txt
```

Luego ejecuta:

```bash
python detection_service.py
```

---

## 🔑 Usuarios de demostración

Para probar las diferentes funcionalidades del sistema, se pueden utilizar cuentas de demostración correspondientes a los siguientes roles:

```text
Propietario
Administrador
Inquilino
```

> 🔒 Las credenciales de demostración no se incluyen en este repositorio público. Si necesitas acceder a una cuenta de prueba, consulta la documentación del proyecto.

---

## 📌 Endpoints principales

### Autenticación

```text
POST /api/auth/register
POST /api/auth/login
```

### Propietario

```text
GET/POST /api/edificios
GET /api/usuarios/admin
POST /api/edificios/asignar-admin
POST /api/edificios/upgrade-plan
GET /api/edificios/{edificioId}/historial
```

### Administrador

```text
GET/POST /api/unidades
POST /api/usuarios/inquilino-usuario
GET /api/usuarios/inquilinos-usuarios
POST /api/inquilinos
GET/POST /api/vehiculos
```

> Los métodos HTTP pueden variar según la operación implementada en cada endpoint.

---

## 📚 Proyecto académico

**DepaManager** fue desarrollado como proyecto **Capstone / Tesis** de la carrera de Diseño y Desarrollo de Software en **TECSUP**.

El proyecto integra desarrollo web, gestión de bases de datos, autenticación, control de acceso e inteligencia artificial en una solución orientada a la gestión residencial.

---

## 👩🏻‍💻 Autora

**Antonella Milla Aguirre**

🎓 Diseño y Desarrollo de Software — TECSUP
💻 Desarrolladora Frontend / Backend Junior

[LinkedIn](https://www.linkedin.com/in/antonella-blanca-milla-aguirre-754134368/) · [GitHub](https://github.com/AntonellaMilla)

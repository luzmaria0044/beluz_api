# Beluz Platform API

Backend API para la plataforma Beluz construido con NestJS, TypeScript, MySQL y autenticación JWT con sistema de roles y permisos (RBAC).

## Características

- **Autenticación JWT** - Login, registro, refresh tokens
- **Sistema RBAC** - Roles y permisos granulares
- **TypeORM** - ORM para MySQL
- **Validación** - DTOs con class-validator
- **Swagger** - Documentación automática de API
- **Guards personalizados** - Protección de rutas por roles y permisos
- **Arquitectura modular** - Código organizado y escalable

## Requisitos

- Node.js >= 18
- MySQL >= 8.0
- Yarn

## Instalación

1. Clonar el repositorio e instalar dependencias:

```bash
yarn install
```

2. Copiar el archivo de variables de entorno:

```bash
cp .env.example .env
```

3. Configurar las variables de entorno en `.env`:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=beluz_db
DB_SYNCHRONIZE=true
DB_LOGGING=true

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRATION=7d

# Bcrypt
BCRYPT_ROUNDS=10

# CORS
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

4. Crear la base de datos MySQL:

```bash
mysql -u root -p -e "CREATE DATABASE beluz_db;"
```

O usando un cliente MySQL GUI o PhpMyAdmin.

5. **IMPORTANTE:** Ejecutar el seed inicial para crear roles y super admin:

```bash
yarn seed
```

Esto creará:
- Los 5 roles del sistema (SUPER_ADMIN, ADMIN, MANAGER, USER, GUEST)
- Un usuario Super Admin inicial:
  - **Email:** `admin@beluz.com`
  - **Password:** `Admin123!`

**IMPORTANTE:** Cambia esta contraseña después del primer login en producción.

## Scripts

```bash
# Desarrollo
yarn start:dev

# Seed inicial (roles y super admin)
yarn seed

# Producción
yarn build
yarn start:prod

# Tests
yarn test
yarn test:watch
yarn test:cov
```

## Estructura del Proyecto

```
src/
├── common/
│   ├── decorators/         # Decoradores personalizados (@Roles, @Permissions, etc.)
│   ├── guards/             # Guards de autenticación y autorización
│   ├── filters/            # Exception filters
│   ├── interceptors/       # Interceptores
│   ├── pipes/              # Pipes de validación
│   ├── interfaces/         # Interfaces compartidas
│   └── enums/              # Enums (Role, Permission)
├── config/                 # Configuraciones
├── modules/
│   ├── auth/               # Módulo de autenticación
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/              # Módulo de usuarios
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── roles/              # Módulo de roles
│       ├── dto/
│       ├── entities/
│       ├── roles.controller.ts
│       ├── roles.service.ts
│       └── roles.module.ts
├── app.module.ts
└── main.ts
```

## API Endpoints

### Autenticación

#### Registro
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Respuesta:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": [...]
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer {accessToken}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usuarios

Todos los endpoints requieren autenticación con Bearer token.

#### Listar usuarios
```http
GET /api/v1/users
Authorization: Bearer {accessToken}
```
Requiere permiso: `READ_USER`

#### Obtener usuario por ID
```http
GET /api/v1/users/{id}
Authorization: Bearer {accessToken}
```
Requiere permiso: `READ_USER`

#### Crear usuario
```http
POST /api/v1/users
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "Password123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "roleIds": ["role-uuid-1", "role-uuid-2"]
}
```
Requiere rol: `ADMIN` o `SUPER_ADMIN`
Requiere permiso: `CREATE_USER`

#### Actualizar usuario
```http
PATCH /api/v1/users/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "Jane Updated",
  "isActive": true
}
```
Requiere permiso: `UPDATE_USER`

#### Eliminar usuario
```http
DELETE /api/v1/users/{id}
Authorization: Bearer {accessToken}
```
Requiere rol: `ADMIN` o `SUPER_ADMIN`
Requiere permiso: `DELETE_USER`

### Roles

#### Listar roles
```http
GET /api/v1/roles
Authorization: Bearer {accessToken}
```
Requiere permiso: `READ_ROLE`

#### Crear rol
```http
POST /api/v1/roles
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "manager",
  "description": "Manager role",
  "permissions": ["read_user", "update_user"]
}
```
Requiere rol: `SUPER_ADMIN`
Requiere permiso: `CREATE_ROLE`

#### Actualizar rol
```http
PATCH /api/v1/roles/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "description": "Updated description",
  "permissions": ["read_user", "update_user", "view_analytics"]
}
```
Requiere rol: `SUPER_ADMIN`
Requiere permiso: `UPDATE_ROLE`

#### Eliminar rol
```http
DELETE /api/v1/roles/{id}
Authorization: Bearer {accessToken}
```
Requiere rol: `SUPER_ADMIN`
Requiere permiso: `DELETE_ROLE`

## Sistema de Roles y Permisos

### Roles Disponibles

- `SUPER_ADMIN` - Acceso total al sistema
- `ADMIN` - Administrador con permisos limitados
- `MANAGER` - Gestor con permisos específicos
- `USER` - Usuario estándar
- `GUEST` - Invitado con acceso limitado

### Permisos Disponibles

**Usuarios:**
- `CREATE_USER` - Crear usuarios
- `READ_USER` - Leer información de usuarios
- `UPDATE_USER` - Actualizar usuarios
- `DELETE_USER` - Eliminar usuarios

**Roles:**
- `CREATE_ROLE` - Crear roles
- `READ_ROLE` - Leer roles
- `UPDATE_ROLE` - Actualizar roles
- `DELETE_ROLE` - Eliminar roles

**Sistema:**
- `MANAGE_SYSTEM` - Gestión del sistema
- `VIEW_ANALYTICS` - Ver analíticas
- `EXPORT_DATA` - Exportar datos

### Uso de Decoradores

```typescript
import { Roles } from '@common/decorators/roles.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { Role } from '@common/enums/role.enum';
import { Permission } from '@common/enums/permission.enum';

@Controller('example')
export class ExampleController {
  // Proteger por rol
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin-only')
  adminOnlyRoute() {
    return 'Only admins can see this';
  }

  // Proteger por permisos
  @Permissions(Permission.READ_USER, Permission.UPDATE_USER)
  @Get('with-permissions')
  withPermissions() {
    return 'Requires specific permissions';
  }

  // Ruta pública (sin autenticación)
  @Public()
  @Get('public')
  publicRoute() {
    return 'Anyone can access this';
  }
}
```

## Documentación Swagger

Una vez iniciado el servidor, puedes acceder a la documentación interactiva en:

```
http://localhost:3000/api/docs
```

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT tokens con expiración configurable
- Refresh tokens para renovación segura
- Guards de autorización por roles y permisos
- Validación de DTOs con class-validator
- CORS configurable

## Configuración de Producción

1. Cambiar `DB_SYNCHRONIZE=false` en producción
2. Usar migraciones para cambios en base de datos
3. Configurar secretos JWT fuertes
4. Habilitar HTTPS
5. Configurar CORS apropiadamente
6. Revisar logs y monitoreo

## Próximos Pasos

Para extender la funcionalidad:

1. Agregar más módulos en `src/modules/`
2. Crear nuevos permisos en [permission.enum.ts](src/common/enums/permission.enum.ts)
3. Implementar middleware personalizado en `src/common/`
4. Agregar validaciones específicas en DTOs
5. Implementar testing unitario y e2e

## Licencia

MIT

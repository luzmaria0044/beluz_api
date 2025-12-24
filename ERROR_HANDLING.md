# Manejo de Errores y Validaciones

Este documento describe cómo funciona el sistema de manejo de errores en la API de Beluz.

## Backend (NestJS)

### 1. Filtro Global de Excepciones

Ubicación: [src/common/filters/http-exception.filter.ts](src/common/filters/http-exception.filter.ts)

Este filtro captura todas las excepciones y las formatea de manera consistente:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "La imagen de portada es obligatoria",
  "timestamp": "2025-12-23T23:00:00.000Z"
}
```

**Características:**
- Captura excepciones HTTP y errores genéricos
- Formatea mensajes de validación (arrays) en strings legibles
- Incluye timestamp para debugging
- Respuesta consistente en toda la API

### 2. Validaciones con class-validator

Todos los DTOs utilizan decoradores de `class-validator` con mensajes personalizados en español:

**Ejemplo:**
```typescript
@IsString({ message: 'El título debe ser un texto válido' })
@IsNotEmpty({ message: 'El título es obligatorio' })
@MinLength(10, { message: 'El título debe tener al menos 10 caracteres' })
@MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
title: string;
```

### 3. Configuración Global

En [src/main.ts](src/main.ts):

```typescript
// Filtro de excepciones global
app.useGlobalFilters(new HttpExceptionFilter());

// ValidationPipe configurado
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

## Frontend (React + TanStack Query)

### 1. Cliente API Mejorado

Ubicación: [my-real-estate-hub/src/lib/api-client.ts](../../my-real-estate-hub/src/lib/api-client.ts)

El cliente procesa automáticamente los errores del backend:

```typescript
// Si message es un array (errores de validación), formatearlos
if (Array.isArray(errorMessage)) {
  errorMessage = errorMessage.join(', ');
}
```

### 2. Manejo de Errores en Hooks

Todos los hooks de mutación (crear, actualizar, eliminar) muestran mensajes específicos:

**Ejemplo:**
```typescript
onError: (error: any) => {
  const errorMessage = error.message || "No se pudo crear el post.";

  toast({
    title: "Error al crear el post",
    description: errorMessage,
    variant: "destructive",
  });
}
```

### 3. Hooks Actualizados

- ✅ [useBlogPosts.ts](../../my-real-estate-hub/src/hooks/useBlogPosts.ts)
- ✅ [useProperties.ts](../../my-real-estate-hub/src/hooks/useProperties.ts)
- ✅ [useAuth.ts](../../my-real-estate-hub/src/hooks/useAuth.ts)

## DTOs con Validaciones

### Blog Posts

[src/modules/blog/dto/create-blog-post.dto.ts](src/modules/blog/dto/create-blog-post.dto.ts)

**Validaciones implementadas:**
- ✅ Título: obligatorio, 10-200 caracteres
- ✅ Imagen de portada: obligatoria
- ✅ Categoría: enum válido, obligatoria
- ✅ Contenido: obligatorio, mínimo 100 caracteres
- ✅ Extracto: opcional, máximo 300 caracteres
- ✅ Estado: enum válido
- ✅ Meta descripción: opcional, máximo 160 caracteres
- ✅ Tags: array de strings
- ✅ Destacado: booleano

### Properties

**Pendiente**: Aplicar el mismo patrón de mensajes personalizados.

### Users

**Pendiente**: Aplicar el mismo patrón de mensajes personalizados.

## Flujo Completo de Error

1. **Usuario envía datos inválidos** → Frontend
2. **Petición HTTP** → Backend API
3. **ValidationPipe valida DTO** → Genera excepciones con mensajes personalizados
4. **HttpExceptionFilter captura** → Formatea respuesta JSON
5. **Frontend recibe error** → api-client procesa el mensaje
6. **Hook onError ejecuta** → Muestra toast al usuario

## Ejemplo de Respuesta de Error

### Validación Fallida (400)

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "La imagen de portada es obligatoria",
    "El contenido debe tener al menos 100 caracteres"
  ],
  "timestamp": "2025-12-23T23:00:00.000Z"
}
```

### No Autorizado (401)

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "User not found",
  "timestamp": "2025-12-23T23:00:00.000Z"
}
```

### Recurso No Encontrado (404)

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Blog post not found",
  "timestamp": "2025-12-23T23:00:00.000Z"
}
```

## Mejores Prácticas

1. **Siempre agregar mensajes personalizados** a las validaciones de DTOs
2. **Usar español** para mensajes dirigidos al usuario final
3. **Ser específico** sobre qué campo falló y por qué
4. **Incluir límites** en los mensajes (ej: "máximo 200 caracteres")
5. **Capturar error.message** en el frontend para mostrar al usuario
6. **Loggear errores completos** en la consola para debugging

## Tareas Pendientes

- [ ] Aplicar mensajes personalizados a Properties DTOs
- [ ] Aplicar mensajes personalizados a Users DTOs
- [ ] Aplicar mensajes personalizados a Roles DTOs
- [ ] Crear tests para validaciones
- [ ] Documentar errores comunes en Swagger

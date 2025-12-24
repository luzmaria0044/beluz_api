# API Endpoints Documentation

Base URL: `http://localhost:3000/api/v1`

## Authentication

### POST /auth/register
- **Access**: Public
- **Description**: Register a new user
- **Auth Required**: No

### POST /auth/login
- **Access**: Public
- **Description**: Login with email and password
- **Auth Required**: No
- **Returns**: JWT access token and refresh token

### POST /auth/logout
- **Access**: Authenticated
- **Description**: Logout current user
- **Auth Required**: Yes (JWT)

### POST /auth/refresh
- **Access**: Authenticated
- **Description**: Refresh access token
- **Auth Required**: Yes (JWT)

---

## Users

**Base Guards**: All endpoints require JWT authentication

### POST /users
- **Roles**: Admin, Super Admin
- **Permissions**: `create_user`
- **Description**: Create a new user

### GET /users
- **Permissions**: `read_user`
- **Description**: Get all users

### GET /users/:id
- **Permissions**: `read_user`
- **Description**: Get user by ID

### PATCH /users/:id
- **Permissions**: `update_user`
- **Description**: Update user

### DELETE /users/:id
- **Roles**: Admin, Super Admin
- **Permissions**: `delete_user`
- **Description**: Delete user

---

## Roles

**Base Guards**: All endpoints require JWT authentication

### POST /roles
- **Roles**: Super Admin only
- **Permissions**: `create_role`
- **Description**: Create a new role

### GET /roles
- **Permissions**: `read_role`
- **Description**: Get all roles

### GET /roles/:id
- **Permissions**: `read_role`
- **Description**: Get role by ID

### PATCH /roles/:id
- **Roles**: Super Admin only
- **Permissions**: `update_role`
- **Description**: Update role

### DELETE /roles/:id
- **Roles**: Super Admin only
- **Permissions**: `delete_role`
- **Description**: Delete role

---

## Properties

### POST /properties
- **Roles**: Admin, Super Admin
- **Permissions**: `create_property`
- **Auth Required**: Yes (JWT)
- **Description**: Create a new property

### GET /properties
- **Access**: Public
- **Description**: Get all properties
- **Auth Required**: No

### GET /properties/by-type/:type
- **Access**: Public
- **Description**: Get properties by type
- **Auth Required**: No

### GET /properties/by-operation/:operation
- **Access**: Public
- **Description**: Get properties by operation (Sale/Rent)
- **Auth Required**: No

### GET /properties/:id
- **Access**: Public
- **Description**: Get property by ID
- **Auth Required**: No

### PATCH /properties/:id
- **Permissions**: `update_property`
- **Auth Required**: Yes (JWT)
- **Description**: Update property

### DELETE /properties/:id
- **Roles**: Admin, Super Admin
- **Permissions**: `delete_property`
- **Auth Required**: Yes (JWT)
- **Description**: Delete property

---

## Blog

### POST /blog
- **Roles**: Admin, Super Admin
- **Permissions**: `create_blog_post`
- **Auth Required**: Yes (JWT)
- **Description**: Create a new blog post

### GET /blog
- **Permissions**: `read_blog_post`
- **Auth Required**: Yes (JWT)
- **Description**: Get all blog posts (including drafts)

### GET /blog/published
- **Access**: Public
- **Description**: Get all published blog posts
- **Auth Required**: No

### GET /blog/featured
- **Access**: Public
- **Description**: Get featured blog posts
- **Auth Required**: No

### GET /blog/category/:category
- **Access**: Public
- **Description**: Get blog posts by category
- **Auth Required**: No

### GET /blog/tag/:tag
- **Access**: Public
- **Description**: Get blog posts by tag
- **Auth Required**: No

### GET /blog/slug/:slug
- **Access**: Public
- **Description**: Get blog post by slug (increments view count)
- **Auth Required**: No

### GET /blog/:id
- **Permissions**: `read_blog_post`
- **Auth Required**: Yes (JWT)
- **Description**: Get blog post by ID

### PATCH /blog/:id
- **Permissions**: `update_blog_post`
- **Auth Required**: Yes (JWT)
- **Description**: Update blog post

### DELETE /blog/:id
- **Roles**: Admin, Super Admin
- **Permissions**: `delete_blog_post`
- **Auth Required**: Yes (JWT)
- **Description**: Delete blog post

---

## Super Admin Permissions

The Super Admin role now has ALL 19 permissions:

**Users**:
- create_user
- read_user
- update_user
- delete_user

**Roles**:
- create_role
- read_role
- update_role
- delete_role

**Properties**:
- create_property
- read_property
- update_property
- delete_property

**Blog**:
- create_blog_post
- read_blog_post
- update_blog_post
- delete_blog_post

**General**:
- manage_system
- view_analytics
- export_data

---

## Important Notes

1. **JWT Token**: For authenticated endpoints, include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

2. **Login Credentials**:
   - Email: `admin@beluz.com`
   - Password: `Admin123!`

3. **After Permission Update**: You must login again to get a new JWT token with updated permissions.

4. **Public vs Protected**:
   - Public endpoints: Can be accessed without authentication
   - Protected endpoints: Require valid JWT token
   - Some protected endpoints also require specific roles and/or permissions

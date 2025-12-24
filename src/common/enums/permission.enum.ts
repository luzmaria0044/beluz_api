export enum Permission {
  // Users permissions
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',

  // Roles permissions
  CREATE_ROLE = 'create_role',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',

  // Properties permissions
  CREATE_PROPERTY = 'create_property',
  READ_PROPERTY = 'read_property',
  UPDATE_PROPERTY = 'update_property',
  DELETE_PROPERTY = 'delete_property',

  // Blog permissions
  CREATE_BLOG_POST = 'create_blog_post',
  READ_BLOG_POST = 'read_blog_post',
  UPDATE_BLOG_POST = 'update_blog_post',
  DELETE_BLOG_POST = 'delete_blog_post',

  // General permissions
  MANAGE_SYSTEM = 'manage_system',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
}

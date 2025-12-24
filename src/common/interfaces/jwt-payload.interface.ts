import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
}

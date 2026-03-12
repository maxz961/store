import { IsEnum } from 'class-validator';
import { Role } from '@store/shared';

export class UpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}

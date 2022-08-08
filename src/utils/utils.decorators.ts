import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { EUserRole } from '@modules/user';

export const Role = (role: keyof typeof EUserRole): CustomDecorator<string> => SetMetadata('role', role);

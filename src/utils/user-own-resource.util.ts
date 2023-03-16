import { User } from '@/entities/user.entity';

export function isUserOwnResource(user: User, resource: any): boolean {
  return user.id === resource.userId;
}

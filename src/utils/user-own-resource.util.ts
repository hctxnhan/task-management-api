import { User } from '@/entities/user.entity';
import { IUserOwnResource } from '@/types/user-own-resource.interface';

export function isUserOwnResource(
  user: User,
  resource: IUserOwnResource,
): boolean {
  return user.id === resource.userId;
}

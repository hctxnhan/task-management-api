export interface IUserOwnResource {
  userId: number;
}

export function resourceHasUserOwner(resource: any) {
  return resource.hasOwnProperty('userId');
}

import { compare, genSalt, hash } from 'bcrypt';

export async function hashedPassword(
  plainTextPassword: string,
): Promise<string> {
  const salt = await genSalt();
  return hash(plainTextPassword, salt);
}

export async function checkPassword(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(plainTextPassword, hashedPassword);
}

import { User } from "../models/user"

export interface UserStore {
  createUser(email: string, passwordHash: string): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  setUsername(id: string, username: string): Promise<void>;
  incrementFailedAttempts(email: string): Promise<void>;
  resetFailedAttempts(email: string): Promise<void>;
  lockAccount(email: string, until: Date): Promise<void>;
}

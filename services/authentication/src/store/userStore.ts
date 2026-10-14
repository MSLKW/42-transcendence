import { User } from "../models/user"

export interface UserStore {
  createUser(email: string, passwordHash: string): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  setUsername(id: string, username: string): Promise<void>;
  incrementFailedAttempts(id: string): Promise<void>;
  resetFailedAttempts(id: string): Promise<void>;
  lockAccount(id: string, until: Date): Promise<void>;
}

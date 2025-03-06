import { Role } from "./user";

export interface AuthResponse {
  username: string;
  email: string;
  role: Role;
}

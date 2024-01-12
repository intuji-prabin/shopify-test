import { UserRole } from "../constants/auth.constent";

// Checks if the user is a super admin user
export const isSuperAdminUser = (role: number): boolean => {
  return role === UserRole.SUPER_ADMIN;
};
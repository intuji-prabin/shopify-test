// roles.tsx
import {AbilityBuilder, createMongoAbility} from '@casl/ability';

export const PERMISSIONS = {
  MANAGE: 'manage',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
};

export function defineAbilitiesForAdmin() {
  const {can, cannot, rules} = new AbilityBuilder(createMongoAbility);
  // Admin has full manage permissions for all models
  can(PERMISSIONS.MANAGE, 'all');
  return createMongoAbility(rules);
}

export function defineAbilitiesForUser(permissions: any[]) {
  const {can, cannot, rules} = new AbilityBuilder(createMongoAbility);
  // Dynamically set permissions based on data fetched from API
  permissions.forEach((permission) => {
    can(permission.key, permission.value);
  });
  return createMongoAbility(rules);
}

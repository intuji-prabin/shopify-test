// roles.tsx
import {AbilityBuilder, createMongoAbility} from '@casl/ability';

export const PERMISSIONS = {
  MANAGE: 'manage',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
};

/**
 * Defines the abilities for an admin user.
 *
 * @return {MongoAbility} The created MongoAbility instance.
 */
export function defineAbilitiesForAdmin() {
  // Create a new AbilityBuilder with MongoAbility.
  const {can, cannot, rules} = new AbilityBuilder(createMongoAbility);

  // Admin has full 'manage' permissions for all models.
  can(PERMISSIONS.MANAGE, 'all');

  // Create a MongoAbility instance with the defined rules.
  return createMongoAbility(rules);
}

/**
 * Defines the abilities for a user based on the given permissions.
 *
 * @param {Array} permissions - An array of permissions.
 * @return {MongoAbility} The created MongoAbility instance.
 */
export function defineAbilitiesForUser(permissions: any[]) {
  // Create a new AbilityBuilder with MongoAbility.
  const {can, cannot, rules} = new AbilityBuilder(createMongoAbility);
  
  // Dynamically set 'view' permissions based on the given permissions.
  // For each permission in the permissions array, grant 'view' permission.
  permissions.forEach((permission) => {
    can('view', permission.value);
  });

  // Create a MongoAbility instance with the defined rules.
  return createMongoAbility(rules);
}


/**
 * Defines the abilities for a user based on the given permissions.
 *
 * @param {Array} permissions - An array of permissions.
 * @return {MongoAbility} The created MongoAbility instance.
 */
// export function defineAbilitiesForUser(permissions: any[]) {
//   // Create a new AbilityBuilder with MongoAbility.
//   const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);
  
//   // Dynamically set 'view' permissions based on the given permissions.
//   // For each permission in the permissions array, deny 'view' permission.
//   permissions.forEach((permission) => {
//     // Deny 'view' permission for the given permission.value
//     cannot('view', permission.value);
//   });

//   // Create a MongoAbility instance with the defined rules.
//   return createMongoAbility(rules);
// }


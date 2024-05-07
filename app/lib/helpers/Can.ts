import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { createMongoAbility } from '@casl/ability';


/**
 * This module exports a default Ability instance, an Ability Context, and a
 * Can component.
 * 
 * The Ability instance is the default instance that can be used if a user
 * doesn't want to create their own.
 * 
 * The Ability Context is a React Context that holds the Ability instance. The
 * Can component uses this Context to get the current Ability instance.
 * 
 * The Can component is a wrapper around a component that checks if the user is
 * allowed to perform a certain action.
 */

/**
 * The default Ability instance.
 */
export const DEFAULT_ABILITIES = createMongoAbility();

/**
 * The Ability Context is a React Context that holds the Ability instance.
 * The Can component uses this Context to get the current Ability instance.
 */
export const AbilityContext = createContext(DEFAULT_ABILITIES);

/**
 * The Can component is a wrapper around a component that checks if the user
 * is allowed to perform a certain action.
 * 
 * The Can component gets the current Ability instance from the Ability Context
 * and checks if the user is allowed to perform the action specified by the
 * `do` prop.
 * 
 * If the user is allowed to perform the action, the children of the Can
 * component will be rendered. Otherwise, nothing will be rendered.
 * 
 * @example
 * <Can I="view" a="Post">
 *   <button>View Post</button>
 * </Can>
 */
export const Can = createContextualCan(AbilityContext.Consumer);


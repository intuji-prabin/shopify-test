import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { createMongoAbility } from '@casl/ability';

const DEFAULT_ABILITIES = createMongoAbility(); // Use AnyAbility instead of Ability

export const AbilityContext = createContext(DEFAULT_ABILITIES);
export const Can = createContextualCan(AbilityContext.Consumer);

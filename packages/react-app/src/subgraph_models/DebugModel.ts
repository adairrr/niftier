import { Instance } from 'mobx-state-tree';
import { DebugModelBase } from './DebugModel.base';

/* The TypeScript type of an instance of DebugModel */
export interface DebugModelType extends Instance<typeof DebugModel.Type> {}

/* A graphql query fragment builders for DebugModel */
export { selectFromDebug, debugModelPrimitives, DebugModelSelector } from './DebugModel.base';

/**
 * DebugModel
 */
export const DebugModel = DebugModelBase.actions(self => ({
  // This is an auto-generated example action.
  log() {
    console.log(JSON.stringify(self));
  },
}));

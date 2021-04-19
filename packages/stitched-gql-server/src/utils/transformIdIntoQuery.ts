import { WrapQuery } from '@graphql-tools/wrap';
import { Kind, SelectionSetNode } from 'graphql';

const ID_SELECTION = {
  kind: Kind.FIELD,
  name: {
    kind: Kind.NAME,
    value: 'id'
  }
};

export default function transformIdIntoQuery(fieldName: string) {
  return [
    new WrapQuery(
      // path at which to apply wrapping and extracting
      [fieldName],
      (subtree: SelectionSetNode) => {
        let containsId = false;
        const newSelectionSet = {
          kind: Kind.SELECTION_SET,
          selections: subtree.selections.map(selection => {
            // ignore fragments
            if (selection.kind === Kind.INLINE_FRAGMENT ||
              selection.kind === Kind.FRAGMENT_SPREAD) {
              return selection;
            }
            containsId = containsId || (selection.name.value === 'id');
            return selection;
          })
        };

        // we always want the id to be queried because we need it to get the proper result
        if (!containsId) {
          newSelectionSet.selections.push(ID_SELECTION);
        }
        return newSelectionSet;
      },
      // how to process the data result at path
      result => result
    ),
  ];
}

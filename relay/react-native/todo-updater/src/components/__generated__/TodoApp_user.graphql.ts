/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TodoApp_user = {
    readonly id: string;
    readonly userId: string;
    readonly totalCount: number;
    readonly completedCount: number;
    readonly " $fragmentRefs": FragmentRefs<"TodoListFooter_user" | "TodoList_user">;
    readonly " $refType": "TodoApp_user";
};
export type TodoApp_user$data = TodoApp_user;
export type TodoApp_user$key = {
    readonly " $data"?: TodoApp_user$data;
    readonly " $fragmentRefs": FragmentRefs<"TodoApp_user">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "TodoApp_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "userId",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "totalCount",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "completedCount",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TodoListFooter_user",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TodoList_user",
      "args": null
    }
  ]
};
(node as any).hash = 'ecccdb5a17f0428603f76e1bbaa8ea9d';
export default node;

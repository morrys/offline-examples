import React from "react";
import { v4 as uuid } from "uuid";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { USER_TODOS } from "../app";

import TodoTextInput from "../components/TodoTextInput";

export const ADD_TODO = gql`
  mutation AddTodoMutation($input: AddTodoInput!) {
    addTodo(input: $input) {
      todoEdge {
        __typename
        cursor
        node {
          complete
          id
          text
        }
      }
      user {
        id
        totalCount
      }
    }
  }
`;

const AddTodoMutation = ({ user }) => {
  const [addTodo, { data }] = useMutation(ADD_TODO);
  return (
    <TodoTextInput
      className="new-todo"
      placeholder="What needs to be done?"
      onSave={text => {
        const idTodo = uuid();
        const input = {
          clientMutationId: idTodo,
          id: idTodo,
          text,
          userId: user.userId
        };
        const totalCount = user.totalCount + 1;
        addTodo({
          variables: { input },
          optimisticResponse: {
            addTodo: {
              todoEdge: {
                node: {
                  id: idTodo,
                  text: text,
                  complete: false,
                  __typename: "Todo"
                },
                cursor: null,
                __typename: "TodoEdge"
              },
              user: {
                id: user.id,
                totalCount: totalCount
              }
            }
          },
          update: (cache, { data: { addTodo } }) => {
            const {
              todoEdge: { node, __typename }
            } = addTodo;
            const { userId } = user;
            const { user: userCache } = cache.readQuery({
              query: USER_TODOS,
              variables: { userId }
            });
            console.log("queryResult", userCache);
            let {
              todos: { edges },
              ...others
            } = userCache;
            const newEdges = edges.concat([{ node, __typename }]);

            let newUser = {
              ...others,
              todos: {
                edges: newEdges
              }
            };
            console.log("queryResult", newUser);

            cache.writeQuery({
              query: USER_TODOS,
              variables: { userId },
              data: { user: newUser }
            });
          }
        });
      }}
    />
  );
};
export default AddTodoMutation;

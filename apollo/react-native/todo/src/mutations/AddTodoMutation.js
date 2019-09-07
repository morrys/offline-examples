import React from 'react';
import { v4 as uuid } from "uuid";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { USER_TODOS } from "../App";
import { Input } from 'react-native-elements';


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
          __typename
        }
      }
      user {
        id
        totalCount
        __typename
      }
    }
  }
`;

const AddTodoMutation = ({ user }) => {
  return <Mutation
    mutation={ADD_TODO}
  >
    {addTodo => (
      <Input placeholder='What needs to be done?'
        onSubmitEditing={(event) => {
          const text = event.nativeEvent.text;
          console.log("submit", text);
          const idTodo = uuid();
          const input = {
            clientMutationId: idTodo,
            id: idTodo,
            text,
            userId: user.userId,
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
                  totalCount: totalCount,
                  __typename: 'User'
                },
                __typename: 'AddTodoPayload'
              },
              
            },
            update: (cache, { data: { addTodo } }) => {
              const { todoEdge: { node, __typename } } = addTodo;
              const { userId } = user;
              const { user: userCache } = cache.readQuery({ query: USER_TODOS, variables: { userId } });
              console.log("queryResult", userCache)
              const { todos: { edges } } = userCache;
              console.log("insert", { node, __typename} )
              const newEdges = edges.concat([{ node, __typename }])
              userCache.totalCount = addTodo.user.totalCount;
              userCache.todos.edges = newEdges;
              console.log("queryResult", userCache)

              cache.writeQuery({
                query: USER_TODOS,
                variables: { userId },
                data: { user: userCache, __typename: 'User' },
              });
            }
          })
        }
        }
        
      />
    )}
  </Mutation>
}

export default AddTodoMutation;


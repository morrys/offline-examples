// @flow
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import gql from "graphql-tag";
import { USER_TODOS } from "../App";

const mutation = gql`
  mutation RemoveTodoMutation($input: RemoveTodoInput!) {
    removeTodo(input: $input) {
      deletedTodoId
      user {
        completedCount
        totalCount
      }
    }
  }
`;

function commit(
  client,
  todo,
  user,
) {
  const input = {
    id: todo.id,
    userId: user.userId,
  };
  return client.mutate({
    mutation,
    variables: {
      input,
    },
    update: (cache, { data: { removeTodo } }) => {
      const { userId } = user;
      const { user: userCache } = cache.readQuery({ query: USER_TODOS, variables: { userId } });
      console.log("queryResult", userCache)
      const { todos: { edges } } = userCache;
      const newEdges = edges.filter(e => e.node.id !== todo.id)
      userCache.todos.edges = newEdges;
      userCache.totalCount = removeTodo.user.totalCount;
      userCache.completedCount = removeTodo.user.completedCount;
      console.log("queryResult", userCache)

      cache.writeQuery({
        query: USER_TODOS,
        variables: { userId },
        data: { user: userCache },
      });
    },
    optimisticResponse: {
      removeTodo: {
        deletedTodoId: todo.id,
        user: {
          id: user.id,
          completedCount: user.completedCount - (todo.complete ? 1 : 0),
          totalCount: (user.totalCount - 1),
          __typename: 'User'
        },
        __typename: "RemoveTodoPayload"
      },

    },
  });
}

export default { commit };

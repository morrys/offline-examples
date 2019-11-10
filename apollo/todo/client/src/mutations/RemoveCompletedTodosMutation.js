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
import { USER_TODOS } from "../app";

const mutation = gql`
  mutation RemoveCompletedTodosMutation($input: RemoveCompletedTodosInput!) {
    removeCompletedTodos(input: $input) {
      deletedTodoIds
      user {
        completedCount
        totalCount
      }
    }
  }
`;

function commit(client, todos, user) {
  const input = {
    userId: user.userId
  };

  const deletedTodoIds = todos.edges
    ? todos.edges
        .filter(Boolean)
        .map(edge => edge.node)
        .filter(Boolean)
        .filter(node => node.complete)
        .map(node => node.id)
    : [];

  return client.mutate({
    mutation,
    variables: {
      input
    },
    optimisticResponse: {
      removeCompletedTodos: {
        deletedTodoIds,
        user: {
          id: user.id,
          totalCount: user.totalCount - deletedTodoIds.length,
          completedCount: 0,
          __typename: "User"
        },
        __typename: "MarkAllTodosPayload"
      }
    },
    update: (cache, data) => {
      const { userId } = user;
      const { user: userCache } = cache.readQuery({
        query: USER_TODOS,
        variables: { userId }
      });
      console.log("queryResult", userCache);
      const {
        todos: { edges },
        ...others
      } = userCache;
      const newEdges = edges.filter(e => !deletedTodoIds.includes(e.node.id));

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
}

export default { commit };

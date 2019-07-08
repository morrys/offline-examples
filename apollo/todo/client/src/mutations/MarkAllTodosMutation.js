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

const mutation = gql`
  mutation MarkAllTodosMutation($input: MarkAllTodosInput!) {
    markAllTodos(input: $input) {
      changedTodos {
        id
        complete
      }
      user {
        id
        completedCount
      }
    }
  }
`;

function getOptimisticResponse(
  complete,
  todos,
  user,
) {
  // Relay returns Maybe types a lot of times in a connection that we need to cater for
  const validNodes = todos.edges
    ? todos.edges
        .filter(Boolean)
        .map((edge) => edge.node)
        .filter(Boolean)
    : [];

  const changedTodos = validNodes
    .filter((node) => node.complete !== complete)
    .map(
      (node) => ({
        complete: complete,
        id: node.id,
        __typename: "Todo"
      }),
    );

  return {
    markAllTodos: {
      changedTodos,
      user: {
        id: user.id,
        completedCount: complete ? user.totalCount : 0,
        __typename: "User"
      },
      __typename: "MarkAllTodosPayload"
    },
  };
}

function commit(
  client,
  complete,
  todos,
  user,
) {
  const input = {
    complete,
    userId: user.userId,
  };

  return client.mutate({
    mutation,
    variables: {
      input,
    },
    optimisticResponse: getOptimisticResponse(complete, todos, user),
  });
}

export default {commit};

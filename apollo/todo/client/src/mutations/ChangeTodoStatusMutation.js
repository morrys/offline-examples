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
  mutation ChangeTodoStatusMutation($input: ChangeTodoStatusInput!) {
    changeTodoStatus(input: $input) {
      todo {
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

function getOptimisticResponse(complete, todo, user) {
  return {
    changeTodoStatus: {
      todo: {
        complete: complete,
        id: todo.id,
        __typename: "Todo"
      },
      user: {
        __typename: "User",
        id: user.id,
        completedCount: complete
          ? user.completedCount + 1
          : user.completedCount - 1
      },
      __typename: "ChangeTodoStatusPayload"
    }
  };
}

function commit(client, complete, todo, user) {
  const input = {
    complete,
    userId: user.userId,
    id: todo.id
  };
  return client
    .mutate({
      mutation,
      variables: {
        input
      },
      onError: error => console.log("prova"),
      optimisticResponse: getOptimisticResponse(complete, todo, user)
    })
    .catch(error => console.log("error"));
}

export default { commit };

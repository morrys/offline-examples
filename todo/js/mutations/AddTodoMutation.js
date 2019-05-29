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

import {
  commitMutation,
  graphql,
  type Disposable,
  type Environment,
  type RecordProxy,
  type RecordSourceSelectorProxy,
} from 'react-relay-offline';

import {ConnectionHandler} from 'relay-runtime';
import type {TodoApp_user} from 'relay/TodoApp_user.graphql';
import type {AddTodoInput} from 'relay/AddTodoMutation.graphql';

const mutation = graphql`
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

let tempID = 0;

function commit(
  environment: Environment,
  text: string,
  user: TodoApp_user,
): Disposable {
  const input: AddTodoInput = {
    text,
    userId: user.userId,
    clientMutationId: `${tempID++}`,
  };

  const totalCount = user.totalCount + 1;
  const idTot = totalCount+user.completedCount;
  return commitMutation(environment, {
    mutation,
    variables: {
      input,
    },
    optimisticResponse: {
      addTodo: {
        todoEdge: {
          node: {
            id: Buffer.from('Todo:' + idTot, 'utf8').toString('base64'), 
            text: text,
            complete: false
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
    configs: [{
      type: 'RANGE_ADD',
      parentID: user.id,
      connectionInfo: [{
        key: 'TodoList_todos',
        rangeBehavior: 'append',
      }],
      edgeName: 'todoEdge',
    }],
  });
}

export default {commit};

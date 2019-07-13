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
  type RecordSourceSelectorProxy,
} from 'react-relay-offline';

import {ConnectionHandler} from 'relay-runtime';
import type {Todo_user} from 'relay/Todo_user.graphql';
import type {Todo_todo} from 'relay/Todo_todo.graphql';
import type {RemoveTodoInput} from 'relay/RemoveTodoMutation.graphql';

const mutation = graphql`
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
  environment: Environment,
  todo: Todo_todo,
  user: Todo_user,
): Disposable {
  const input: RemoveTodoInput = {
    id: todo.id,
    userId: user.userId,
  };
  return commitMutation(environment, {
    mutation,
    variables: {
      input,
    },
    configs: [{
      type: 'NODE_DELETE',
      deletedIDFieldName: 'deletedTodoId',
    },
     ],
    optimisticResponse: {
      removeTodo: {
        deletedTodoId: todo.id,
        user: {
          id: user.id,
          completedCount: user.completedCount - (todo.complete ? 1 : 0),
          totalCount: (user.totalCount-1)
        },
      },
      
    },
  });
}

export default {commit};

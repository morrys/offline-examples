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

function sharedUpdater(store, user, newEdge) {
  // Get the current user record from the store
  const userProxy = store.get(user.id);

  // Get the user's Todo List using ConnectionHandler helper
  const conn = ConnectionHandler.getConnection(
    userProxy,
    'TodoList_todos', // This is the connection identifier, defined here
    // https://github.com/relayjs/relay-examples/blob/master/todo/js/components/TodoList.js#L76
  );

  // Insert the new todo into the Todo List connection
  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

function commit(
  environment: Environment,
  text: string,
  user: TodoApp_user,
): Disposable {
  const totalCount = user.totalCount + 1;
  const idTot = totalCount + user.completedCount;
  const idTodo = Buffer.from('Todo:' + idTot, 'utf8').toString('base64');
  const input: AddTodoInput = {
    text,
    userId: user.userId,
    clientMutationId: idTodo,
  };

  
  return commitMutation(environment, {
    mutation,
    variables: {
      input,
    },
    updater: store => {
      // Get the payload returned from the server
      const payload = store.getRootField('addTodo');

      // Get the edge of the newly created Todo record
      const newEdge = payload.getLinkedRecord('todoEdge');

      // Add it to the user's todo list
      sharedUpdater(store, user, newEdge);
    },
    optimisticUpdater: store => {
      const id = 'client:newTodo:' + idTodo;
      const node = store.create(id, 'Todo');
      node.setValue(text, 'text');
      node.setValue(id, 'id');
      const newEdge = store.create('client:newEdge:' + idTot, 'TodoEdge');
      newEdge.setLinkedRecord(node, 'node');
      // Add it to the user's todo list
      sharedUpdater(store, user, newEdge);

      // Given that we don't have a server response here,
      // we also need to update the todo item count on the user
      const userRecord = store.get(user.id);
      userRecord.setValue(userRecord.getValue('totalCount') + 1, 'totalCount');
    },
  });
}

export default {commit};

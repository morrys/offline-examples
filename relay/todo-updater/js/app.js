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

import * as React from 'react';

import {graphql} from 'react-relay';
import {QueryRenderer, fetchQuery} from 'react-relay-offline';

import TodoApp from './components/TodoApp';
import type {appQueryResponse} from 'relay/appQuery.graphql';

import environment from './relay';

const AppTodo = props => {
  // ***** added to verify useRestore and fetchQuery ***
  /*const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    Array.from({length: 10},(_,x) =>
    fetchQuery(environment, graphql`
    query appQuery($userId: String) {
      user(id: $userId) {
        ...TodoApp_user
      }
    }
  `, { userId: 'me', }, { force: true }));
    fetchQuery(environment, graphql`
    query appQuery($userId: String) {
      user(id: $userId) {
        ...TodoApp_user
      }
    }
  `, { userId: 'you', })
      .then(data => {
        setLoad(data);
      });
  }, []);
  
  if (!load) {
    return <div>Loading</div>;
  }*/

  // ****************************************************
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query appQuery($userId: String) {
          user(id: $userId) {
            ...TodoApp_user
            totalCount
          }
        }
      `}
      dataFrom="STORE_THEN_NETWORK"
      ttl={10000}
      variables={{
        // Mock authenticated ID that matches database
        userId: 'me',
      }}
      render={({error, props, cached, retry}) => {
        //console.log('QueryRenderer.render:', { cached, error, retry, });
        if (props && props.user) {
          console.log('props.user.totalCount', props.user.totalCount);
          return <TodoApp user={props.user} retry={retry} />;
        } else if (error) {
          return <div>{error.message}</div>;
        }

        return (
          <button onClick={retry} className="refetch">
            Retry
          </button>
        );
      }}
    />
  );
};

const App = <AppTodo />;

export default App;

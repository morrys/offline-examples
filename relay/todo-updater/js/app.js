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

import { graphql } from 'relay-runtime';
import { useQuery, useRestore } from 'react-relay-offline';
import {RelayEnvironmentProvider} from 'relay-hooks';

import TodoApp from './components/TodoApp';

import environment from './relay';

const query = graphql`
query appQuery($userId: String) {
  user(id: $userId) {
    ...TodoApp_user
    totalCount
  }
}
`;

const networkCacheConfig = {
  ttl: 10000
}

const AppTodo = props => {
  const isRehydrated = useRestore(environment);
  console.log('renderer');
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
  const { error, data, isLçading, retry } = useQuery(query, {
    // Mock authenticated ID that matches database
    userId: 'me',
  }, {
    networkCacheConfig,
    skip: !isRehydrated
  })

  
  if (!isRehydrated) {
    console.log('loading');
    return <div />;
  }

  if (data && data.user) {
    console.log('data.user.totalCount', data.user.totalCount);
    return <TodoApp user={data.user} retry={retry} />;
  } else if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <button onClick={retry} className="refetch">
      Retry
    </button>
  );
};

const App = <RelayEnvironmentProvider environment={environment}><AppTodo /></RelayEnvironmentProvider>;

export default App;

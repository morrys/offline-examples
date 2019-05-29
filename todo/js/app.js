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

import 'todomvc-common';

import * as React from 'react';
import ReactDOM from 'react-dom';

import {graphql} from 'react-relay';
import {QueryRenderer} from 'react-relay-offline';
import {
  Network,
  type RequestNode,
  type Variables,
} from 'relay-runtime';
//import { OfflineStore, Store, Environment, RecordSource} from 'react-relay-offline';

import {  Store, Environment, RecordSource} from 'react-relay-offline';
import OfflineStore from 'react-relay-offline/lib/runtime/redux/OfflineStoreIDB'

import TodoApp from './components/TodoApp';
import type {appQueryResponse} from 'relay/appQuery.graphql';

async function fetchQuery(
  operation: RequestNode,
  variables: Variables,
): Promise<{}> {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  return response.json();
}

const network = Network.create(fetchQuery);
const storeOffline = OfflineStore(network);
const source = new RecordSource(storeOffline);
const store = new Store(storeOffline, source);
const modernEnvironment = new Environment({ network, store, dataFrom: "CACHE_FIRST" }, storeOffline);

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <QueryRenderer
      environment={modernEnvironment}
      query={graphql`
        query appQuery($userId: String) {
          user(id: $userId) {
            ...TodoApp_user
          }
        }
      `}
      variables={{
        // Mock authenticated ID that matches database
        userId: 'me',
      }}
      render={({error, props, cached, retry}) => {
        console.log('QueryRenderer.render:', { cached, error, retry, state: modernEnvironment.getStoreOffline().getState(), 
          dataFrom: modernEnvironment.getDataFrom()  });
        if (props && props.user) {
          return <TodoApp user={props.user} />;
        } else if (error) {
          return <div>{error.message}</div>;
        }

        return <div>Loading</div>;
      }}
    />,
    rootElement,
  );
}

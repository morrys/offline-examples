import { Store, Environment } from 'react-relay-offline';

import { Network, FetchFunction } from 'relay-runtime';
export { QueryRenderer, graphql } from 'react-relay-offline';
import RelayNetworkLogger from 'relay-runtime/lib/RelayNetworkLogger'

/**
 * Define fetch query
 */
const fetchQuery: FetchFunction = (operation, variables) => {
  console.log('fetching', operation, variables);
  return fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}
function callbackOffline(type: string, payload: any, error: any) {
  console.log("callbackoffline", type)
  console.log("callbackoffline", payload)
  console.log("callbackoffline", error)
}


/**
 * Network
 */
const network = Network.create(RelayNetworkLogger.wrapFetch(fetchQuery, () => ''));
export default network;

/**
 * Store
 */
export const store = new Store();

/**
 * Environment 
 */
export const environment = new Environment({ network, store }, callbackOffline);
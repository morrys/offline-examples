import {Network} from 'relay-runtime';
import {Store, Environment, RecordSource} from 'react-relay-offline';

// import { Network, RecordSource } from 'relay-runtime'
// import EnvironmentIDB from 'react-relay-offline/lib/runtime/EnvironmentIDB'

import fetch from 'isomorphic-unfetch';

let relayEnvironment: Environment;

// TODO: support offline:
// https://github.com/morrys/react-relay-offline

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(operation, variables, cacheConfig, uploadables) {
  const endpoint = 'http://localhost:3000/graphql';
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  })
    .then(response => response.json())
    .catch(error => console.log('errrrr', error));
}

type InitProps = {
  records?: any;
};

export const manualExecution = false;

export default function initEnvironment(options: InitProps = {}) {
  const {records = {}} = options;

  const createEnvironment = () => {
    const network = Network.create(fetchQuery);

    const offlineOptions = {
      manualExecution, //optional
      network: network, //optional
      onComplete: (options: any) => {
        //optional
        const {id, offlinePayload, snapshot} = options;
        console.log('onComplete', options);
        return true;
      },
      onDiscard: (options: any) => {
        //optio
        const {id, offlinePayload, error} = options;
        console.log('onDiscard', options);
        return true;
      },
    };

    const recordSource = new RecordSource({
      mergeState: () => {
        return records;
      },
    });
    const store = new Store(recordSource);
    return new Environment(
      {
        network,
        store,
      },
      offlineOptions,
    );

    // new
    // const offlineOptions = {}
    // const store = new Store(new RecordSource(records))
    // return new Environment(
    //   {
    //     network,
    //     store,
    //   },
    //   offlineOptions
    // )

    // new IDB
    // const offlineOptions = {}
    // return EnvironmentIDB.create({ network }, offlineOptions)
  };

  if (typeof window === 'undefined') {
    return createEnvironment();
  }

  // reuse Relay environment on client-side
  if (!relayEnvironment) {
    relayEnvironment = createEnvironment();
  }

  return relayEnvironment;
}

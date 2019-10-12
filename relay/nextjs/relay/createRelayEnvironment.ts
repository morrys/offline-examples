// import { Environment, Network, RecordSource, Store } from 'relay-runtime'

import {Network} from 'relay-runtime';
import {Store, Environment, RecordSource} from 'react-relay-offline';

// import { Network } from 'relay-runtime'
// import { Store, Environment, RecordSource } from 'react-relay-offline'

// import { Network, RecordSource } from 'relay-runtime'
// import EnvironmentIDB from 'react-relay-offline/lib/runtime/EnvironmentIDB'

import fetch from 'isomorphic-unfetch';

let relayEnvironment: Environment;

// TODO: support offline:
// https://github.com/morrys/react-relay-offline

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(operation, variables, cacheConfig, uploadables) {
  console.log('calling fetchQuery', typeof window === 'undefined');
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
  console.log(
    'Init environment. Records provided?',
    !(
      !records ||
      (Object.entries(records).length === 0 && records.constructor === Object)
    ),
    records,
    options,
  );

  const createEnvironment = () => {
    // Create a network layer from the fetch function
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

    // Persist the records when instantiating
    // https://github.com/morrys/react-relay-offline/issues/23
    // https://github.com/morrys/wora/issues/16#issuecomment-538788609
    const recordSource = new RecordSource({
      mergeState: () => {
        console.log('This function is never called.', records);
        return records;
      },
    });
    const store = new Store(recordSource);
    console.log('store records json', store.getSource().toJSON());
    console.log('store records', records);
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

  // Make sure to create a new Relay environment for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createEnvironment();
  }

  // reuse Relay environment on client-side
  if (!relayEnvironment) {
    console.log('create');
    relayEnvironment = createEnvironment();
  }

  return relayEnvironment;
}

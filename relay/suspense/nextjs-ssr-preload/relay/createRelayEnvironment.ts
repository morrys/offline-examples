import {Network} from 'relay-runtime';
import {Store, Environment, RecordSource} from 'react-relay-offline';

// import { Network, RecordSource } from 'relay-runtime'
import EnvironmentIDB from 'react-relay-offline/lib/runtime/EnvironmentIDB';

import fetch from 'isomorphic-unfetch';
import {loadLazyQuery} from 'react-relay-offline/lib/runtime/loadQuery';

const prefetch = loadLazyQuery();

let relayEnvironment: any;

// TODO: support offline:
// https://github.com/morrys/react-relay-offline

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(operation, variables, cacheConfig, uploadables) {
  const endpoint = 'http://localhost:3000/graphql';
  console.log('fetch');
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
  }).then(response => response.json());
}

type InitProps = {
  records?: any;
};

export const manualExecution = false;
const network = Network.create(fetchQuery);

function createLocalStorageEnvironment() {
  const recordSource = new RecordSource();
  const store = new Store(recordSource);
  const environment = new Environment({
    network,
    store,
  });
  return environment;
}

function createIndexedDB(records) {
  const recordSourceOptions = {
    initialState: records,
    mergeState: (restoredState, initialState = {}) => {
      if (!restoredState) {
        return initialState;
      }
      if (restoredState && restoredState['0']) {
        // test
        const newStat = {
          ...restoredState,
          '0': {
            ...restoredState['0'],
            text: 'changed',
          },
        };
        return newStat;
      }
      return restoredState;
    },
  };
  const idbOptions = undefined;
  const environment = EnvironmentIDB.create(
    {
      network,
    },
    idbOptions,
    recordSourceOptions,
  );
  return environment;
}

export default function initEnvironment(options: InitProps = {}) {
  const {records = {}} = options;

  const createEnvironment = indexed => {
    const environment = indexed
      ? createIndexedDB(records)
      : createLocalStorageEnvironment();
    environment.setOfflineOptions({
      manualExecution, //optional
      network: network, //optional
      start: async mutations => {
        //optional
        console.log('start offline', mutations);
        return mutations;
      },
      finish: async (mutations, error) => {
        //optional
        console.log('finish offline', error, mutations);
      },
      onExecute: async mutation => {
        //optional
        console.log('onExecute offline', mutation);
        return mutation;
      },
      onComplete: async options => {
        //optional
        console.log('onComplete offline', options);
        return true;
      },
      onDiscard: async options => {
        //optional
        console.log('onDiscard offline', options);
        return true;
      },
      onPublish: async offlinePayload => {
        //optional
        console.log('offlinePayload', offlinePayload);
        return offlinePayload;
      },
    });
    return {environment, prefetch};
  };

  if (typeof window === 'undefined') {
    prefetch.dispose();
    return createEnvironment(false);
  }

  // reuse Relay environment on client-side
  if (!relayEnvironment) {
    relayEnvironment = createEnvironment(true);
  }
  return relayEnvironment;
}

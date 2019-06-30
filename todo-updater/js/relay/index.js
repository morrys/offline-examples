import {
    Network,
    type RequestNode,
    type Variables,
  } from 'relay-runtime';
  
  //import { Store, Environment } from 'react-relay-offline';
  import EnvironmentIDB from 'react-relay-offline/lib/runtime/EnvironmentIDB';


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
  const offlineOptions = {
    manualExecution: false, //optional
    network: network, //optional
    onComplete: (options ) => { //optional
      const { id, offlinePayload, snapshot } = options;
      return true;
    },
    onDiscard: ( options ) => { //optional
      const { id, offlinePayload , error } = options;
      return true;
    }
  };
  const modernEnvironment = EnvironmentIDB.create({ network }, offlineOptions); //, {ttl: 60 * 1000}
  /*
  const store = new Store();
  const modernEnvironment = new Environment({ network, store }, offlineOptions);
  */

  export default modernEnvironment;
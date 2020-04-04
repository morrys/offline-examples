import { RecordSource, Store, Environment } from "react-relay-offline";

import { Network, FetchFunction } from "relay-runtime";
export { QueryRenderer, graphql } from "react-relay-offline";

/**
 * Define fetch query
 */
const fetchQuery: FetchFunction = (operation, variables) => {
  const localIP = "localhost";
  console.log("fetch", localIP, operation);
  return fetch("http://" + localIP + ":3000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => {
    console.log("response");
    return response.json();
  });
};

/**
 * Network
 */
const network = Network.create(fetchQuery);
export default network;

const offlineOptions = {
  manualExecution: false, //optional
  network: network, //optional
  onComplete: async (options: any) => {
    //optional
    const { id, offlinePayload, snapshot } = options;
    console.log("onComplete", options);
    return true;
  },
  onDiscard: async (options: any) => {
    //optio
    const { id, offlinePayload, error } = options;
    console.log("onDiscard", options);
    return true;
  },
};

/**
 * Store
 */
const options: any = {
  errorHandling: (cache: any, error: any) =>
    console.log("error storage", error),
};

export const recourdSource = new RecordSource(options);

export const store = new Store(recourdSource, options);

/**
 * Environment
 */
export const environment = new Environment({ network, store });
environment.setOfflineOptions(offlineOptions);

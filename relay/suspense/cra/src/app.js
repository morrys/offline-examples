import * as React from "react";

import { RelayEnvironmentProvider } from "relay-hooks";
import { Network } from "relay-runtime";
import {
  useLazyLoadQuery,
  Store,
  Environment,
  RecordSource,
} from "react-relay-offline";

import { create } from "./mutations/create";

import QueryApp from "./query/QueryApp";
import Entries from "./components/Entries";

async function fetchQuery(operation, variables) {
  const response = await fetch("http://localhost:3003/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  return response.json();
}
const network = Network.create(fetchQuery);
const recordSource = new RecordSource();
const store = new Store(recordSource);
const modernEnvironment = new Environment({
  network,
  store,
});
modernEnvironment.setOfflineOptions({
  manualExecution: false, //optional
  network: network, //optional
  start: async (mutations) => {
    //optional
    console.log("start offline", mutations);
    return mutations;
  },
  finish: async (mutations, error) => {
    //optional
    console.log("finish offline", error, mutations);
  },
  onExecute: async (mutation) => {
    //optional
    console.log("onExecute offline", mutation);
    return mutation;
  },
  onComplete: async (options) => {
    //optional
    console.log("onComplete offline", options);
    return true;
  },
  onDiscard: async (options) => {
    //optional
    console.log("onDiscard offline", options);
    return true;
  },
  onPublish: async (offlinePayload) => {
    //optional
    console.log("offlinePayload", offlinePayload);
    return offlinePayload;
  },
});

const AppTodo = (propsApp) => {
  const { props } = useLazyLoadQuery(QueryApp, {}); /*propsApp; */
  const submitEntry = React.useCallback(async function () {
    await create("try", modernEnvironment).catch(console.error);
  }, []);

  console.log("renderer", props, propsApp);
  return (
    <React.Fragment>
      <button onClick={submitEntry} className="refetch">
        Add
      </button>
      <Entries entries={props.entries} />
    </React.Fragment>
  );
};

class ErrorBoundary extends React.Component {
  state = { error: null };
  componentDidCatch(error) {
    this.setState({ error });
  }
  render() {
    const { children, fallback } = this.props;
    const { error } = this.state;
    if (error) {
      return React.createElement(fallback, { error });
    }
    return children;
  }
}

const App = (
  <RelayEnvironmentProvider environment={modernEnvironment}>
    <ErrorBoundary
      fallback={({ error }) => `Error: ${error.message + ": " + error.stack}`}
    >
      <React.Suspense fallback={<div>loading suspense</div>}>
        <AppTodo />
      </React.Suspense>
    </ErrorBoundary>
  </RelayEnvironmentProvider>
);

export default App;

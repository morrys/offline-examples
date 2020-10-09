import * as React from "react";

import { useLazyLoadQuery, RelayEnvironmentProvider } from "relay-hooks";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

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

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

const AppTodo = (propsApp) => {
  const { props } = useLazyLoadQuery(QueryApp, {}); /*propsApp; */
  const submitEntry = React.useCallback(async function () {
    await create("try", modernEnvironment).catch(console.error);
  }, modernEnvironment);

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

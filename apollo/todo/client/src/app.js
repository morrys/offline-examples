import * as React from "react";
import { useState } from "react";
import TodoApp from "./components/TodoApp";
import client from "./apollo";
import gql from "graphql-tag";
import { Query, ApolloProvider } from "react-apollo";
export const USER_TODOS = gql`
  query appQuery($userId: String!) {
    user(id: $userId) {
      id
      userId
      totalCount
      completedCount
      todos {
        edges {
          node {
            id
            text
            complete
          }
        }
      }
    }
  }
`;

const AppTodo = function(appProps) {
  const [userId, setUserId] = useState("me");

  console.log("renderer apptodo", userId);

  const handleTextUser = text => {
    console.log("change user", text);
    setUserId(text);
    return;
  };

  return (
    <div>
      <div className="apptodo">
        <h2>who is the user?</h2>
        <div id="radioGroup">
          <div className="wrap">
            <input
              type="radio"
              name="user"
              id="userMe"
              value="me"
              checked={userId === "me"}
              onChange={() => handleTextUser("me")}
            />
            <label htmlFor="userMe">Me</label>
          </div>

          <div className="wrap">
            <input
              type="radio"
              name="user"
              id="userYou"
              value="you"
              checked={userId === "you"}
              onChange={() => handleTextUser("you")}
            />
            <label htmlFor="userYou">You</label>
          </div>
        </div>
      </div>
      <LayoutTodo userId={userId} />
    </div>
  );
};

const LayoutTodo = ({ userId }) => {
  const [rehydrated, setRehydrated] = useState(false);

  React.useEffect(() => {
    client.hydrate().then(() => setRehydrated(true));
  }, []);
  if (!rehydrated) {
    return <div />;
  }
  //
  return (
    <Query query={USER_TODOS} variables={{ userId }}>
      {({ loading, error, data, refetch, ...others }) => {
        if (loading) return <div />;
        if (error) return `Error! ${error.message}`;

        return <TodoApp user={data.user} retry={refetch} />;
      }}
    </Query>
  );
};

const App = (
  <ApolloProvider client={client}>
    <AppTodo />
  </ApolloProvider>
);

export default App;

import * as React from "react";
import { useState } from "react";
import TodoApp from "./components/TodoApp";
import client from "./apollo";
import gql from "graphql-tag";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";

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

  const [rehydrated, setRehydrated] = useState(false);

  React.useEffect(() => {
    client.hydrate().then(() => setRehydrated(true));
  }, []);

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
      {rehydrated && <LayoutTodo userId={userId} />}
    </div>
  );
};

const LayoutTodo = ({ userId }) => {
  const { loading, error, data, refetch, ...others } = useQuery(USER_TODOS, {
    variables: { userId }
  });

  if (loading || !data) return <div />;
  if (error) return `Error! ${error.message}`;

  return <TodoApp user={data.user} retry={refetch} />;
  //
};

const App = (
  <ApolloProvider client={client}>
    <AppTodo />
  </ApolloProvider>
);

export default App;

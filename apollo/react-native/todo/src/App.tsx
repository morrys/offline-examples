import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { default as Loading } from './components/Loading';
import TodoApp from './components/TodoApp';
import styled from "styled-components";
import { useState } from 'react';
import client from './apollo';
import gql from "graphql-tag";
import { Query, ApolloProvider } from "react-apollo";
export const USER_TODOS = gql`query appQuery($userId: String!) {
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

const StyledBody = styled.View`
  font-size: 14px;
  font-family: 'Helvetica';
  line-height: 1.8;
  background: #f5f5f5;
  color: #4d4d4d;
  margin: 15px;
  font-weight: 300;
  `;
/**
 * Interface Definitions
 */
interface Props { }

const AppTodo = ({ userId = 'me' }: any) => {

  const [rehydrated, setRehydrated] = useState(false);

  console.log("client", rehydrated)

  React.useEffect(() => { 
    client.hydrated()
    .then(() => setRehydrated(true))
    .catch(error => console.log("errorrrr", error))
  }, []);
  if (!rehydrated) {
    console.log("render rehydrated")
    return <StyledBody><Loading /></StyledBody>
  }
  console.log("rehydrated", rehydrated)
  // fetchPolicy={"network-only"}
  return <StyledBody><Query query={USER_TODOS} variables={{ userId }} >
    {({ loading, error, data, refetch, ...others }: any) => {
      if (loading) {
        console.log("render loading")
        return <Loading />;
      }
      if (error) {
        console.log("render error", error)
        return <Text style={styles.welcome}>{JSON.stringify(error)}</Text>;
      }
      console.log("render", data)
      return <TodoApp user={data.user} retry={refetch} />
    }}
  </Query>
    </StyledBody>;
}

const App = () => <ApolloProvider client={client}>
  <AppTodo />
</ApolloProvider>;

console.log("APP", App)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;
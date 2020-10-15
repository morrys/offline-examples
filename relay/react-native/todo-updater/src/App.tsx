import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { graphql, STORE_OR_NETWORK, useRestore } from "react-relay-offline";
import { environment, QueryRenderer } from "./relay";
import { default as Loading } from "./components/Loading";
import TodoApp from "./components/TodoApp";
import styled from "styled-components";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
IconMaterial.loadFont();
Icon.loadFont();
/**
 * Query Definitions
 */
const query = graphql`
  query AppQuery($userId: String) {
    user(id: $userId) {
      ...TodoApp_user
    }
  }
`;

const StyledBody = styled.View`
  font-size: 14px;
  font-family: "Helvetica";
  line-height: 1.8;
  background: #f5f5f5;
  color: #4d4d4d;
  margin: 15px;
  font-weight: 300;
`;
/**
 * Interface Definitions
 */
interface Props {}

/**
 * Component Definition
 */
const AppTodo = () => {
  const isRehydrated = useRestore(environment);
  if (!isRehydrated) {
    console.log("loading");
    return <Loading />;
  }
  console.log("renderer");
  return (
    <StyledBody>
      <QueryRenderer
        environment={environment}
        query={query}
        fetchPolicy={STORE_OR_NETWORK}
        variables={{
          // Mock authenticated ID that matches database
          userId: "me",
        }}
        render={({ props, error, retry, cached }: any) => {
          console.log("props", props);
          if (props && props.user) {
            return <TodoApp user={props.user} />;
          } else if (error) {
            console.log("error", error);
            return <Text style={styles.welcome}>{JSON.stringify(error)}</Text>;
          }

          return <Loading />;
          /*return(
            <View style={styles.container}>
              <Text style={styles.welcome}>Welcome to React Offline Native Example!</Text>
              <Text style={styles.instructions}>{JSON.stringify({ 
                cached,
                props, 
                error, 
                retry, 
                online: environment.isOnline(), 
                dataFrom: environment.getDataFrom() 
                })}</Text>
            </View>
          )*/
        }}
      />
    </StyledBody>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

//const App = <AppTodo />;

export default AppTodo;

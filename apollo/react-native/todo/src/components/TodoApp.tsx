import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoList from './TodoList';
import TodoListFooter from './TodoListFooter';
import styled from "styled-components";


import React from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';


const TodoApp = ({ user = {}, retry }: any) => {

  const purge = () => {
    //relay.environment.clearCache().then(result => console.log("clearCache", result));
  };



  const hasTodos = user.totalCount > 0;

  const StyledTodoApp = styled.View`
  backgroundColor: #fff;
  margin: 4px 0 4px 0;
  position: relative;
`;


  return (
    <View>
      <StyledTodoApp>
        <View>
          <Text h3 style={styles.welcome}>Todos</Text>
          <AddTodoMutation user={user} />
        </View>

        <TodoList user={user} />
        {hasTodos && <TodoListFooter user={user} />}
      </StyledTodoApp>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {

  },
  welcome: {
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default TodoApp;
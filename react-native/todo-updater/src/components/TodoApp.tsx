// @flow
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoList from './TodoList';

import React from 'react';
import { StyleSheet, View } from 'react-native';
//version 0.4.0
//import {createFragmentContainer, graphql, useIsConnected, useNetInfo } from 'react-relay-offline';
import {createFragmentContainer, graphql } from 'react-relay-offline';
import TodoListFooter from './TodoListFooter';
import styled from "styled-components";
import { Text, Input } from 'react-native-elements';

const StyledTodoApp = styled.View`
  backgroundColor: #fff;
  margin: 4px 0 4px 0;
  position: relative;
`;


const TodoApp = ({relay, user}: any) => {
  const handleTextInputSave = (text: string) => {
    AddTodoMutation.commit(relay.environment, text, user);
    return;
  };

  // version 0.4.0
  //const isConnected = useIsConnected();
  //const netInfo = useNetInfo();

  const hasTodos = user.totalCount > 0;

  return (
    <View>
      <StyledTodoApp>
        <View>
          <Text h3 style={styles.welcome}>Todos</Text>
          <Input placeholder='What needs to be done?'
          onSubmitEditing={(event) => handleTextInputSave(event.nativeEvent.text)} />
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

export default createFragmentContainer(TodoApp, {
  user: graphql`
    fragment TodoApp_user on User {
      id
      userId
      totalCount
      completedCount
      ...TodoListFooter_user
      ...TodoList_user
    }
  `,
});
/*

      ...TodoListFooter_user
      
*/
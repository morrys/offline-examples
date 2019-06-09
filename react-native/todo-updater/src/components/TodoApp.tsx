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

//import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoList from './TodoList';
//import TodoListFooter from './TodoListFooter';
//import TodoTextInput from './TodoTextInput';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createFragmentContainer, graphql, useIsConnected, useNetInfo } from 'react-relay-offline';
import TodoListFooter from './TodoListFooter';


const TodoApp = ({relay, user}: any) => {
  /*const handleTextInputSave = (text: string) => {
    AddTodoMutation.commit(relay.environment, text, user);
    return;
  };*/

  const isConnected = useIsConnected();
  const netInfo = useNetInfo();

  const hasTodos = user.totalCount > 0;

  return (
    <View style={styles.container}>
        <Text style={styles.welcome}>Todos {isConnected}</Text>

        <TodoList user={user} />
        {hasTodos && <TodoListFooter user={user} />}
         {/*} <TodoTextInput
            className="new-todo"
            onSave={handleTextInputSave}
            placeholder="What needs to be done?"
          />

        
  {hasTodos && <TodoListFooter user={user} />}*/}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
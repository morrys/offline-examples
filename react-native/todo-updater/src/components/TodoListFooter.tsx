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

//import RemoveCompletedTodosMutation from '../mutations/RemoveCompletedTodosMutation';

import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import { View, StyleSheet, Text, Button } from 'react-native';


const TodoListFooter = ({
  relay,
  user,
  user: {todos, completedCount, totalCount},
}: any) => {
  const completedEdges =
    todos && todos.edges
      ? todos.edges.filter(
          (edge: any) => edge && edge.node && edge.node.complete,
        )
      : [];

  /*const handleRemoveCompletedTodosClick = () => {
    RemoveCompletedTodosMutation.commit(
      relay.environment,
      {
        edges: completedEdges,
      },
      user,
    );
  };*/

  const numRemainingTodos = totalCount - completedCount;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
      <Text>
      {numRemainingTodos + "item" + (numRemainingTodos === 1 ? '' : 's') +"left"}
        </Text>
        </View>

      {completedCount > 0 && (
        <View style={styles.buttonContainer}>
        <Button
        onPress={() => console.log("click")/*handleRemoveCompletedTodosClick*/}
        title="Clear completed"
        color="#841584"
        accessibilityLabel="Clear completed"
      />
      </View>
          
          
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: '#F5FCFF', 
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
  }
});

export default createFragmentContainer(TodoListFooter, {
  user: graphql`
    fragment TodoListFooter_user on User {
      id
      userId
      completedCount
      todos(
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "TodoList_todos") {
        edges {
          node {
            id
            complete
          }
        }
      }
      totalCount
    }
  `,
});

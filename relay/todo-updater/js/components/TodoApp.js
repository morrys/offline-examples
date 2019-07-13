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
import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';
import TodoOffline from './TodoOffline';

import React from 'react';
/*
  version 0.4.0
import {createFragmentContainer, graphql, useIsConnected, useNetInfo } from 'react-relay-offline';
*/
import { createFragmentContainer, graphql } from 'react-relay-offline';

import type { RelayProp } from 'react-relay';
import type { TodoApp_user } from 'relay/TodoApp_user.graphql';

const TodoApp = ({ relay, user, retry }) => {


  const handleTextInputSave = (text: string) => {
    AddTodoMutation.commit(relay.environment, text, user);
    return;
  };


  const purge = () => {
    relay.environment.clearCache().then(result => console.log("clearCache", result));
  };
  
  const hasTodos = user.totalCount > 0;

  return (
      <div className="divider">
        
        <section className="todoapp">

          <header className="header">
            <h1>todos</h1>

            <TodoTextInput
              className="new-todo"
              onSave={handleTextInputSave}
              placeholder="What needs to be done?"
            />
          </header>

          <TodoList user={user} />
          {hasTodos && <TodoListFooter user={user} />}
          <button onClick={retry} className="refetch" >
          Retry
        </button>
        <button onClick={purge} className="refetch" >
          Purge
        </button>

        <footer className="info">
          <p>Double-click to edit a todo</p>
        </footer>
        </section>
        <TodoOffline relay={relay} user={user} />

        
      </div>
  );
};

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

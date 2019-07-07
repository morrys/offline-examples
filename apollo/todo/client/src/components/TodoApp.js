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

// import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoList from './TodoList';
import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';

import React from 'react';


const TodoApp = ({ user = {}, retry }) => {


  const handleTextInputSave = (text) => {
    console.log("text", text)
    //AddTodoMutation.commit(relay.environment, text, user);
    return;
  };


  const purge = () => {
    //relay.environment.clearCache().then(result => console.log("clearCache", result));
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
          <button onClick={() => retry()} className="refetch" >
          Retry
        </button>
        <button onClick={purge} className="refetch" >
          Purge
        </button>

        <footer className="info">
          <p>Double-click to edit a todo</p>
        </footer>
        </section>

        
      </div>
  );
};

export default TodoApp;

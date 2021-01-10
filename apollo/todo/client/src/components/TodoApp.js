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


import React from 'react';


const TodoApp = ({ user = {}, retry, client }) => {

  const purge = () => {
    client.resetStore();
    //relay.environment.clearCache().then(result => console.log("clearCache", result));
  };

  const evict = () => {
    client.cache.evict({})
    //relay.environment.clearCache().then(result => console.log("clearCache", result));
  };
  
  const gc = () => {
    console.log("gc", client.cache.gc());
    //relay.environment.clearCache().then(result => console.log("clearCache", result));
  };
  

  const hasTodos = user.totalCount > 0;

  return (
      <div className="divider">
        
        <section className="todoapp">

          <header className="header">
            <h1>todos</h1>

            <AddTodoMutation user={user} />
          </header>

          <TodoList user={user} />
          {hasTodos && <TodoListFooter user={user} />}
          <button onClick={() => retry()} className="refetch" >
          Retry
        </button>
        <button onClick={gc} className="refetch" >
          Garbage
        </button>
        <button onClick={evict} className="refetch" >
          Evict
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

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

// import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

import React from 'react';

const TodoList = ({
  user,
  user: {todos, totalCount, completedCount},
}) => {
  const handleMarkAllChange = (e) => {
    const complete = e.currentTarget.checked;

    if (todos) {
      //MarkAllTodosMutation.commit(relay.environment, complete, todos, user);
    }
  };

  const nodes =
    todos && todos.edges
      ? todos.edges
          .filter(Boolean)
          .map((edge) => edge.node)
          .filter(Boolean)
      : [];

  return (
    <section className="main">
      <input
        checked={totalCount === completedCount}
        className="toggle-all"
        onChange={handleMarkAllChange}
        type="checkbox"
      />

      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        {nodes.map((node) => (
          <Todo key={node.id} todo={node} user={user} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;

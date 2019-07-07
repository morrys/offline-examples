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

// import RemoveCompletedTodosMutation from '../mutations/RemoveCompletedTodosMutation';

import React from 'react';

const TodoListFooter = ({
  user,
  user: {todos, completedCount, totalCount},
}) => {
  const completedEdges =
    todos && todos.edges
      ? todos.edges.filter(
          (edge) => edge && edge.node && edge.node.complete,
        )
      : [];

  const handleRemoveCompletedTodosClick = () => {
    console.log("user", user);
    /*RemoveCompletedTodosMutation.commit(
      relay.environment,
      {
        edges: completedEdges,
      },
      user,
    );*/
  };

  const numRemainingTodos = totalCount - completedCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{numRemainingTodos}</strong> item
        {numRemainingTodos === 1 ? '' : 's'} left
      </span>

      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleRemoveCompletedTodosClick}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoListFooter;

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

import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import RemoveTodoMutation from '../mutations/RemoveTodoMutation';
import RenameTodoMutation from '../mutations/RenameTodoMutation';
import TodoTextInput from './TodoTextInput';

import { withApollo } from "react-apollo";

import React, {useState} from 'react';
import classnames from 'classnames';

export const Todo = ({ todo, user, disabled, client}) => {
  const [isEditing, setIsEditing] = useState(false);
  console.log("client", client)
  const handleCompleteChange = (e) => {
    console.log("user", user);
    const complete = e.currentTarget.checked;
    ChangeTodoStatusMutation.commit(client, complete, todo, user);
  };

  const handleDestroyClick = () => removeTodo();
  const handleLabelDoubleClick = () => {
    if(!disabled)
      setIsEditing(true);
  }
  const handleTextInputCancel = () => setIsEditing(false);

  const handleTextInputDelete = () => {
    setIsEditing(false);
    removeTodo();
  };

  const handleTextInputSave = (text) => {
    setIsEditing(false);
    RenameTodoMutation.commit(client, text, todo);
  };

  const removeTodo = () => RemoveTodoMutation.commit(client, todo, user);
    

  return (
    <li
      className={classnames({
        completed: todo.complete,
        editing: isEditing,
      })}>
      <div className="view">
        <input
          checked={todo.complete}
          className="toggle"
          onChange={handleCompleteChange}
          type="checkbox"
          disabled={disabled}
        />

        <label onDoubleClick={handleLabelDoubleClick}>{todo.text}</label>
        {!disabled && <button className="destroy" onClick={handleDestroyClick} />}
      </div>

      {isEditing && (
        <TodoTextInput
          className="edit"
          commitOnBlur={true}
          initialValue={todo.text}
          onCancel={handleTextInputCancel}
          onDelete={handleTextInputDelete}
          onSave={handleTextInputSave}
        />
      )}
    </li>
  );
};

export default withApollo(Todo);

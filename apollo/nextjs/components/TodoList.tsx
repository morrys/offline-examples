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

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

import React, {SyntheticEvent} from 'react';

import styled from 'styled-components';
import {useApolloClient} from '@apollo/react-hooks';
/*type Todos = $NonMaybeType<$ElementType<TodoList_user, 'todos'>>;
type Edges = $NonMaybeType<$ElementType<Todos, 'edges'>>;
type Edge = $NonMaybeType<$ElementType<Edges, number>>;
type Node = $NonMaybeType<$ElementType<Edge, 'node'>>;*/

type Props = {
  user: any;
};

const StyledSection = styled.section`
  position: relative;
  z-index: 2;
  border-top: 1px solid #e6e6e6;
`;
const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledInput = styled.input`
  position: absolute;
  top: -55px;
  left: -12px;
  width: 60px;
  height: 34px;
  text-align: center;
  border: none;

  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    background: none;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    -webkit-appearance: none;
    appearance: none;
  }

  &:before {
    content: '❯';
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }

  &:checked:before {
    color: #737373;
  }
`;
const StyledLabelMark = styled.label`
  display: none;
`;
const TodoList = ({user, user: {todos, totalCount, completedCount}}: Props) => {
  const client = useApolloClient();
  const handleMarkAllChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const complete = e.currentTarget.checked;

    if (todos) {
      MarkAllTodosMutation.commit(client, complete, todos, user);
    }
  };

  const nodes: ReadonlyArray<any> =
    todos && todos.edges
      ? todos.edges
          .filter(Boolean)
          .map((edge: any) => edge.node)
          .filter(Boolean)
      : [];

  return (
    <StyledSection>
      <StyledInput
        checked={totalCount === completedCount}
        onChange={handleMarkAllChange}
        type="checkbox"
      />

      <StyledLabelMark htmlFor="toggle-all">
        Mark all as complete
      </StyledLabelMark>

      <StyledList>
        {nodes.map((node: any) => (
          <Todo key={node.id} todo={node} user={user} />
        ))}
      </StyledList>
    </StyledSection>
  );
};

export default TodoList;

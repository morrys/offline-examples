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

import RemoveCompletedTodosMutation from "../mutations/RemoveCompletedTodosMutation";

import React from "react";

import { Text, Button } from "react-native-elements";
import { withApollo } from "react-apollo";

import styled, { css } from "styled-components";
import { useNetInfo, useIsConnected } from "@wora/detect-network";

const StyledContainer = styled.View`
  flex-direction: row;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

const StyleButtonContainer = styled.View`
  flex: 1;
`;

const StyledLabel = styled(Text)`
  text-align: center;
`;

const TodoListFooter = ({
  user,
  user: { todos, completedCount, totalCount },
  client,
}: any) => {
  const completedEdges =
    todos && todos.edges
      ? todos.edges.filter(
          (edge: any) => edge && edge.node && edge.node.complete
        )
      : [];

  const handleRemoveCompletedTodosClick = () => {
    RemoveCompletedTodosMutation.commit(
      client,
      {
        edges: completedEdges,
      },
      user
    );
  };

  const numRemainingTodos = totalCount - completedCount;

  const netstate = useNetInfo();
  const connected = useIsConnected();
  console.log("netstate", netstate);
  console.log("connected", connected);

  return (
    <StyledContainer>
      <StyleButtonContainer>
        <StyledLabel h4>
          {numRemainingTodos +
            " Item" +
            (numRemainingTodos === 1 ? "" : "s") +
            " left"}
        </StyledLabel>
      </StyleButtonContainer>

      <StyleButtonContainer>
        <Button
          onPress={handleRemoveCompletedTodosClick}
          title="Clear completed"
          disabled={completedCount == 0}
          accessibilityLabel="Clear completed"
        />
      </StyleButtonContainer>
    </StyledContainer>
  );
};

export default withApollo(TodoListFooter);

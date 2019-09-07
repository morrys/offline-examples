import React, { useState } from 'react';
import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';
import { withApollo } from "react-apollo";
import { Text, ScrollView, RefreshControl, FlatList } from "react-native";

import styled from "styled-components";

const StyledMain = styled.View`
  position: relative;
  z-index: 2;
  border: 1px solid #e6e6e6;
`;

const TodoList = ({
  user,
  user: {todos, totalCount, completedCount},
  client,
}: any) => {
  const handleMarkAllChange = (e: any) => {
    const complete = e.currentTarget.checked;

    if (todos) {
      MarkAllTodosMutation.commit(client, complete, todos, user);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    //setRefreshing(true);
    //refetch({}, {}, () => setRefreshing(false))
  }

  const nodes =
    todos && todos.edges
      ? todos.edges
        .filter(Boolean)
        .map((edge: any) => edge.node)
        .filter(Boolean)
      : [];

  return <StyledMain>
    <ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
      {nodes.map((node: any) => (
        <Todo key={node.id} todo={node} user={user} />
      ))}
    </ScrollView>
  </StyledMain>

  /* (
    
         <Text key={item.node.id}>{item.node.hallName}</Text>
     <section className="main">
       <input
         checked={totalCount === completedCount}
         className="toggle-all"
         onChange={handleMarkAllChange}
         type="checkbox"
       />
 
       <label htmlFor="toggle-all">Mark all as complete</label>
 
       <ul className="todo-list">
         {nodes.map((node: Node) => (
           <Todo key={node.id} todo={node} user={user} />
         ))}
       </ul>
     </section>
   );*/
};

export default withApollo(TodoList);
import React from 'react';
import TodoApp, {QUERY_APP} from '../components/TodoApp';
import {withData} from '../relay';
import {STORE_OR_NETWORK} from 'relay-hooks';
import {TodoAppQuery} from '../__generated__/relay/TodoAppQuery.graphql';
import {useLazyLoadQuery} from 'react-relay-offline';

const query = QUERY_APP;

const variables = {
  // Mock authenticated ID that matches database
  userId: 'you',
};

const Home = () => {
  const {props, retry} = useLazyLoadQuery<TodoAppQuery>(query, variables);
  if (!props) {
    return <div>no data || skip</div>;
  }
  return <TodoApp query={props} retry={retry} />;
};

// <Header />
export default withData(Home, {
  query,
  variables,
});

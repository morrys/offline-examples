import React from 'react';
import TodoApp, {QUERY_APP} from './TodoApp';
import {TodoAppQuery} from '../__generated__/relay/TodoAppQuery.graphql';
import {usePreloadedQuery} from 'react-relay-offline';

const Home = ({prefetch}) => {
  const {error, data, retry} = usePreloadedQuery<TodoAppQuery>(prefetch);

  console.log('prefetch ssr', prefetch);
  if (data) {
    return <TodoApp query={data} retry={retry} />;
  } else if (error) {
    return <div>{error.message}</div>;
  }
  return <div>loading</div>;
};

export default Home;

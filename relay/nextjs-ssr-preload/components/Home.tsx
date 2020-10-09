import React from 'react';
import TodoApp, {QUERY_APP} from './TodoApp';
import {TodoAppQuery} from '../__generated__/relay/TodoAppQuery.graphql';
import {usePreloadedQuery} from 'react-relay-offline';

const Home = ({prefetch}) => {
  const {error, cached, props, retry, online} = usePreloadedQuery<TodoAppQuery>(
    prefetch,
  );

  console.log('prefetch ssr', prefetch, online);
  if (props) {
    return <TodoApp query={props} retry={retry} />;
  } else if (error) {
    return <div>{error.message}</div>;
  }
  return <div>loading</div>;
};

export default Home;

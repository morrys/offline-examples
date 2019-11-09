import React from 'react';
import withData from '../apollo/withData';
import {USER_TODOS} from '.';
import useQuery from '@wora/apollo-offline/lib/react/useQuery';
import TodoApp from '../components/TodoApp';
const Home = props => {
  const {loading, error, data, ...others} = useQuery(USER_TODOS, {
    variables: {
      // Mock authenticated ID that matches database
      userId: 'you',
    },
  });
  if (loading) return <div />;
  if (error) return `Error! ${error.message}`;
  return <TodoApp {...others} user={data.user} />;
};

export default withData(Home);

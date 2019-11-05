import React from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import withData from '../apollo/withData';
import {USER_TODOS} from '.';
import TodoApp from '../components/TodoApp';
const Home = props => {
  // todo hydrate
  const {loading, error, data, ...others} = useQuery(USER_TODOS, {
    variables: {
      // Mock authenticated ID that matches database
      userId: 'you',
    },
  });
  console.log('data', data);
  if (loading || !data.user) return <div />;
  if (error) return `Error! ${error.message}`;
  return (
    <React.Fragment>
      <TodoApp {...others} {...data} />
    </React.Fragment>
  );
};

export default withData(Home);

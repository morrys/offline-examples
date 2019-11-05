import React from 'react';
import TodoApp from '../components/TodoApp';
import withData from '../apollo/withData';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
export const USER_TODOS = gql`
  query appQuery($userId: String!) {
    user(id: $userId) {
      id
      userId
      totalCount
      completedCount
      todos {
        edges {
          node {
            id
            text
            complete
          }
        }
      }
    }
  }
`;
const Home = props => {
  console.log('home');
  const {loading, error, data, ...others} = useQuery(USER_TODOS, {
    variables: {
      // Mock authenticated ID that matches database
      userId: 'me',
    },
  });

  console.log('data me', data, !data.user);
  if (loading || !data.user) return <div />;
  if (error) return `Error! ${error.message}`;
  return <TodoApp {...others} {...data} />;
};

// <Header />
export default withData(Home);

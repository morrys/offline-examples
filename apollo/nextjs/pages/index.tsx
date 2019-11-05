import React, {useState, useRef} from 'react';
import TodoApp from '../components/TodoApp';
import withData from '../apollo/withData';
import gql from 'graphql-tag';
import {useQuery, useApolloClient} from '@apollo/react-hooks';
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

  const client: any = useApolloClient();
  const [, forceUpdate] = useState(null);
  const ref = useRef<{hydrate: boolean}>({
    hydrate: client.isRehydrated(),
  });

  if (!ref.current.hydrate) {
    ref.current.hydrate = true;
    client.hydrate().then(() => {
      client.cache.broadcastWatches();
      forceUpdate(client);
    });
  }

  console.log('renderer');

  const {loading, error, data, ...others} = useQuery(USER_TODOS, {
    variables: {
      // Mock authenticated ID that matches database
      userId: 'me',
    },
  });

  console.log('data me', data, !data.user);
  if (loading) return <div />;
  if (error) return `Error! ${error.message}`;
  return <TodoApp {...others} user={data.user} />;
};

// <Header />
export default withData(Home);

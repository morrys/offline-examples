import React, {useRef, useState} from 'react';
import gql from 'graphql-tag';
import {useQuery, useApolloClient} from '@apollo/react-hooks';
import withData from '../apollo/withData';
import {USER_TODOS} from '.';
import TodoApp from '../components/TodoApp';
const Home = props => {
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
  const {loading, error, data, ...others} = useQuery(USER_TODOS, {
    variables: {
      // Mock authenticated ID that matches database
      userId: 'you',
    },
  });
  console.log('data', data);
  if (loading) return <div />;
  if (error) return `Error! ${error.message}`;
  return <TodoApp {...others} user={data.user} />;
};

export default withData(Home);

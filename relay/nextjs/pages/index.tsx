import React from 'react';
import TodoApp, {QUERY_APP} from '../components/TodoApp';
import {withData} from '../relay';
const Home = props => {
  return (
    <React.Fragment>
      <TodoApp {...props} />
    </React.Fragment>
  );
};

// <Header />
export default withData(Home, {
  query: QUERY_APP,
  variables: {
    // Mock authenticated ID that matches database
    userId: 'me',
  },
});

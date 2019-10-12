import React from 'react';
import Header from '../components/Header';
import TodoApp, {QUERY_APP} from '../components/TodoApp';
import {withData} from '../relay';
const Home = props => {
  console.log('HOME');
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

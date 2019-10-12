import React from 'react';
import Header from '../components/Header';
import AppTodo, {QUERY_APP} from '../components/TodoApp';
import {withData} from '../relay';
const Home = props => (
  <React.Fragment>
    <Header />
    <AppTodo {...props} />
  </React.Fragment>
);

export default withData(Home, {
  query: QUERY_APP,
  variables: {
    // Mock authenticated ID that matches database
    userId: 'you',
  },
});

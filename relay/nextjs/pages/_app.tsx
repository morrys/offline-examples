import React from 'react';
import App from 'next/app';
import Head from 'next/head';

class CustomApp extends App {
  render() {
    const {Component, pageProps, router} = this.props;
    //const ApolloClient = require("../apollo/apolloClient").default;
    //const ApolloProvider = require("react-apollo").ApolloProvider;
    var query = router.route;
    /*if ((process as any).browser) {
      const searchParams: any = new URLSearchParams(
        this.props.router.asPath.split(/\?/)[1],
      );

      for (const [key, value] of searchParams) {
        query[key] = value;
      }
    }*/
    // replace the empty query
    return (
      <React.Fragment>
        <Head>
          <title>Relay Offline NextJS SSR</title>
        </Head>
        <Component {...query} {...pageProps} />
      </React.Fragment>
    );
  }
}
export default CustomApp;

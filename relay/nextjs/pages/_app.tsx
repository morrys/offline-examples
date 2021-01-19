import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import initEnvironment from '../relay/createRelayEnvironment';
import {RelayEnvironmentProvider} from 'react-relay-offline';

const isServer = typeof window === 'undefined';
class CustomApp extends App {
  render() {
    const {Component, pageProps} = this.props;
    const {queryRecords: records} = pageProps;
    /* eslint-disable indent */
    const environment = isServer
      ? pageProps.environment
      : initEnvironment({
          records,
        });
    /* eslint-enable indent */
    return (
      <React.Fragment>
        <Head>
          <title>Relay Offline NextJS SSR</title>
        </Head>

        <Header />
        <RelayEnvironmentProvider environment={environment}>
          <Component {...pageProps} />
        </RelayEnvironmentProvider>
      </React.Fragment>
    );
  }
}
export default CustomApp;

import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import initEnvironment from '../relay/createRelayEnvironment';

class CustomApp extends App {
  /*static async rehydrate(props: any) {
    console.log('entro rehydrate', props);
    const {pageProps} = props;
    const environment = initEnvironment({
      records: props.pageProps.queryRecords,
    });
    props.pageProps.environment = environment;
    await environment.restore();
    return {
      ...props,
    };
  }*/
  render() {
    const {Component, pageProps} = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Relay Offline NextJS SSR</title>
        </Head>

        <Header />
        <Component {...pageProps} />
      </React.Fragment>
    );
  }
}
export default CustomApp;

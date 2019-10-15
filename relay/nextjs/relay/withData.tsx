import React from 'react';
import initEnvironment from './createRelayEnvironment';
// import { fetchQuery } from 'react-relay'
import {
  fetchQuery,
  QueryRenderer,
  Environment,
  useRestore,
  ReactRelayContext,
} from 'react-relay-offline';
import {
  CACHE_FIRST,
  NETWORK_ONLY,
} from 'react-relay-offline/lib/RelayOfflineTypes';
import {Variables} from 'relay-runtime';
import {DocumentContext} from 'next/document';
import {NextPage} from 'next';

type Props = {
  queryRecords: any;
};

type OptionsWithData = {
  query: any;
  variables?: Variables;
};

export default <P extends Props>(
  ComposedComponent: NextPage<P>,
  options: OptionsWithData,
) => {
  function WithData(props) {
    const {query, variables} = options;
    const environment = initEnvironment({
      records: props.queryRecords,
    });
    return (
      <QueryRenderer
        environment={environment}
        query={query}
        variables={variables}
        dataFrom={CACHE_FIRST}
        ttl={100000}
        render={({error, cached, props, ...others}: any) => {
          if (props) {
            return <ComposedComponent {...props} {...others} />;
          } else if (error) {
            return <div>{error.message}</div>;
          }
          return <div>loading</div>;
        }}
      />
    );
  }

  WithData.getInitialProps = async (ctx: DocumentContext) => {
    const isServer = !!ctx.req;
    let composedInitialProps = {};
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx);
    }
    if (!isServer) {
      return {
        ...composedInitialProps,
        ssr: false,
      };
    }

    let queryProps = {};
    let queryRecords = {};
    const environment = initEnvironment();

    const {query, variables} = options;
    if (query) {
      queryProps = await fetchQuery(environment, query, variables);
      queryRecords = environment
        .getStore()
        .getSource()
        .toJSON();
    }
    return {
      ...composedInitialProps,
      ...queryProps,
      queryRecords,
      ssr: true,
    };
  };

  return WithData;
};

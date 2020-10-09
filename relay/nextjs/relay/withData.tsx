import React from 'react';
import initEnvironment from './createRelayEnvironment';
import {fetchQuery, QueryRenderer} from 'react-relay-offline';
import {STORE_OR_NETWORK, STORE_THEN_NETWORK} from 'react-relay-offline';
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
    const environment =
      typeof window === 'undefined'
        ? props.environment
        : initEnvironment({
            records: props.queryRecords,
          });
    return (
      <QueryRenderer<any>
        environment={environment}
        query={query}
        variables={variables}
        fetchPolicy={STORE_OR_NETWORK}
        ttl={300000}
        render={({error, cached, props, online, ...others}) => {
          if (props && props.user) {
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
        environment: null,
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
      environment,
    };
  };

  return WithData;
};

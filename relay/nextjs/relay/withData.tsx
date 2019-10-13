import React from 'react';
import initEnvironment from './createRelayEnvironment';
// import { fetchQuery } from 'react-relay'
import {fetchQuery, QueryRenderer, Environment} from 'react-relay-offline';
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
  return class WithData extends React.Component {
    static displayName = `WithData(${ComposedComponent.displayName})`;

    static async getInitialProps(ctx: DocumentContext) {
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
    }

    environment: Environment;

    constructor(props) {
      super(props);
      this.environment =
        typeof window === 'undefined'
          ? props.environment
          : initEnvironment({
              records: props.queryRecords,
            });
    }

    render() {
      return (
        <QueryRenderer
          environment={this.environment}
          query={options.query}
          variables={options.variables}
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
  };
};

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
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx);
      }
      if (!ctx.req) {
        return composedInitialProps;
      }

      let queryProps = {};
      let queryRecords = {};
      const environment = initEnvironment();

      const {query, variables} = options;
      if (query) {
        console.log('vaeia', variables);
        // Provide the `url` prop data in case a graphql query uses it
        // const url = { query: ctx.query, pathname: ctx.pathname }
        // TODO: Consider RelayQueryResponseCache
        // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
        queryProps = await fetchQuery(environment, query, variables);
        queryRecords = environment
          .getStore()
          .getSource()
          .toJSON();
        // console.log('Got data:', queryRecords)
      }

      return {
        ...composedInitialProps,
        ...queryProps,
        queryRecords,
      };
    }

    environment: Environment;

    constructor(props) {
      super(props);

      // Note: data exists here when using react-relay-offline.
      // console.log('Data in constructor:', props.queryRecords)

      this.environment = initEnvironment({
        records: props.queryRecords,
      });
    }

    render() {
      // console.log('this.environment', this.environment)

      // Note: data does not exist here when using the react-relay-offline
      // environment, but it does when using relay-runtime.
      console.log(
        'this.environment store records',
        this.environment
          .getStore()
          .getSource()
          .toJSON(),
      );
      return (
        <QueryRenderer
          environment={this.environment}
          query={options.query}
          variables={options.variables}
          dataFrom={CACHE_FIRST}
          ttl={100000}
          render={({error, cached, props, ...others}: any) => {
            console.log('ENTRO');
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

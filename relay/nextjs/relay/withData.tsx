import React from 'react';
import initEnvironment from './createRelayEnvironment';
import {useQuery} from 'react-relay-offline';
import {Variables, fetchQuery} from 'relay-runtime';
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
    const {query, variables = {}} = options;
    const networkCacheConfig = {
      ttl: 1,
    };
    const {error, data, isLoading, ...others} = useQuery<any>(
      query,
      variables,
      {
        networkCacheConfig,
      },
    );
    console.log('rendered WithData');
    if (data && data.user) {
      return <ComposedComponent {...data} {...others} />;
    } else if (error) {
      return <div>{error.message}</div>;
    }
    return <div>loading</div>;
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

    const {query, variables = {}} = options;
    if (query) {
      if(!environment.isRehydrated()) {
        await environment.hydrate();
      }
      queryProps = await fetchQuery<any>(
        environment,
        query,
        variables,
      ).toPromise()
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

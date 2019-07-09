import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { NetInfo } from '@wora/detect-network';
import StoreOffline, { publish } from './OfflineFirstApollo'
import OfflineStore from './OfflineStore'
import { ApolloLink, Observable, Operation, execute, GraphQLRequest, NextLink, FetchResult } from "apollo-link";




const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

class OfflineApolloClient extends ApolloClient {

  _storeOffline;
  _isRestored = false;

  constructor(options) {
    super(options);
    this.queryManager.isOnline = true;
    this._storeOffline = StoreOffline.create(this);
    NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
      console.log(isConnected)
      this.queryManager.isOnline = isConnected;

    });

    const originalFetchQuery = this.queryManager.fetchQuery;
    this.queryManager.fetchQuery = function (queryId, options, fetchType, fetchMoreForQueryId) {
      console.log(this.isOnline);
      const oldFetchPolicy = options.fetchPolicy;
      if (!this.isOnline) {
        options.fetchPolicy = 'cache-only'
      }
      const result = originalFetchQuery.apply(this, [queryId, options, fetchType, fetchMoreForQueryId]);
      options.fetchPolicy = oldFetchPolicy;
      return result;
      // Run stuff after, here.
    }
    //this.queryManager.fetchQuery = loggerQueryFunction;
  }

  restore() {
    if (this._isRestored) {
      return Promise.resolve(true);
    }
    return Promise.all([this._storeOffline.restore(), this.store.cache.restore()]).then(result => {
      this._isRestored = true;
      return true;
    }).catch(error => {
      this._isRestored = false;
      throw error;
    })
  }

  getStoreOffline() {
    return this._storeOffline;
  }

  isRestored() {
    return this._isRestored;
  }

  isRehydrated() {
    return this._isRestored;
  }

  isOnline() {
    return this._storeOffline.isOnline();
  }

  watchQuery(options) {
    const oldFetchPolicy = options.fetchPolicy;
    if (!this.isOnline()) {
      options.fetchPolicy = 'cache-only'
    }
    const result = super.watchQuery(options);
    result.options.fetchPolicy = oldFetchPolicy;
    return result;
  }

  mutate(
    options,
  ) {
    if (!this.isOnline()) {
      return publish(this, options);

    }
    return super.mutate(options);
  }


}

const client = new OfflineApolloClient({
  link: httpLink,
  cache: new OfflineStore({
    dataIdFromObject: o => o.id
  })
});



console.log("client", client)

console.log("client querymanager", client.queryManager)


export default client;
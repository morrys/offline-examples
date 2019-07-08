import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { NetInfo } from '@wora/detect-network';


const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

class OfflineApolloClient extends ApolloClient {

  isOnline = true;

  constructor(options) {
    super(options);
    this.queryManager.isOnline = true;
    NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
      console.log(isConnected)
      super.disableNetworkFetches = !isConnected;
      this.isOnline = isConnected;
      this.queryManager.isOnline = isConnected;
      
    });

      const originalFetchQuery = this.queryManager.fetchQuery;
      this.queryManager.fetchQuery = function(queryId, options, fetchType, fetchMoreForQueryId) {
        console.log(this.isOnline);
        const oldFetchPolicy = options.fetchPolicy;
        if(!this.isOnline) {
          options.fetchPolicy = 'cache-only'
        }
        const result = originalFetchQuery.apply(this, [queryId, options, fetchType, fetchMoreForQueryId]);
        options.fetchPolicy = oldFetchPolicy;
        return result;
        // Run stuff after, here.
      }
      //this.queryManager.fetchQuery = loggerQueryFunction;
  }

  watchQuery(options) {
    const oldFetchPolicy = options.fetchPolicy;
        if(!this.isOnline) {
          options.fetchPolicy = 'cache-only'
        }
    const result = super.watchQuery(options);
    result.options.fetchPolicy = oldFetchPolicy;
    return result;
  }

  
}

const client = new OfflineApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id
  })
});



console.log("client", client)

console.log("client querymanager", client.queryManager)


export default client;
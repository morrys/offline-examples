//import { ApolloClient } from "@wora/apollo-offline";
import { HttpLink } from "apollo-link-http";

import ApolloClientIDB from '@wora/apollo-offline/lib/ApolloClientIDB';




const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const offlineOptions = { 
  manualExecution: false, //optional
  link: httpLink, //optional
  onComplete: (options ) => { //optional
    const { id, offlinePayload, request } = options;
    console.log("onComplete", options);
    return true;
  },
  onDiscard: ( options ) => { //optional
    const { id, offlinePayload , error } = options;
    console.log("onDiscard", options);
    return true;
  }
};

const cacheOptions = {
  dataIdFromObject: o => o.id
};

/*const client = new ApolloClient({
  link: httpLink,
  cache: new ApolloCache(cacheOptions)
}, offlineOptions);*/

const client = ApolloClientIDB.create({ link: httpLink }, cacheOptions, offlineOptions);


console.log("client", client)

console.log("client querymanager", client.queryManager)


export default client;
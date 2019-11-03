import { ApolloClient } from "@wora/apollo-offline";
import ApolloCache from "@wora/apollo-cache";
import { HttpLink } from "apollo-link-http";

// import ApolloClientIDB from '@wora/apollo-offline/lib/ApolloClientIDB';

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const cacheOptions = {
  dataIdFromObject: o => o.id
};

const client = new ApolloClient({
  link: httpLink,
  cache: new ApolloCache(cacheOptions)
});

client.setOfflineOptions({
  manualExecution: false, //optional
  link: httpLink, //optional
  start: async mutations => {
    //optional
    console.log("start offline", mutations);
    return mutations;
  },
  finish: async (mutations, error) => {
    //optional
    console.log("finish offline", error, mutations);
  },
  onExecute: async mutation => {
    //optional
    console.log("onExecute offline", mutation);
    return mutation;
  },
  onComplete: async options => {
    //optional
    console.log("onComplete offline", options);
    return true;
  },
  onDiscard: async options => {
    //optional
    console.log("onDiscard offline", options);
    return true;
  },
  onPublish: async offlinePayload => {
    //optional
    console.log("offlinePayload", offlinePayload);
    return offlinePayload;
  }
});
// const client = ApolloClientIDB.create({ link: httpLink }, cacheOptions, offlineOptions);

console.log("client", client);

console.log("client querymanager", client.queryManager);

export default client;

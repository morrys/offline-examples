import { ApolloClient } from "@wora/apollo-offline";
import { ApolloCache } from "@wora/apollo-cache";
import { HttpLink } from "apollo-link-http";

const localIP = "localhost";
const httpLink = new HttpLink({
  uri: "http://" + localIP + ":3000/graphql",
});

const cacheOptions = {
  dataIdFromObject: (o) => o.id,
};

console.log("cache", ApolloCache);

const client = new ApolloClient({
  link: httpLink,
  cache: new ApolloCache(cacheOptions),
});

client.setOfflineOptions({
  manualExecution: false, //optional
  link: httpLink, //optional
  start: async (mutations) => {
    //optional
    console.log("start offline", mutations);
    return mutations;
  },
  finish: async (mutations, error) => {
    //optional
    console.log("finish offline", error, mutations);
  },
  onExecute: async (mutation) => {
    //optional
    console.log("onExecute offline", mutation);
    return mutation;
  },
  onComplete: async (options) => {
    //optional
    console.log("onComplete offline", options);
    return true;
  },
  onDiscard: async (options) => {
    //optional
    console.log("onDiscard offline", options);
    return true;
  },
  onPublish: async (offlinePayload) => {
    //optional
    console.log("offlinePayload", offlinePayload);
    return offlinePayload;
  },
});

export default client;

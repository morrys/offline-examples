import { ApolloClient } from "@wora/apollo-offline";
import ApolloCache from "@wora/apollo-cache";
import { HttpLink } from "apollo-link-http";

// import ApolloClientIDB from '@wora/apollo-offline/lib/ApolloClientIDB';

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const offlineOptions = {
  manualExecution: false, //optional
  link: httpLink, //optional
  finish: (isSuccess, mutations) => {
    //optional
    console.log("finish offline", isSuccess, mutations);
  },
  onComplete: options => {
    //optional
    const { id, offlinePayload, response } = options;
    return true;
  },
  onDiscard: options => {
    //optional
    const { id, offlinePayload, error } = options;
    return true;
  },
  onPublish: offlinePayload => {
    //optional
    const rand = Math.floor(Math.random() * 4) + 1;
    offlinePayload.serial = rand === 1;
    console.log("offlinePayload", offlinePayload.serial);
    console.log("offlinePayload", offlinePayload);
    return offlinePayload;
  }
};

const cacheOptions = {
  dataIdFromObject: o => o.id
};

const client = new ApolloClient(
  {
    link: httpLink,
    cache: new ApolloCache(cacheOptions)
  },
  offlineOptions
);

// const client = ApolloClientIDB.create({ link: httpLink }, cacheOptions, offlineOptions);

console.log("client", client);

console.log("client querymanager", client.queryManager);

export default client;

import { ApolloClient } from "@wora/apollo-offline";
import ApolloCache from "@wora/apollo-cache";
import { HttpLink } from "apollo-link-http";



const localIP = "192.168.1.105";
const httpLink = new HttpLink({
  uri: 'http://'+localIP+':3000/graphql'
});

const offlineOptions = {
  manualExecution: false, //optional
  link: httpLink, //optional
  finish: (isSuccess, mutations) => { //optional
    console.log("finish offline", isSuccess, mutations)
    /*if(mutations){
      mutations.forEach(mut => {
        const { request, ...others } = mut;
        console.log("mutation", others);
      })
    }*/
  },
  onComplete: (options ) => { //optional
    const { id, offlinePayload, response } = options;
    console.log("onComplete offline", options)
    return true;
  },
  onDiscard: ( options ) => { //optional
    const { id, offlinePayload , error } = options;
    console.log("onDiscard offline", options)
    return true;
  },
  onPublish: (offlinePayload) => { //optional
    //const rand = Math.floor(Math.random() * 4) + 1  
    //offlinePayload.serial = rand===1;
    //console.log("offlinePayload", offlinePayload.serial)
    console.log("onPublish offline", offlinePayload)
    return offlinePayload
  }
};

const cacheOptions = {
  dataIdFromObject: o => o.id
};

const client = new ApolloClient({
  link: httpLink,
  cache: new ApolloCache(cacheOptions)
}, offlineOptions);


export default client;
import OfflineFirst from "@wora/offline-first";
import { Observable } from "apollo-link";
import { v4 as uuid } from "uuid";

// import { MutationStore } from 'apollo-client/data/mutations';
import { getOperationDefinition, getMutationDefinition, resultKeyNameFromField, tryFunctionOrLogError } from "apollo-utilities";
import { InMemoryCache, ObjectCache } from "apollo-cache-inmemory";
import { DataStore } from 'apollo-client/data/store';

class ApolloStoreOffline {


    static create(client,
        persistOptions = {},
        offlineOptions = {}, ) {
        const persistOptionsStoreOffline = {
            prefix: 'apollo-offline',
            serialize: true,
            ...persistOptions,
        };

        const { onComplete, onDiscard, network, manualExecution } = offlineOptions;

        const options = {
            manualExecution,
            execute: (offlineRecord) => executeMutation(client, network, offlineRecord),
            onComplete: (options) => complete(client, onComplete, options),
            onDiscard: (options) => discard(client, onDiscard, options),
            //onDispatch: (request: any) => undefined,
        }
        return new OfflineFirst(options, persistOptionsStoreOffline);
    }
}


function complete(environment, onComplete = (options => true), options) {
    const { offlineRecord, response } = options;
    const { request: { payload }, id } = offlineRecord;
    const operation = payload.operation;
    const snapshot = environment.lookup(operation.fragment);
    return onComplete({ id, offlinePayload: offlineRecord, snapshot: snapshot.data, response });

}

function discard(environment, onDiscard = (options => true), options) {
    const { offlineRecord, error } = options;
    const { id } = offlineRecord;
    if (onDiscard({ id, offlinePayload: offlineRecord, error })) {
        const { request: { backup } } = offlineRecord;
        environment.getStore().publish(backup);
        environment.getStore().notify();
        return true;
    } else {
        return false;
    }
}

async function executeMutation(environment, network, offlineRecord) {
    const { request: { payload }, id } = offlineRecord;
    console.log("execute", id, environment)
    const operation = payload.operation;
    const uploadables = payload.uploadables;
    return network.execute(
        operation.node.params,
        operation.variables,
        { force: true },
        uploadables,
    ).toPromise();
}

class OfflineDataStore extends InMemoryCache {

    datawrite = new ObjectCache();
    writes = [];

    constructor(options) {
        super(options)
    }

    write(write) {
        this.writes.push(write)
        this.storeWriter.writeResultToStore({
          dataId: write.dataId,
          result: write.result,
          variables: write.variables,
          document: this.transformDocument(write.query),
          store: this.datawrite,
          dataIdFromObject: this.config.dataIdFromObject,
          fragmentMatcherFunction: this.config.fragmentMatcher.match,
        });
    }

}

export function publish(client, mutationOptions) {

        const {
            context,
            optimisticResponse,
            update,
            fetchPolicy,
            variables,
            mutation,
            updateQueries,
            ...otherOptions
        } = mutationOptions;


        /*if (typeof update !== 'function') {
            logger('No update function for mutation', { document, variables });
            return;
        }*/

        const result = { data: optimisticResponse };
        /*const cache = new OfflineDataStore(client.store.cache.config)
        cache.restore(client.store.cache.extract());*/

        const id = uuid();

        client.store.markMutationInit({
            mutationId: id,
            document: mutation,
            variables,
            updateQueries,
            update,
            optimisticResponse
          });

          client.queryManager.broadcastQueries();   
        //const store = new DataStore(cache);

        /*store.markMutationResult({
            mutationId: null,
            result,
            document: mutation,
            variables,
            updateQueries: {}, // TODO: populate this?
            update
        });*/

        const payload = {
            mutation,
            variables,
            context,
            optimisticResponse,
        };
        const request = {
            payload,
            backup: {},
            sink: client.store.cache.optimisticData.data
        };

        



        return client.getStoreOffline().publish({ id, request, serial: true }).then(offlineRecord => {
            //const result = { data: optimisticResponse };

            if (fetchPolicy !== 'no-cache') {
                console.log('Running update function for mutation', { mutation, variables });

                /*const cacheWrites = [{
                    result: offlineRecord.request.sink,
                    dataId: 'ROOT_MUTATION',
                    query: mutation.document,
                    variables: mutation.variables,
                    }];

                client.store.cache.performTransaction(c => cacheWrites.forEach(write => c.write(write)));  */ 
                /*client.store.markMutationResult({
                    mutationId: offlineRecord.id,
                    result,
                    document: mutation,
                    variables,
                    updateQueries, // TODO: populate this?
                    update
                });
                */
                /*offlineRecord.request.sink.forEach(element => {
                    console.log("element", element)
                    client.store.cache.write(element)
                });*/
                

                /*const diff = client.store.cache.diff({query: mutation,
                    variables,
                    returnPartialData: true,
            optimistic: false, })
            console.log(diff);*/

                client.queryManager.broadcastQueries(); 

            }
            
            /*environment.getStore().publish(sinkPublish);
            environment.getStore().notify();
            environment.getStoreOffline().notify();*/
            return optimisticResponse;
        }).catch(error => {
            throw error;
        });
}

export default ApolloStoreOffline;
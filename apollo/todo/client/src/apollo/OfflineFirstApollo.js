import OfflineFirst from "@wora/offline-first";
import { v4 as uuid } from "uuid";
import { execute } from 'apollo-link';

import { multiplex } from 'apollo-client/util/observables';

import observableToPromise from 'apollo-client/util/observableToPromise';

import { getOperationName,} from 'apollo-utilities';

class ApolloStoreOffline {


    static create(client,
        persistOptions = {},
        offlineOptions = {}, ) {
        const persistOptionsStoreOffline = {
            prefix: 'apollo-offline',
            serialize: true,
            ...persistOptions,
        };

        const { onComplete, onDiscard, link, manualExecution } = offlineOptions;

        const options = {
            manualExecution,
            execute: (offlineRecord) => executeMutation(client, link, offlineRecord),
            onComplete: (options) => complete(client, onComplete, options),
            onDiscard: (options) => discard(client, onDiscard, options),
            //onDispatch: (request: any) => undefined,
        }
        return new OfflineFirst(options, persistOptionsStoreOffline);
    }
}


function complete(client, onComplete = (options => true), options) {
    const { offlineRecord, response } = options;
    const { id } = offlineRecord;
    return onComplete({ id, offlinePayload: offlineRecord, response: response[0] });

}

function discard(client, onDiscard = (options => true), options) {
    const { offlineRecord, error } = options;
    const { id } = offlineRecord;
    if (onDiscard({ id, offlinePayload: offlineRecord, error })) {
        const { request: { backup, sink } } = offlineRecord;
        return true;
    } else {
        return false;
    }
}

async function executeMutation(client, link = client.link, offlineRecord) {
    const { request: { payload }, id } = offlineRecord;
    console.log("execute", id, client)
    const operation = payload.operation;
    return observableToPromise({ observable: multiplex(execute(link, operation)) }, result => result);
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

    const query = client.queryManager.transform(mutation).document;

    const operation = {
        query,
        variables,
        operationName: getOperationName(query) || void 0,
        context: client.queryManager.prepareContext({
            ...context,
            forceFetch: true
        }),
    };


    /*if (typeof update !== 'function') {
        logger('No update function for mutation', { document, variables });
        return;
    }*/

    const result = { data: optimisticResponse };
    /*const cache = new OfflineDataStore(client.store.cache.config)
    cache.restore(client.store.cache.extract());*/

    const id = uuid();
    if (fetchPolicy !== 'no-cache') {

        client.store.markMutationInit({
            mutationId: id,
            document: mutation,
            variables,
            updateQueries,
            update,
            optimisticResponse
        });

        client.queryManager.broadcastQueries();
    }
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
        operation,
        variables,
        context,
        optimisticResponse,
    };
    const request = {
        payload,
        backup: { ...client.store.cache.data.getState() },
        sink: {...client.store.cache.optimisticData.data}
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
            client.store.markMutationResult({
                mutationId: offlineRecord.id,
                result,
                document: mutation,
                variables,
                updateQueries, // TODO: populate this?
                update
            });

            client.store.markMutationComplete({ mutationId: id, optimisticResponse: true });

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
        client.store.markMutationComplete({ mutationId: id, optimisticResponse: true });
        throw error;
    });
}

export default ApolloStoreOffline;
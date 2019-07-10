import { InMemoryCache } from "apollo-cache-inmemory";
import Cache, { CacheOptions } from "@wora/cache-persist";

const hasOwn = Object.prototype.hasOwnProperty;

class OptimisticCacheLayer extends Cache {
    optimisticId;
    parent;
    transaction;
    persistOptions;
    parentPrefix;

    constructor(
        persistOptions,
        parent,
        optimisticId,
        // OptimisticCacheLayer objects always wrap some other parent cache, so
        // this.parent should never be null.
        transaction,
    ) {
        const persistOptionsStore = {
            prefix: 'relay-store',
            serialize: true,
            ...persistOptions,
        };
        super(persistOptionsStore);
        this.persistOptions = persistOptions;
        this.parent = parent;
        this.transaction = transaction;
        this.optimisticId = optimisticId;

    }

    restore() {
        return super.restore().then(result => {
            const optimisticId = result.data['nextCache'];
            if (optimisticId) {
                const persistOptionsStore = {
                    prefix: ('relay-store-' + optimisticId),
                    serialize: true,
                    //...this.persistOptions,
                };
                const newCache = new OptimisticCacheLayer(persistOptionsStore, result, optimisticId, () => { });
                return newCache.restore();
            }
            return result;

        })

    }

    toObject() {
        if (!this.parent) {
            return { ...this.data }
        }
        return {
            ...this.parent.toObject(),
            ...this.data,
        };
    }

    // All the other accessor methods of ObjectCache work without knowing about
    // this.parent, but the get method needs to be overridden to implement the
    // fallback this.parent.get(dataId) behavior.
    get(dataId) {
        return hasOwn.call(this.data, dataId) || !this.parent
            ? this.data[dataId]
            : this.parent.get(dataId);
    }
}

class OfflineStore extends InMemoryCache {

    cache;
    persistOptions;

    constructor(options, persistOptions, persistOptionsOptimistics) {
        super(options);
        this.persistOptions = persistOptions;
        /*const persistOptionsRecordSource = {
            prefix: 'relay-records',
            serialize: true,
            ...persistOptions,
            ...persistOptionsOptimistics,
        }
        const idbStorages: CacheStorage[] = IDBStorage.create("relay", ["roots", "cache"]);
        const idb: CacheOptions = {
          storage: idbStorages[0],
          serialize: false,
        }
        
        const idb1: CacheOptions = {
          storage: idbStorages[1],
          serialize: false,
        }*/

        this.cache = new OptimisticCacheLayer(persistOptions);
    }

    restore() {
        return Promise.all([this.cache.restore()]).then(result => {
            this.data = result[0];
            this.optimisticData = result[0];
            return this.data;
        })

    }



    performTransaction(
        transaction,
        // This parameter is not part of the performTransaction signature inherited
        // from the ApolloCache abstract class, but it's useful because it saves us
        // from duplicating this implementation in recordOptimisticTransaction.
        optimisticId,
    ) {
        const { data, silenceBroadcast } = this;
        this.silenceBroadcast = true;

        if (typeof optimisticId === 'string') {
            // Add a new optimistic layer and temporarily make this.data refer to
            // that layer for the duration of the transaction.
            const persistOptionsStore = {
                prefix: 'relay-store-' + optimisticId,
                serialize: true,
                ...this.persistOptions,
            };
            if(!this.optimisticData.parent) {
                this.data.set('nextCache', optimisticId);
            } else {
                this.optimisticData.set('nextCache', optimisticId); 
            }
            this.data = this.optimisticData = new OptimisticCacheLayer(
                // Note that there can be multiple layers with the same optimisticId.
                // When removeOptimistic(id) is called for that id, all matching layers
                // will be removed, and the remaining layers will be reapplied.
                persistOptionsStore,
                this.optimisticData,
                optimisticId,
                transaction,
            );
        }

        try {
            transaction(this);
        } finally {
            this.silenceBroadcast = silenceBroadcast;
            this.data = data;
        }

        // This broadcast does nothing if this.silenceBroadcast is true.
        this.broadcastWatches();
    }

}

export default OfflineStore;
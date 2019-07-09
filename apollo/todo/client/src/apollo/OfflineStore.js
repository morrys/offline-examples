import { InMemoryCache } from "apollo-cache-inmemory";
import Cache, { CacheOptions } from "@wora/cache-persist"; 
/*
class OptimisticCacheLayer extends Cache {
    constructor(
      optimisticId,
      // OptimisticCacheLayer objects always wrap some other parent cache, so
      // this.parent should never be null.
      parent,
      transaction,
    ) {
      super(Object.create(null));

    }
  
    toObject() {
      return {
        ...this.parent.toObject(),
        ...this.data.toObject(),
      };
    }
  
    // All the other accessor methods of ObjectCache work without knowing about
    // this.parent, but the get method needs to be overridden to implement the
    // fallback this.parent.get(dataId) behavior.
    get(dataId) {
      return hasOwn.call(this.data, dataId)
        ? this.data[dataId]
        : this.parent.get(dataId);
    }
  }*/

class OfflineStore extends InMemoryCache {

    cache;

    constructor(options, persistOptions, persistOptionsOptimistics) {
        super(options);
        const persistOptionsStore = {
            prefix: 'relay-store',
            serialize: true,
            ...persistOptions,
          };
          const persistOptionsRecordSource = {
            prefix: 'relay-records',
            serialize: true,
            ...persistOptions,
            ...persistOptionsOptimistics,
          }
          /*const idbStorages: CacheStorage[] = IDBStorage.create("relay", ["roots", "cache"]);
          const idb: CacheOptions = {
            storage: idbStorages[0],
            serialize: false,
          }
          
          const idb1: CacheOptions = {
            storage: idbStorages[1],
            serialize: false,
          }*/
      
      
        const cacheOptimistic = new Cache(persistOptionsRecordSource);
        this.cache = new Cache(persistOptionsStore);
    }

    restore() {
        this.data = this.cache;
        this.optimisticData = this.cache;
        return Promise.all([this.cache.restore()]);
    }


/*
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
            this.data = this.optimisticData = new OptimisticCacheLayer(
                // Note that there can be multiple layers with the same optimisticId.
                // When removeOptimistic(id) is called for that id, all matching layers
                // will be removed, and the remaining layers will be reapplied.
                optimisticId,
                super.optimisticData,
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
*/
}

export default OfflineStore;
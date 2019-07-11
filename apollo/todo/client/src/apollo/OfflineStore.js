import { InMemoryCache } from "apollo-cache-inmemory";
import Cache, { CacheOptions } from "@wora/cache-persist";

const hasOwn = Object.prototype.hasOwnProperty;

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

        this.cache = new Cache(persistOptions);
    }

    restore() {
        return Promise.all([this.cache.restore()]).then(result => {
            this.data = result[0];
            this.optimisticData = result[0];
            return this.data;
        })

    }

}

export default OfflineStore;
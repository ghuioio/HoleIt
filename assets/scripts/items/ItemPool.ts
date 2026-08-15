import { instantiate, Node, NodePool, Prefab } from 'cc';
import { ItemRuntime } from './ItemRuntime';

/**
 * Small keyed pool used by the level spawner. Consumed items are detached and
 * retained for a later level reload instead of being destroyed.
 */
export class ItemPool {
    private readonly _pools = new Map<string, NodePool>();

    public acquire(key: string, prefab: Prefab): Node {
        const pool = this._pools.get(key);
        if (pool && pool.size() > 0) {
            const reused = pool.get();
            if (reused) {
                reused.active = true;
                return reused;
            }
        }
        return instantiate(prefab);
    }

    public release(item: ItemRuntime): void {
        const key = item.poolKey || item.id;
        let pool = this._pools.get(key);
        if (!pool) {
            pool = new NodePool();
            this._pools.set(key, pool);
        }

        item.node.removeFromParent();
        pool.put(item.node);
    }
}

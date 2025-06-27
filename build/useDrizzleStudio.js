import { useDevToolsPluginClient } from 'expo/devtools';
import { useEffect } from 'react';
export function useDrizzleStudio(db) {
    const client = useDevToolsPluginClient('expo-drizzle-studio-plugin');
    const queryFn = (db, client) => async (e) => {
        try {
            const statement = await db.prepareAsync(e.sql);
            let executed;
            if (e.arrayMode) {
                executed = await statement.executeForRawResultAsync(e.params || []);
            }
            else {
                executed = await statement.executeAsync(e.params || []);
            }
            const data = await executed.getAllAsync();
            client.sendMessage(`query-${e.id}`, data);
        }
        catch (error) {
            client.sendMessage(`query-${e.id}`, { error: error.message });
        }
    };
    const transactionFn = (db, client) => async (e) => {
        const results = [];
        try {
            await db.withTransactionAsync(async () => {
                for (const query of e.queries) {
                    const stmt = await db.prepareAsync(query.sql);
                    const executed = await stmt.executeAsync(query.params || []);
                    const result = await executed.getAllAsync();
                    results.push(result);
                }
            });
        }
        catch (error) {
            results.push({ error: error.message });
        }
        client.sendMessage(`transaction-${e.id}`, results);
    };
    useEffect(() => {
        if (!client || !db) {
            return;
        }
        const subscriptions = [];
        subscriptions.push(client.addMessageListener('query', queryFn(db, client)));
        subscriptions.push(client.addMessageListener('transaction', transactionFn(db, client)));
        return () => {
            for (const subscription of subscriptions) {
                subscription.remove();
            }
        };
    }, [client, db]);
}
//# sourceMappingURL=useDrizzleStudio.js.map
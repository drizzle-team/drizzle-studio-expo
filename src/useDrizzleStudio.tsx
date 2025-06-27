import * as SQLite from 'expo-sqlite';
import { DevToolsPluginClient, EventSubscription, useDevToolsPluginClient } from 'expo/devtools';
import { useEffect } from 'react';

export function useDrizzleStudio(db: SQLite.SQLiteDatabase | null) {
  const client = useDevToolsPluginClient('expo-drizzle-studio-plugin');

  const queryFn =
    (db: SQLite.SQLiteDatabase, client: DevToolsPluginClient) =>
    async (e: { sql: string; params?: SQLite.SQLiteBindValue[]; arrayMode: boolean; id: string }) => {
      try {
        const statement = await db.prepareAsync(e.sql);
        let executed: SQLite.SQLiteExecuteAsyncResult<unknown>;
        if (e.arrayMode) {
          executed = await statement.executeForRawResultAsync(e.params || []);
        } else {
          executed = await statement.executeAsync(e.params || []);
        }
        const data = await executed.getAllAsync();
        client.sendMessage(`query-${e.id}`, data);
      } catch (error) {
        client.sendMessage(`query-${e.id}`, { error: error.message });
      }
    };

  const transactionFn =
    (db: SQLite.SQLiteDatabase, client: DevToolsPluginClient) =>
    async (e: { queries: { sql: string; params?: SQLite.SQLiteBindValue[] }[]; id: string }) => {
      const results: any[] = [];
      try {
        await db.withTransactionAsync(async () => {
          for (const query of e.queries) {
            const stmt = await db.prepareAsync(query.sql);
            const executed = await stmt.executeAsync(query.params || []);
            const result = await executed.getAllAsync();
            results.push(result);
          }
        });
      } catch (error) {
        results.push({ error: error.message });
      }
      client.sendMessage(`transaction-${e.id}`, results);
    };

  useEffect(() => {
    if (!client || !db) {
      return;
    }

    const subscriptions: EventSubscription[] = [];

    subscriptions.push(client.addMessageListener('query', queryFn(db, client)));
    subscriptions.push(client.addMessageListener('transaction', transactionFn(db, client)));

    return () => {
      for (const subscription of subscriptions) {
        subscription.remove();
      }
    };
  }, [client, db]);
}

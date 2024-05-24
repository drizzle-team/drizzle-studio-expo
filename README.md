# expo-drizzle-studio-plugin

Create SQLite DB in Expo project and manage it with Drizzle studio.

# Documentation
1. [Create SQLite DB in your Expo project](https://docs.expo.dev/versions/latest/sdk/sqlite/)
2. Install expo-drizzle-studio-plugin
```shell
npm i expo-drizzle-studio-plugin
```
3. Create the hook useDrizzleStudio
```jsx
import { useDrizzleStudioPlugin } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { EventSubscription } from "react-native";

export default function useDrizzleStudio(dbName: string) {
    const client = useDrizzleStudioPlugin();
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    const transferData = async (e: {
        sql: string;
        params: (string | number)[];
        arrayMode: boolean;
        id: string;
    }) => {
        if (!db) return;
        try {

            const statement = await db.prepareAsync(e.sql);
            let executed;
            if (e.arrayMode) {
                executed = await statement.executeForRawResultAsync(e.params);
            } else {
                executed = await statement.executeAsync(e.params);
            }
            
            const data = await executed.getAllAsync();
            client?.sendMessage(`transferData-${e.id}`, { from: "app", data });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const openDb = async () => {
            const newDb = await SQLite.openDatabaseAsync(dbName);
            setDb(newDb);
        };
        openDb();
    }, [dbName]);

    useEffect(() => {
        const subscriptions: EventSubscription[] = [];

        subscriptions.push(client?.addMessageListener("getData", transferData));

        return () => {
            for (const subscription of subscriptions) {
                subscription?.remove();
            }
        };
    }, [client]);
}
```
4. Call the hook and provide DB name to connect SQLite DB with Drizzle Studio
```jsx
useDrizzleStudio("SQLite-db-name");
```
5. Run and Expo app on physical device, simulator or emulator which supports Expo SQLite. Web doesn't support SQLite.
```shell
npx expo start
```
6. Open devtools menu from the terminal with "start" process and choose expo-drizzle-studio-plugin
```
shift + m
```
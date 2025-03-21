import * as opSQLite from "@op-engineering/op-sqlite";
import * as SQLite from "expo-sqlite";
import { useDevToolsPluginClient } from "expo/devtools";
import { useEffect } from "react";

type Props =
    | { driver: "expo"; db: SQLite.SQLiteDatabase | null }
    | { driver: "opsqlite"; db: opSQLite.DB | null };

export default function useDrizzleStudio(props: Props) {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");

    const transferData = async (e: {
        sql: string;
        params: (string | number)[];
        arrayMode: boolean;
        id: string;
    }) => {
        if (!props.db) return;
        let data: any[] = [];

        try {
            if (props.driver === "expo") {
                const statement = await props.db.prepareAsync(e.sql);
                let executed;
                if (e.arrayMode) {
                    executed = await statement.executeForRawResultAsync(
                        e.params,
                    );
                } else {
                    executed = await statement.executeAsync(e.params);
                }

                data = await executed.getAllAsync();
            } else {
                if (e.arrayMode) {
                    data = await props.db.executeRaw(e.sql, e.params);
                } else {
                    const executed = await props.db.execute(e.sql, e.params);
                    data = executed.rows;
                }
            }

            client?.sendMessage(`transferData-${e.id}`, { from: "app", data });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const subscriptions: any[] = [];

        subscriptions.push(client?.addMessageListener("getData", transferData));

        return () => {
            for (const subscription of subscriptions) {
                subscription?.remove();
            }
        };
    }, [client, db]);
}

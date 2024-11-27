import { useDevToolsPluginClient } from "expo/devtools";
import { useEffect } from "react";
export default function useDrizzleStudio(props) {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");
    const transferData = async (e) => {
        if (!props.db)
            return;
        let data = [];
        try {
            if (props.driver === "expo") {
                const statement = await props.db.prepareAsync(e.sql);
                let executed;
                if (e.arrayMode) {
                    executed = await statement.executeForRawResultAsync(e.params);
                }
                else {
                    executed = await statement.executeAsync(e.params);
                }
                data = await executed.getAllAsync();
            }
            else {
                const statement = props.db.prepareStatement(e.sql);
                statement.bind(e.params);
                const executed = await statement.execute();
                if (e.arrayMode) {
                    const rows = [];
                    executed.rows.forEach(row => {
                        const keys = Object.keys(row);
                        const rowValues = [];
                        keys.forEach(key => {
                            rowValues.push(row[key]);
                        });
                        rows.push(rowValues);
                    });
                    data = rows;
                }
                else {
                    data = executed.rows;
                }
            }
            client?.sendMessage(`transferData-${e.id}`, { from: "app", data });
        }
        catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const subscriptions = [];
        subscriptions.push(client?.addMessageListener("getData", transferData));
        return () => {
            for (const subscription of subscriptions) {
                subscription?.remove();
            }
        };
    }, [client]);
}
//# sourceMappingURL=useDrizzleStudio.js.map
import { useDevToolsPluginClient } from "expo/devtools";
import { useEffect } from "react";
export default function useDrizzleStudio(db) {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");
    const transferData = async (e) => {
        if (!db)
            return;
        try {
            const statement = await db.prepareAsync(e.sql);
            let executed;
            if (e.arrayMode) {
                executed = await statement.executeForRawResultAsync(e.params);
            }
            else {
                executed = await statement.executeAsync(e.params);
            }
            const data = await executed.getAllAsync();
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
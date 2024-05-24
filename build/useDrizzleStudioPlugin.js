import { useDevToolsPluginClient } from "expo/devtools";
export function useDrizzleStudioPlugin() {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");
    // useEffect(() => {
    //   const subscriptions: EventSubscription[] = [];
    //   subscriptions.push(
    //     client?.addMessageListener('ping', (data) => {
    //       alert(`Received ping from ${data.from}`);
    //     })
    //   );
    //   client?.sendMessage('ping', { from: 'app' });
    //   return () => {
    //     for (const subscription of subscriptions) {
    //       subscription?.remove();
    //     }
    //   };
    // }, [client]);
    return client;
}
//# sourceMappingURL=useDrizzleStudioPlugin.js.map
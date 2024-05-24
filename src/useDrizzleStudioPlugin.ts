import { useDevToolsPluginClient } from "expo/devtools";

export function useDrizzleStudioPlugin() {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");

    return client;
}

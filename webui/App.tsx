import {
    DevToolsPluginClient,
    useDevToolsPluginClient
} from "expo/devtools";
import { ComponentPropsWithoutRef, RefObject, useEffect, useRef } from "react";
import StudioScript from './studio.js';

declare global {
    interface Window {
        client: DevToolsPluginClient;
    }
}

interface DrizzleStudioRef {
    dbHash: string;
    client: DevToolsPluginClient;
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'drizzle-studio': ComponentPropsWithoutRef<'div'> & {
        ref?: RefObject<DrizzleStudioRef | null>;
      };
    }
  }
}

export default function App() {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");
    const studioRef = useRef<DrizzleStudioRef>(null);

    useEffect(() => {
        if (!client) {
            return;
        }
        if (!customElements.get("drizzle-studio")) {
            new Function(StudioScript as string)();
        }
        if (studioRef.current) {
            studioRef.current.dbHash = client.connectionInfo.devServer;
            studioRef.current.client = client;
        }
    }, [client]);

    return (
            <drizzle-studio
                ref={studioRef}
                style={{
                    flexGrow: 1,
                    minHeight: 0
                }}
            />
    );
}

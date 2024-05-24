import {
    DevToolsPluginClient,
    useDevToolsPluginClient,
    type EventSubscription
} from "expo/devtools";
import React, {
    ComponentPropsWithoutRef,
    useEffect,
    useRef,
    useState
} from "react";
import ReactDOM from "react-dom";
import ReactDOMClient from "react-dom/client";
import { View } from "react-native";
// @ts-ignore
import StudioScript from "./studio.js";

declare global {
    interface Window {
        client: DevToolsPluginClient;
    }
    namespace JSX {
        interface IntrinsicElements {
            "drizzle-studio": ComponentPropsWithoutRef<"div"> & {
                "ref": React.RefObject<{
                    reset: () => void;
                }>;
                "css-variables": string;
            };
        }
    }
}

const drizzleStudioFunc = new Function("React", "ReactDOM", "ReactDOMClient", StudioScript);

const lightCssVariables = {
    "--page-background": "#F0F0F0",
    "--background": "#FFFFFF",
    "--foreground": "#171717",
    "--popover": "#FFFFFF",
    "--popover-foreground": "#171717",
    "--primary": "#0A0A0A",
    "--primary-foreground": "#EAEAEA",
    "--secondary": "#F0F0F0",
    "--secondary-foreground": "#171717",
    "--muted": "#F8F8F8",
    "--muted-foreground": "#454545",
    "--accent": "#F0F0F0",
    "--accent-foreground": "#0A0A0A",
    "--destructive": "#D93035",
    "--destructive-foreground": "#FEEBEE",
    "--border": "#EBEBEB",
    "--input": "#EBEBEB",
    "--number-color": "#0068D6",
    "--property-name": "#171717",
    "--cursor": "#171717",
    "--line-number": "#A8A8A8",
    "--string-value": "#297A3A",
    "--boolean-value": "#7820BC",
    "--highlight-background": "#F0F0F070",
    "--editor-background": "#FFFFFF",
    "--selection": "#F0F0F0",
    "--fold-gutter-hover": "#D6D9E4",
    "--sql-variable-color": "#171717",
    "--sql-method-color": "#0068D6",
    "--sql-property-color": "#171717",
    "--sql-number-value-color": "#BD2864",
    "--sql-string-value-color": "#297A3A",
    "--sql-boolean-value-color": "#BD2864",
    "--editor-font": "Menlo",
    "--table-font": "Roboto Mono",
    "--interface-font": "Open Sans",
    "--filters-toolbar": "#F8F8F8",
    "--edit": "#FFF6E5",
    "--edit-foreground": "#A45200",
    "--submit": "#46A557",
    "--submit-foreground": "#EFFBEF",
    "--radius": "0.5rem",
    "--checkbox-radius": "2px",
    "--filter-icon-set": "default",
    "--sort-icon-set": "default",
    "--download-icon-set": "default",
    "--theme-icon-set": "default",
    "--chevron-icon-set": "default",
    "--refresh-icon-set": "default",
    "--table-icon-set": "default",
    "--sidebar-icon-set": "default",
    "--sql-runner-icon-set": "default"
};

const darkCssVariables = {
    "--page-background": "#191919",
    "--background": "#191919",
    "--foreground": "#BFBFBF",
    "--popover": "#191919",
    "--popover-foreground": "#BFBFBF",
    "--primary": "#F5F5F5",
    "--primary-foreground": "#191D23",
    "--secondary": "#15222E",
    "--secondary-foreground": "#007BFF",
    "--muted": "#222222",
    "--muted-foreground": "#757575",
    "--accent": "#1C1C1C",
    "--accent-foreground": "#BFBFBF",
    "--destructive": "#FF467D",
    "--destructive-foreground": "#FAFAFA",
    "--border": "#2E2E2E",
    "--input": "#2E2E2E",
    "--number-color": "#7FC578",
    "--property-name": "#E6E1DD",
    "--cursor": "#abb2bf",
    "--line-number": "#7D8799",
    "--string-value": "#FC803A",
    "--boolean-value": "#FC803A",
    "--highlight-background": "#48484870",
    "--editor-background": "#030711",
    "--selection": "#3e4451",
    "--fold-gutter-hover": "#434346",
    "--table-vertical-lines": "1px",
    "--editor-font": "Menlo",
    "--table-font": "Roboto Mono",
    "--interface-font": "Open Sans",
    "--filters-toolbar": "#222222",
    "--edit": "#FFD69D",
    "--edit-foreground": "#7F4C04",
    "--submit": "#00DB9A",
    "--submit-foreground": "#025A40",
    "--radius": "0.6rem",
    "--checkbox-radius": "2px",
    "--filter-icon-set": "default",
    "--sort-icon-set": "default",
    "--download-icon-set": "default",
    "--theme-icon-set": "default",
    "--chevron-icon-set": "default",
    "--refresh-icon-set": "default",
    "--table-icon-set": "default",
    "--sidebar-icon-set": "default",
    "--buttons-variant": "default",
    "--table-vertical-lines-padding": "8px",
    "--table-vertical-lines-padding-checkbox": "2px",
    "--sql-runner-icon-set": "default",
    "--sql-variable-color": "#E1E3E7",
    "--sql-method-color": "#FC803A",
    "--sql-property-color": "#E6E1DD",
    "--sql-number-value-color": "#7FC578",
    "--sql-string-value-color": "#E6E1DD",
    "--sql-boolean-value-color": "#E2E4E8"
};

export default function App() {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");
    const studioRef = useRef<{
        reset: () => void;
    }>(null);

    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {

        if (client) {
            window.client = client;
            drizzleStudioFunc(React, ReactDOM, ReactDOMClient);
        }

        return () => {
            // reset the studio when the component unmounts
            if (studioRef.current?.reset) {
                studioRef.current.reset();
            }
        };
    }, [client]);

    // add the Roboto Mono font to the page
    useEffect(() => {
        const existingLink = document.querySelector('link[data-font="Roboto Mono"]');


        if (existingLink) {
            return;
        }

        const fontLink = document.createElement("link");
        fontLink.rel = "stylesheet";
        fontLink.href = `https://fonts.googleapis.com/css?family=Roboto+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap`;
        fontLink.setAttribute("data-font", "Roboto Mono");
        document.head.appendChild(fontLink);
    }, []);

    useEffect(() => {
        const subscriptions: EventSubscription[] = [];

        return () => {
            for (const subscription of subscriptions) {
                subscription?.remove();
            }
        };
    }, [client]);

    return (
        <View
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <drizzle-studio
                ref={studioRef}
                css-variables={JSON.stringify(
                    theme === "light" ? lightCssVariables : darkCssVariables
                )}
                style={{
                    flexGrow: 1,
                    minHeight: 0
                }}
            />
        </View>
    );
}

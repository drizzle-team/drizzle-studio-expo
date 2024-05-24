# expo-drizzle-studio-plugin

Create SQLite DB in Expo project and manage it with Drizzle studio.

# Documentation

[Create SQLite DB in your Expo project](https://docs.expo.dev/versions/latest/sdk/sqlite/)
Install expo-drizzle-studio-plugin

```shell
npm i expo-drizzle-studio-plugin
```

Call the hook and provide DB to connect SQLite DB with Drizzle Studio
```jsx
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { View } from "react-native";

const db = SQLite.openDatabaseSync("db");

export default function App() {
    useDrizzleStudio(db);

    return <View></View>;
}
```

Run and Expo app on physical device, simulator or emulator which supports Expo SQLite. Web doesn't support SQLite.

```shell
npx expo start
```

Open devtools menu from the terminal with "start" process and choose expo-drizzle-studio-plugin

```
shift + m
```

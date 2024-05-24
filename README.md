# Drizzle Studio for Expo SQLite
Expo dev tools plugin for you to browse your Expo SQLite data with Drizzle Studio 🎉

### Get Started
[Add Expo SQLite to your project](https://docs.expo.dev/versions/latest/sdk/sqlite/)  
  
Install `expo-drizzle-studio-plugin`
```shell
npm i expo-drizzle-studio-plugin
```

Setup Drizzle Studio plugin
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

Open devtools menu from the terminal with "start" process and choose `expo-drizzle-studio-plugin`
```
shift + m
```

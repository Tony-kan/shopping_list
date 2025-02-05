import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect } from "react";
import "react-native-reanimated";
import "./global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { usersTable } from "@/db/schema";
import migrations from "../drizzle/migrations";
import { ActivityIndicator } from "react-native";
import { SQLiteProvider, openDatabaseAsync } from "expo-sqlite";

export const DATABASE_NAME = "shopping_list";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// const shopping_list_db = SQLite.openDatabaseSync("shopping_list.db");

// const db = drizzle(shopping_list_db);
export default function RootLayout() {
  const expoDB = openDatabaseAsync(DATABASE_NAME);
  const db = drizzle(expoDB);
  // useDrizzleStudio(db);
  const { success, error } = useMigrations(db, migrations);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  (async () => {
    db.delete(usersTable);

    await db.insert(usersTable).values([
      {
        name: "John",
        age: 30,
        email: "john@example.com",
      },
    ]);

    const users = await db.select().from(usersTable).all();
    console.log(JSON.stringify(users, null, 2));
  })();

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName="shopping_list.db"
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}

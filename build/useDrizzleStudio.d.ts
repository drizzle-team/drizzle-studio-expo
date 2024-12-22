import * as opSQLite from "@op-engineering/op-sqlite";
import * as SQLite from "expo-sqlite";
type Props = {
    driver: "expo";
    db: SQLite.SQLiteDatabase | null;
} | {
    driver: "opsqlite";
    db: opSQLite.DB | null;
};
export default function useDrizzleStudio(props: Props): void;
export {};
//# sourceMappingURL=useDrizzleStudio.d.ts.map
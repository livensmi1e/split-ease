import { RowData } from "@/types/group";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { dropAllTables } from "./initdb";

interface Table {
  name: string;
  type: "table" | "view";
}

function SchemaView() {
  const db = useSQLiteContext();
  const [tables, setTables] = useState<Table[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData[]>>({});
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const tableList: Table[] = await db.getAllAsync(`
          SELECT name, type FROM sqlite_master
          WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'
          ORDER BY type, name;
        `);
        setTables(tableList);
      } catch (error) {
        console.error("Error loading tables/views:", error);
      }
    };

    setupDatabase();
  }, []);

  const toggleTable = async (tableName: string) => {
    const newExpanded = new Set(expandedTables);

    if (expandedTables.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);

      if (!tableData[tableName]) {
        try {
          const rows: RowData[] = await db.getAllAsync(`SELECT * FROM ${tableName}`);
          setTableData((prev) => ({ ...prev, [tableName]: rows }));
        } catch (err) {
          console.error(`❌ Error loading data from ${tableName}:`, err);
          setTableData((prev) => ({
            ...prev,
            [tableName]: [{ error: "Query failed" }],
          }));
        }
      }
    }

    setExpandedTables(newExpanded);
  };

  const handleCustomAction = async () => {
    if (!db) return;

    try {
      await db.runAsync("DELETE FROM expense;")

      const newTableData: Record<string, RowData[]> = {};

      for (const table of tables) {
        try {
          const rows: RowData[] = await db.getAllAsync(`SELECT * FROM ${table.name}`);
          newTableData[table.name] = rows;
        } catch (err) {
          console.error(`Lỗi khi load lại bảng ${table.name}:`, err);
          newTableData[table.name] = [{ error: "Query failed" }];
        }
      }
      setTableData(newTableData);
    } catch (err) {
      console.error("Lỗi khi làm mới dữ liệu:", err);
      Alert.alert("Thất bại khi làm mới database");
    }
  };

  const handleReloadDatabase = async () => {
    if (!db) return;

    try {
      const tableList: Table[] = await db.getAllAsync(`
        SELECT name, type FROM sqlite_master
        WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'
        ORDER BY type, name;
      `);
      setTables(tableList);

      const newTableData: Record<string, RowData[]> = {};
      for (const table of tableList) {
        try {
          const rows: RowData[] = await db.getAllAsync(`SELECT * FROM ${table.name}`);
          newTableData[table.name] = rows;
        } catch (err) {
          console.error(`Lỗi khi load lại bảng ${table.name}:`, err);
          newTableData[table.name] = [{ error: "Query failed" }];
        }
      }

      setTableData(newTableData);
      Alert.alert("Reload thành công!");
    } catch (err) {
      console.error("Lỗi reload:", err);
      Alert.alert("Không thể reload database");
    }
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 100,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          SQLite Tables & Views
        </Text>

        {tables.length === 0 ? (
          <Text>Loading tables and views...</Text>
        ) : (
          tables.map((table) => (
            <View key={table.name} style={{ marginBottom: 20 }}>
              <TouchableOpacity onPress={() => toggleTable(table.name)}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: table.type === "view" ? "#FF9500" : "#007AFF",
                  }}
                >
                  {table.name} {table.type === "view" ? "(view)" : ""}
                </Text>
              </TouchableOpacity>

              {expandedTables.has(table.name) && (
                <View style={{ marginLeft: 10, marginTop: 10 }}>
                  {tableData[table.name]?.length === 0 ? (
                    <Text style={{ fontStyle: "italic" }}>No data</Text>
                  ) : (
                    tableData[table.name]?.map((row, idx) => (
                      <View key={idx} style={{ marginBottom: 5 }}>
                        {Object.entries(row).map(([key, value]) => (
                          <Text key={key}>
                            {key}: {String(value)}
                          </Text>
                        ))}
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          ))
        )}

        <View
          style={{
            position: "absolute",
            bottom: 20,
            alignSelf: "center",
            flexDirection: "row",
            gap: 12,
            zIndex: 1000,
          }}
        >
          <TouchableOpacity
            onPress={handleCustomAction}
            style={{
              backgroundColor: "#007AFF",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Thêm dữ liệu mẫu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReloadDatabase}
            style={{
              backgroundColor: "#34C759",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Reload Database
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default SchemaView;

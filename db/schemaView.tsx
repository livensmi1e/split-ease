import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SQLiteDatabase } from 'expo-sqlite';
import { getDb, initDatabase } from './initdb';
import {createGroup, getAllGroup} from '@/core/groups';
import { RowData } from '@/types/group';
import { createExpense } from '@/core/expenses';
interface Table {
  name: string;
}



function SchemaView() {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData[]>>({});
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await getDb();
        setDb(database);

        const tableList: Table[] = await database.getAllAsync(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
        );
        setTables(tableList);
      } catch (error) {
        console.error('Error setting up database or loading tables:', error);
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
          const rows: RowData[] = await db!.getAllAsync(`SELECT * FROM ${tableName}`);
          setTableData(prev => ({ ...prev, [tableName]: rows }));
        } catch (err) {
          console.error(`❌ Error loading data from ${tableName}:`, err);
          setTableData(prev => ({ ...prev, [tableName]: [{ error: 'Query failed' }] }));
        }
      }
    }

    setExpandedTables(newExpanded);
  };

  const handleCustomAction = async () => {
    if (!db) return;

    try {
    // await createGroup("passiondev", "USD");
    // const result = await createExpense("Food", 1000, 2);
    const reuslt = await getAllGroup();
    console.log(reuslt);
    // console.log(result);
    Alert.alert('Đã thêm dữ liệu mẫu');

    if (!db) return;

    const newTableData: Record<string, RowData[]> = {};

    for (const table of tables) {
      try {
        const rows: RowData[] = await db.getAllAsync(`SELECT * FROM ${table.name}`);
        newTableData[table.name] = rows;
      } catch (err) {
        console.error(`Lỗi khi load lại bảng ${table.name}:`, err);
        newTableData[table.name] = [{ error: 'Query failed' }];
      }
    }
    setTableData(newTableData);

  } catch (err) {
    console.error(' Lỗi thêm dữ liệu mẫu:', err);
    Alert.alert('Thất bại khi thêm dữ liệu');
  }

  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 100,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          SQLite Tables & Data
        </Text>

        {tables.length === 0 ? (
          <Text>Loading tables...</Text>
        ) : (
          tables.map((table) => (
            <View key={table.name} style={{ marginBottom: 20 }}>
              <TouchableOpacity onPress={() => toggleTable(table.name)}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>
                  {table.name}
                </Text>
              </TouchableOpacity>

              {expandedTables.has(table.name) && (
                <View style={{ marginLeft: 10, marginTop: 10 }}>
                  {tableData[table.name]?.length === 0 ? (
                    <Text style={{ fontStyle: 'italic' }}>No data</Text>
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
        <TouchableOpacity
        onPress={handleCustomAction}
        style={{
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
          backgroundColor: '#007AFF',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
          zIndex: 1000,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Thêm dữ liệu mẫu</Text>
      </TouchableOpacity>
      </ScrollView>

      
    </View>
  );
}

export default SchemaView;

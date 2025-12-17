import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { QuickNote } from "@/lib/quickNoteRepo";
import { createQuickNote, deleteQuickNote, listQuickNotes } from "@/lib/quickNoteRepo";

export default function QuickNoteScreen() {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(() => {
    setNotes(listQuickNotes());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleSave = () => {
    if (submitting) {
      return;
    }
    if (!content.trim()) {
      Alert.alert("Catatan kosong", "Isi catatan sebelum disimpan.");
      return;
    }

    try {
      setSubmitting(true);
      createQuickNote(content);
      setContent("");
      refresh();
    } catch (error) {
      Alert.alert("Gagal menyimpan", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Hapus catatan", "Yakin ingin menghapus catatan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          deleteQuickNote(id);
          refresh();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}
        ListHeaderComponent={
          <View>
            <Text className="text-sm text-slate-500">Catatan cepat</Text>
            <Text className="mt-1 text-2xl font-semibold text-slate-900">
              Simpan follow-up atau janji bayar
            </Text>

            <View className="mt-6 space-y-4">
              <Input
                label="Tambahkan catatan"
                placeholder="Contoh: Janji transfer Jumat siang"
                multiline
                value={content}
                onChangeText={setContent}
                className="min-h-[100px]"
              />
              <Button label="Simpan catatan" onPress={handleSave} disabled={submitting} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-3xl border border-slate-100 bg-white p-4">
            <Text className="text-base text-slate-900">{item.content}</Text>
            <Text className="mt-2 text-xs text-slate-400">
              Dibuat {new Date(item.createdAt).toLocaleString("id-ID")}
            </Text>
            <Button
              label="Hapus"
              variant="ghost"
              className="mt-3"
              textClassName="text-rose-500"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white p-6">
            <Text className="text-center text-sm text-slate-500">
              Belum ada catatan. Tuliskan follow-up penting agar tidak lupa.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

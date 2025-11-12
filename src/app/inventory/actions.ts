"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function deleteItem(id: string) {
  if (!id) return { ok: false, message: "IDが不正です。" };

  const supabase = await createClient();

  // 必要ならログイン確認
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "ログインが必要です。" };

  // ← ここはあなたの実テーブル名に合わせる
  const { error } = await supabase.from("pantry_items").delete().eq("id", id);
  if (error) return { ok: false, message: `削除に失敗: ${error.message}` };

  // 一覧再描画／トップにしてるなら "/"
  revalidatePath("/");
  return { ok: true, message: "削除しました！" };
}

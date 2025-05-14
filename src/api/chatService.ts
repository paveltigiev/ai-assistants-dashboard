// import useSupabase from '@/lib/supabaseClient'
// const { supabase } = useSupabase()
import { supabase } from "@/lib/supabaseClient";
import type { Chat, Message } from '@/types/chatTypes'

export const fetchChats  = async (): Promise<Chat[]> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")

    if (error) throw error

    return data
  } catch (error) {
    console.log( (error as Error).message)
    return []
  }
}

export const fetchMessages = async (chat_id: number, workspaceId?: number): Promise<Message[]> => {
  try {
    let query = supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat_id)
      .order('id', { ascending: false })

    if (workspaceId) {
      query = query.eq("workspace_id", workspaceId)
    }

    const { data, error } = await query

    if (error) throw error

    return data
  } catch (error) {
    console.log((error as Error).message)
    return []
  }
}

export const subscribeToMessages = async (callback: any) => {
  supabase
    .channel('messages-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages'
      },
      () => callback()
    )
    .subscribe()
}

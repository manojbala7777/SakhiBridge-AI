import axios from "axios";
import type { ChatResponse, Lang, Scheme } from "../types";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  timeout: 15000,
});

export async function sendChat(message: string, language: Lang, sessionId: string | null): Promise<ChatResponse> {
  const { data } = await http.post<ChatResponse>("/chat", { message, language, session_id: sessionId });
  return data;
}

export async function getScheme(id: string): Promise<Scheme> {
  const { data } = await http.get<Scheme>(`/schemes/${id}`);
  return data;
}

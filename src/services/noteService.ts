import axios from 'axios';
import { type Note, type NoteTag } from '../types/note';

const API_BASE = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  const { data } = await axiosInstance.get<FetchNotesResponse>('/notes', {
    params,
  });

  return data;
}

export interface CreateNoteParams {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function createNote(params: CreateNoteParams): Promise<Note> {
  const { data } = await axiosInstance.post<Note>('/notes', params);
  return data;
}

export interface DeleteNoteResponse {
  message: string;
  note: Note;
}

export async function deleteNote(id: number): Promise<DeleteNoteResponse> {
  const { data } = await axiosInstance.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
}

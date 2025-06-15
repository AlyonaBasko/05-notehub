import axios from 'axios';
import { type Note, type NoteTag, type NotesResponse } from '../types/note';

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

export async function fetchNotes({ page, perPage, search }: { page: number, perPage: number, search: string }): Promise<NotesResponse> {
  const params: Record<string, unknown> = {
    page,
    limit: perPage,
    search: search || '', 
  };

  const { data } = await axiosInstance.get<FetchNotesResponse>('/notes', { params });

  return {
    notes: data.notes,
    totalPages: data.totalPages,
  };
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

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const { data } = await axiosInstance.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
}
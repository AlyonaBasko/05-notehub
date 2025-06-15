export interface Note {
  id: number
  title: string;
  content?: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}
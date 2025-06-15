export interface Note {
    _id: string;
    title: string;
    content: string;
    tag: NoteTag;
    createdAt: string;
    updatedAt: string;
}
export interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}
  
export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  
export interface NotesResponse {
    notes: Note[];
    totalPages: number;
  }
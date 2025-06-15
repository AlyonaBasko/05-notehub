import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import css from './App.module.css'; 
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';

import { fetchNotes, createNote } from '../../services/noteService';
import type { Note, FormValues } from '../../types/note';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<NotesResponse, Error>({
    queryKey: ['notes', { page, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: (previousData: NotesResponse | undefined) => previousData,
  });
  
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  async function handleCreateNote(values: FormValues) {
    try {
      await createNote(values);
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <NoteModal onClose={() => setModalOpen(false)}>
          <NoteForm onCancel={() => setModalOpen(false)} onSubmit={handleCreateNote} />
        </NoteModal>
      )}
    </div>
  );
}
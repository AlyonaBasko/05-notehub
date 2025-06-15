import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery} from '@tanstack/react-query';

import css from './App.module.css'; 
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import NoteModal from '../NoteModal/NoteModal';
import { fetchNotes } from '../../services/noteService';
import type { Note } from '../../types/note';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);


  const { data, isLoading, isError } = useQuery<NotesResponse, Error>({
    queryKey: ['notes', { page, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: (previousData: NotesResponse | undefined) => previousData,
  });
  
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1); 
          }}
        />
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
        <NoteModal onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

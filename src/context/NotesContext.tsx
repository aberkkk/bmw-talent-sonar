import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface ManagerNote {
  id: string;
  employeeId: number;
  text: string;
  timestamp: string; // ISO string
}

interface NotesContextType {
  notes: ManagerNote[];
  addNote: (employeeId: number, text: string) => void;
  deleteNote: (noteId: string) => void;
  updateNote: (noteId: string, text: string) => void;
  getNotesForEmployee: (employeeId: number) => ManagerNote[];
  hasNotes: (employeeId: number) => boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);
const STORAGE_KEY = "bmw-manager-notes";

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<ManagerNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((employeeId: number, text: string) => {
    if (!text.trim()) return;
    setNotes(prev => [...prev, {
      id: crypto.randomUUID(),
      employeeId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }, []);

  const updateNote = useCallback((noteId: string, text: string) => {
    if (!text.trim()) return;
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, text: text.trim() } : n));
  }, []);

  const getNotesForEmployee = useCallback((employeeId: number) => {
    return notes.filter(n => n.employeeId === employeeId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [notes]);

  const hasNotes = useCallback((employeeId: number) => {
    return notes.some(n => n.employeeId === employeeId);
  }, [notes]);

  return (
    <NotesContext.Provider value={{ notes, addNote, getNotesForEmployee, hasNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}

import { useState, useEffect } from 'react';

export function useQuickCreate() {
  const [isOpen, setIsOpen] = useState(false);

  // Ctrl+N or Cmd+N to open Quick Create
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openQuickCreate = () => setIsOpen(true);
  const closeQuickCreate = () => setIsOpen(false);

  return {
    isOpen,
    openQuickCreate,
    closeQuickCreate
  };
}

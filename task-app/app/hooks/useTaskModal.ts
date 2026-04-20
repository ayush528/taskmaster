import { useState } from 'react';

export function useTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const openModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedTaskId(null);
  };

  return {
    isOpen,
    selectedTaskId,
    openModal,
    closeModal,
  };
}

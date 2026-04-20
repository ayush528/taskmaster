'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useQuickCreate } from '../../hooks/useQuickCreate';
import QuickCreateModal from './QuickCreateModal';

export default function QuickCreateButton() {
  const { isOpen, openQuickCreate, closeQuickCreate } = useQuickCreate();

  return (
    <>
      <button 
        onClick={openQuickCreate}
        className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 transition-transform hover:scale-110 active:scale-95 group"
        title="Quick Create (Cmd/Ctrl+N)"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
      </button>

      <QuickCreateModal isOpen={isOpen} onClose={closeQuickCreate} />
    </>
  );
}

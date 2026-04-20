'use client';

import React from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import { Template } from '../../lib/templateUtils';

interface TemplateSelectorProps {
  onSelect: (t: Template) => void;
  className?: string;
}

export default function TemplateSelector({ onSelect, className = '' }: TemplateSelectorProps) {
  const { templates, isLoaded } = useTemplates();

  if (!isLoaded || templates.length === 0) return null;

  return (
    <select 
      onChange={(e) => {
        const tpl = templates.find(t => t.id === e.target.value);
        if (tpl) onSelect(tpl);
        e.target.value = ""; // Reset after selection
      }}
      className={`text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors ${className}`}
      defaultValue=""
    >
      <option value="" disabled>Use Template...</option>
      {templates.map(t => (
        <option key={t.id} value={t.id}>{t.name}</option>
      ))}
    </select>
  );
}

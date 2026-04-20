'use client';

import React, { useState } from 'react';
import { ActivityLog, Task } from '../../context/TaskContext';
import { MessageSquare, Clock } from 'lucide-react';

interface ActivityTimelineProps {
  task: Task;
  onChange: (updates: Partial<Task>) => void;
}

export default function ActivityTimeline({ task, onChange }: ActivityTimelineProps) {
  const [commentText, setCommentText] = useState('');
  const activity = task.activity || [];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newActivity: ActivityLog = {
      id: Math.random().toString(36).substring(7),
      type: 'comment',
      content: commentText.trim(),
      timestamp: new Date().toISOString(),
    };

    onChange({ activity: [...activity, newActivity] });
    setCommentText('');
  };

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-800">Activity & Comments</h3>

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
          U
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Ask a question or post an update..."
            className="w-full text-sm border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </form>

      {/* Timeline */}
      <div className="space-y-4 pt-2">
        {activity.length === 0 ? (
          <div className="text-sm text-center py-4 text-slate-400">
            No activity yet.
          </div>
        ) : (
          [...activity].reverse().map(log => (
            <div key={log.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                {log.type === 'comment' ? (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-slate-900">
                    {log.type === 'comment' ? 'User Comment' : 'System Activity'}
                  </span>
                  <span className="text-xs text-slate-400">{getRelativeTime(log.timestamp)}</span>
                </div>
                {log.content && (
                  <p className="text-sm text-slate-600">{log.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ExternalLink, Trash2, Tag, Edit2 } from 'lucide-react';
import type { Bookmark } from '../types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
}

export function BookmarkCard({ bookmark, onDelete, onUpdateTags }: BookmarkCardProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const favicon = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=128`;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      onUpdateTags(bookmark.id, [...(bookmark.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(
      bookmark.id,
      (bookmark.tags || []).filter(tag => tag !== tagToRemove)
    );
  };

  const cardColor = bookmark.color || '#3B82F6';

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-4">
      <div className="absolute top-0 left-0 w-full h-1 rounded-t-lg" style={{ backgroundColor: cardColor }} />
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={favicon}
            alt={`${bookmark.title} favicon`}
            className="w-12 h-12 rounded-lg object-contain shadow-sm transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 truncate">{bookmark.title}</h3>
          <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {(bookmark.tags || []).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {isEditingTags && (
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="text-xs px-2 py-1 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingTags(!isEditingTags)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isEditingTags ? <Edit2 className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
          </button>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
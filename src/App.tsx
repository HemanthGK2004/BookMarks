import React, { useState, useEffect } from 'react';
import { Bookmark, Link, Layers } from 'lucide-react';
import type { Bookmark as BookmarkType } from './types';
import { BookmarkCard } from './components/BookmarkCard';
import { AddBookmark } from './components/AddBookmark';
import { SearchBar } from './components/SearchBar';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Social', 'Learning'];

const INITIAL_BOOKMARKS: BookmarkType[] = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'Work',
    tags: ['development', 'code'],
    color: '#2563eb',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'Learning',
    tags: ['programming', 'help'],
    color: '#f59e0b',
    createdAt: new Date(),
  },
];

function App() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const filteredAndSortedBookmarks = React.useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? bookmarks
      : bookmarks.filter(b => b.category === selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [bookmarks, selectedCategory, searchQuery, sortBy]);

  const handleAddBookmark = (newBookmark: Omit<BookmarkType, 'id' | 'createdAt'>) => {
    const bookmark: BookmarkType = {
      ...newBookmark,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setBookmarks(prev => [...prev, bookmark]);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleUpdateTags = (id: string, tags: string[]) => {
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, tags } : b))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">NexusLinks</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                  className="text-sm border-0 bg-transparent focus:ring-0"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">
                  {bookmarks.length} Bookmarks
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <AddBookmark onAdd={handleAddBookmark} categories={CATEGORIES} />

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-64">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-md transform -translate-y-1'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md transform -translate-y-1'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedBookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={handleDeleteBookmark}
                onUpdateTags={handleUpdateTags}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import { Category, ContentItem } from './types';
import { fetchKurdishContent } from './services/geminiService';

const STORAGE_KEY = 'kurdish_culture_data';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  
  // Initialize state from localStorage if available
  const [contentData, setContentData] = useState<Record<string, ContentItem[]>>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
    return {};
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage whenever contentData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentData));
  }, [contentData]);

  const handleCategorySelect = async (category: Category) => {
    setActiveCategory(category);
    setError(null);
    
    // Only load initial data if we don't have any for this category
    if (!contentData[category.id] || contentData[category.id].length === 0) {
      await loadMoreContent(category);
    }
  };

  const loadMoreContent = async (category: Category) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItems = await fetchKurdishContent(category.title);
      
      // Generate unique IDs for new items
      const itemsWithIds = newItems.map(item => ({
        ...item,
        id: Math.random().toString(36).substring(2, 11)
      }));

      setContentData(prev => ({
        ...prev,
        [category.id]: [...(prev[category.id] || []), ...itemsWithIds]
      }));
    } catch (err) {
      setError("هەڵەیەک ڕوویدا لە هێنانەی بابەتەکان. تکایە دڵنیابە لە هێڵی ئینتەرنێتەکەت و دووبارە هەوڵ بدەرەوە.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setContentData(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(item => item.id !== itemId)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-extrabold cursor-pointer flex items-center gap-2 tracking-wide"
            onClick={() => setActiveCategory(null)}
          >
            کەلتوری کوردی
          </h1>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              گەڕانەوە بۆ سەرەتا
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {!activeCategory ? (
          <HomePage onSelectCategory={handleCategorySelect} />
        ) : (
          <CategoryPage
            category={activeCategory}
            items={contentData[activeCategory.id] || []}
            isLoading={isLoading}
            error={error}
            onLoadMore={() => loadMoreContent(activeCategory)}
            onDeleteItem={(itemId) => handleDeleteItem(activeCategory.id, itemId)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-8 text-center mt-auto border-t border-slate-700">
        <p className="text-sm">
          پەرەپێدراوە بە ❤️ بۆ پاراستن و بڵاوکردنەوەی کەلتوری دەوڵەمەندی کوردی
        </p>
      </footer>
    </div>
  );
}
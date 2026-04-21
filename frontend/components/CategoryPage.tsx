import React, { useState } from 'react';
import { Category, ContentItem } from '../types';
import { Feather, Smile, HelpCircle, BookOpen, Quote, Gamepad2, Utensils, Loader2, Trash2, Link as LinkIcon, Languages, MapPin, MapPinned } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Feather, Smile, HelpCircle, BookOpen, Quote, Gamepad2, Utensils, Languages, MapPin
};

interface Props {
  category: Category;
  items: ContentItem[];
  isLoading: boolean;
  error: string | null;
  onLoadMore: () => void;
  onDeleteItem: (id: string) => void;
}

export default function CategoryPage({ category, items, isLoading, error, onLoadMore, onDeleteItem }: Props) {
  const IconComponent = iconMap[category.icon];
  const [expandedMaps, setExpandedMaps] = useState<Record<string, boolean>>({});

  const toggleMap = (id: string) => {
    setExpandedMaps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Dynamic classes based on category
  const isTourism = category.id === 'tourism';
  const containerMaxWidth = isTourism ? 'max-w-5xl' : 'max-w-3xl';
  const listLayoutClass = isTourism ? 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-10' : 'space-y-6 mb-10';

  return (
    <div className={`${containerMaxWidth} mx-auto animate-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200">
        <div className={`p-4 rounded-2xl ${category.iconClass}`}>
          {IconComponent && <IconComponent size={32} />}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">{category.title}</h2>
      </div>

      <div className={listLayoutClass}>
        {items.length === 0 && !isLoading && !error && (
          <div className="text-center text-slate-500 py-10 col-span-full">
            هیچ بابەتێک نییە. تکایە کرتە بکە بۆ هێنانەی بابەت.
          </div>
        )}
        
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group flex flex-col h-full"
          >
            <button
              onClick={() => onDeleteItem(item.id)}
              className="absolute top-4 left-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="سڕینەوەی ئەم بابەتە"
              aria-label="Delete item"
            >
              <Trash2 size={20} />
            </button>

            {item.title && (
              <h3 className="text-2xl font-bold mb-4 text-slate-800 border-b border-slate-50 pb-2 inline-block pl-10">
                {item.title}
              </h3>
            )}
            <p className="text-slate-700 leading-loose text-lg whitespace-pre-wrap flex-grow">
              {item.text}
            </p>

            {/* Tourist Places - Toggleable Map */}
            {isTourism && item.title && (
              <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6">
                <button
                  onClick={() => toggleMap(item.id)}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-3 rounded-xl transition-colors shadow-sm w-full sm:w-auto self-start"
                >
                  <MapPinned size={20} />
                  {expandedMaps[item.id] ? 'شاردنەوەی نەخشە' : 'پیشاندانی لەسەر نەخشە'}
                </button>

                {expandedMaps[item.id] && (
                  <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(item.title + ' Kurdistan')}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            {/* Source URLs - Only for Poetry and Proverbs */}
            {(category.id === 'poetry' || category.id === 'proverbs') && item.sourceUrls && item.sourceUrls.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
                  <LinkIcon size={16} />
                  سەرچاوەکان:
                </h4>
                <ul className="flex flex-wrap gap-2">
                  {item.sourceUrls.map((url, idx) => {
                    try {
                      const domain = new URL(url).hostname.replace('www.', '');
                      return (
                        <li key={idx}>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors inline-block max-w-[200px] truncate"
                            title={url}
                          >
                            {domain}
                          </a>
                        </li>
                      );
                    } catch (e) {
                      return null;
                    }
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl mb-8 text-center font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-center pb-10">
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all text-lg
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {isLoading && <Loader2 className="animate-spin" size={24} />}
          {isLoading ? 'چاوەڕێ بە...' : 'بابەتی نوێ بهێنە'}
        </button>
      </div>
    </div>
  );
}
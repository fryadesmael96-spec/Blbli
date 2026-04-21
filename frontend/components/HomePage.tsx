import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';
import { Feather, Smile, HelpCircle, BookOpen, Quote, Gamepad2, Utensils, Languages, MapPin } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Feather, Smile, HelpCircle, BookOpen, Quote, Gamepad2, Utensils, Languages, MapPin
};

interface Props {
  onSelectCategory: (category: Category) => void;
}

export default function HomePage({ onSelectCategory }: Props) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
        <h2 className="text-4xl font-extrabold text-slate-800 leading-tight">
          بەخێربێیت بۆ جیهانی <span className="text-emerald-600">کەلتوری کوردی</span>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          لێرە دەتوانیت ئاشنا بیت بە بەشە جیاوازەکانی فەرهەنگ و کەلتوری دەوڵەمەندی نەتەوەکەمان. بەشێک هەڵبژێرە بۆ دەستپێکردن.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon];
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border-2 bg-white ${cat.cardClass}`}
            >
              <div className={`p-5 rounded-full mb-5 ${cat.iconClass}`}>
                 {IconComponent && <IconComponent size={48} strokeWidth={1.5} />}
              </div>
              <h2 className="text-xl font-bold text-slate-800 text-center">{cat.title}</h2>
            </button>
          );
        })}
      </div>
    </div>
  );
}
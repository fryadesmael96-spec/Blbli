import { Category } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'poetry', 
    title: 'شعر', 
    icon: 'Feather', 
    cardClass: 'border-rose-200 hover:border-rose-400', 
    iconClass: 'bg-rose-100 text-rose-600' 
  },
  { 
    id: 'jokes', 
    title: 'نوکتە', 
    icon: 'Smile', 
    cardClass: 'border-amber-200 hover:border-amber-400', 
    iconClass: 'bg-amber-100 text-amber-600' 
  },
  { 
    id: 'riddles', 
    title: 'مەتەڵ', 
    icon: 'HelpCircle', 
    cardClass: 'border-purple-200 hover:border-purple-400', 
    iconClass: 'bg-purple-100 text-purple-600' 
  },
  { 
    id: 'stories', 
    title: 'چیرۆک', 
    icon: 'BookOpen', 
    cardClass: 'border-blue-200 hover:border-blue-400', 
    iconClass: 'bg-blue-100 text-blue-600' 
  },
  { 
    id: 'proverbs', 
    title: 'قسەی نەستەق و پەندی پێشینان', 
    icon: 'Quote', 
    cardClass: 'border-emerald-200 hover:border-emerald-400', 
    iconClass: 'bg-emerald-100 text-emerald-600' 
  },
  { 
    id: 'games', 
    title: 'یاریە کوردەواریەکان', 
    icon: 'Gamepad2', 
    cardClass: 'border-orange-200 hover:border-orange-400', 
    iconClass: 'bg-orange-100 text-orange-600' 
  },
  { 
    id: 'foods', 
    title: 'خواردنە کوردەواریەکان', 
    icon: 'Utensils', 
    cardClass: 'border-red-200 hover:border-red-400', 
    iconClass: 'bg-red-100 text-red-600' 
  },
  { 
    id: 'pure_kurdish', 
    title: 'کوردی پەتی', 
    icon: 'Languages', 
    cardClass: 'border-teal-200 hover:border-teal-400', 
    iconClass: 'bg-teal-100 text-teal-600' 
  },
  { 
    id: 'tourism', 
    title: 'شوێنە گەشتیاریەکان', 
    icon: 'MapPin', 
    cardClass: 'border-cyan-200 hover:border-cyan-400', 
    iconClass: 'bg-cyan-100 text-cyan-600' 
  },
];
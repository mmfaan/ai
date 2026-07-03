export interface SketchPoint {
  x: number;
  y: number;
  pen: 'down' | 'up' | 'end';
}

export interface Stroke {
  points: SketchPoint[];
}

export interface ModelConfig {
  name: string;
  nameAr: string;
  icon: string;
  modelUrl: string;
  description: string;
  color: string;
}

export interface GenerationResult {
  strokes: Stroke[];
  duration: number;
  modelName: string;
}

export interface TestResult {
  id: number;
  modelName: string;
  success: boolean;
  duration: number;
  timestamp: string;
  details: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    name: 'cat',
    nameAr: 'قطة',
    icon: '🐱',
    modelUrl: '/models/cat.gen.json',
    description: 'نموذج مدرب على رسم القطط بأسلوب خطوط بسيط',
    color: '#FF6B6B'
  },
  {
    name: 'dog',
    nameAr: 'كلب',
    icon: '🐕',
    modelUrl: '/models/dog.gen.json',
    description: 'نموذج مدرب على رسم الكلاب بأسلوب خطوط بسيط',
    color: '#4ECDC4'
  },
  {
    name: 'face',
    nameAr: 'وجه',
    icon: '👤',
    modelUrl: '/models/face.gen.json',
    description: 'نموذج مدرب على رسم الوجوه بأسلوب خطوط بسيط',
    color: '#45B7D1'
  },
  {
    name: 'flower',
    nameAr: 'زهرة',
    icon: '🌸',
    modelUrl: '/models/flower.gen.json',
    description: 'نموذج مدرب على رسم الزهور بأسلوب خطوط بسيط',
    color: '#F7DC6F'
  },
  {
    name: 'bird',
    nameAr: 'طائر',
    icon: '🐦',
    modelUrl: '/models/bird.gen.json',
    description: 'نموذج مدرب على رسم الطيور بأسلوب خطوط بسيط',
    color: '#BB8FCE'
  },
  {
    name: 'butterfly',
    nameAr: 'فراشة',
    icon: '🦋',
    modelUrl: '/models/butterfly.gen.json',
    description: 'نموذج مدرب على رسم الفراشات بأسلوب خطوط بسيط',
    color: '#F8C471'
  }
];

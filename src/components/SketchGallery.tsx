import { motion } from 'framer-motion';
import { useState } from 'react';
import { Download, Trash2, Image } from 'lucide-react';
import { Button } from './ui/button';

interface GalleryItem {
  id: string;
  imageData: string;
  modelName: string;
  modelNameAr: string;
  timestamp: string;
  strokeCount: number;
}

interface SketchGalleryProps {
  items: GalleryItem[];
  onClear: () => void;
}

export function SketchGallery({ items, onClear }: SketchGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  if (items.length === 0) return null;

  return (
    <motion.div
      className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Image className="w-6 h-6 text-purple-400" />
          معرض الرسومات
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-2 border-red-500/30 hover:bg-red-500/10 text-red-400"
        >
          <Trash2 className="w-4 h-4" />
          مسح الكل
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.imageData}
              alt={`رسمة ${item.modelNameAr}`}
              className="w-full aspect-square object-contain bg-slate-950"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-sm font-medium">{item.modelNameAr}</p>
                <p className="text-gray-400 text-xs">{item.strokeCount} خط</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.download = `sketch-${item.modelName}-${item.id}.png`;
                  link.href = item.imageData;
                  link.click();
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            className="relative max-w-3xl w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.imageData}
              alt={`رسمة ${selectedItem.modelNameAr}`}
              className="w-full rounded-xl border border-purple-500/30"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div>
                <p className="text-white font-bold text-lg">{selectedItem.modelNameAr}</p>
                <p className="text-gray-400 text-sm">{selectedItem.strokeCount} خط | {new Date(selectedItem.timestamp).toLocaleString('ar')}</p>
              </div>
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `sketch-${selectedItem.modelName}-${selectedItem.id}.png`;
                  link.href = selectedItem.imageData;
                  link.click();
                }}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-4 h-4" />
                تحميل
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

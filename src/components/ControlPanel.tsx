import { motion } from 'framer-motion';
import { Play, Square, Thermometer, Gauge, TestTube, Beaker } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { AVAILABLE_MODELS } from '../types/sketch';
import type { ModelConfig } from '../types/sketch';

interface ControlPanelProps {
  currentModel: ModelConfig | null;
  onModelSelect: (model: ModelConfig) => void;
  onGenerate: () => void;
  onAbort: () => void;
  onRunTests: (model: ModelConfig) => void;
  isLoading: boolean;
  isGenerating: boolean;
  isRunningTests: boolean;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  loadedModels: ModelConfig[];
}

export function ControlPanel({
  currentModel,
  onModelSelect,
  onGenerate,
  onAbort,
  onRunTests,
  isLoading,
  isGenerating,
  isRunningTests,
  temperature,
  onTemperatureChange,
  loadedModels
}: ControlPanelProps) {
  const handleModelSelect = (model: ModelConfig) => {
    onModelSelect(model);
  };

  const isModelLoaded = (model: ModelConfig) => {
    return loadedModels.some(m => m.name === model.name);
  };

  return (
    <motion.div
      className="flex flex-col gap-6 p-6 bg-slate-900/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Model Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-purple-400" />
          اختر النموذج
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_MODELS.map((model, index) => (
            <motion.button
              key={model.name}
              onClick={() => handleModelSelect(model)}
              className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-right ${
                currentModel?.name === model.name
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-purple-500/50 hover:bg-slate-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{model.icon}</span>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{model.nameAr}</div>
                  <div className="text-xs text-gray-400">{model.name}</div>
                </div>
                {isModelLoaded(model) && (
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Temperature Control */}
      {currentModel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-400" />
            درجة الإبداع
          </h3>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>محافظ</span>
              <span className="text-purple-400 font-bold">{temperature.toFixed(2)}</span>
              <span>مبدع</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={(v) => onTemperatureChange(v[0])}
              min={0.1}
              max={1.5}
              step={0.05}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              درجة حرارة أعلى = رسومات أكثر تنوعاً وإبداعاً
            </p>
          </div>
        </motion.div>
      )}

      {/* Generation Controls */}
      {currentModel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            التحكم في الإنشاء
          </h3>
          <div className="flex gap-2">
            {!isGenerating ? (
              <Button
                onClick={onGenerate}
                disabled={isLoading || isGenerating}
                className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                {isLoading ? 'جاري التحميل...' : 'إنشاء رسمة'}
              </Button>
            ) : (
              <Button
                onClick={onAbort}
                variant="destructive"
                className="flex-1 gap-2"
                size="lg"
              >
                <Square className="w-5 h-5" />
                إيقاف
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Test Controls */}
      {currentModel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TestTube className="w-5 h-5 text-green-400" />
            اختبار النموذج
          </h3>
          <Button
            onClick={() => onRunTests(currentModel)}
            disabled={isRunningTests || isGenerating}
            variant="outline"
            className="w-full gap-2 border-green-500/30 hover:bg-green-500/10 text-green-400"
            size="lg"
          >
            {isRunningTests ? (
              <motion.div
                className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <TestTube className="w-5 h-5" />
            )}
            {isRunningTests ? 'جاري الاختبار...' : 'اختبار 10 مرات'}
          </Button>
          <p className="text-xs text-gray-500">
            يختبر النموذج 10 مرات ويُظهر النتائج التفصيلية
          </p>
        </motion.div>
      )}

      {/* Model Info */}
      {currentModel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <h4 className="text-sm font-semibold text-white mb-2">معلومات النموذج</h4>
          <p className="text-sm text-gray-400">{currentModel.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentModel.color }} />
            <span className="text-xs text-gray-500">
              النموذج محمل {isModelLoaded(currentModel) ? '✓' : '⟳'}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

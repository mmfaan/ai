import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { SketchCanvas } from '../components/SketchCanvas';
import { ControlPanel } from '../components/ControlPanel';
import { TestResults } from '../components/TestResults';
import { ModelInfo } from '../components/ModelInfo';
import { SketchGallery } from '../components/SketchGallery';
import { Footer } from '../components/Footer';
import { useSketchRNN } from '../hooks/useSketchRNN';
import type { Stroke, ModelConfig } from '../types/sketch';
import { Alert, AlertDescription } from '../components/ui/alert';

interface GalleryItem {
  id: string;
  imageData: string;
  modelName: string;
  modelNameAr: string;
  timestamp: string;
  strokeCount: number;
}

export default function Home() {
  const {
    currentModel,
    isLoading,
    isGenerating,
    strokes,
    temperature,
    generationProgress,
    testResults,
    isRunningTests,
    models: loadedModels,
    loadModel,
    generateStrokes,
    clearStrokes,
    setTemperature,
    abortGeneration,
    runTests
  } = useSketchRNN();

  const [strokesState, setStrokesState] = useState<Stroke[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use either hook strokes or local strokes
  const displayStrokes = strokes.length > 0 ? strokes : strokesState;
  
  // Debug
  if (displayStrokes.length > 0) {
    const totalPoints = displayStrokes.reduce((a, s) => a + s.points.length, 0);
    console.log('displayStrokes:', displayStrokes.length, 'strokes,', totalPoints, 'points');
  }

  const handleModelSelect = useCallback(async (model: ModelConfig) => {
    setError(null);
    try {
      await loadModel(model);
      setSuccessMessage(`تم تحميل نموذج ${model.nameAr} بنجاح!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`فشل تحميل النموذج: ${err}`);
    }
  }, [loadModel]);

  const handleGenerate = useCallback(async () => {
    if (!currentModel) {
      setError('الرجاء اختيار نموذج أولاً');
      return;
    }

    setError(null);
    try {
      clearStrokes();
      setStrokesState([]);
      const generatedStrokes = await generateStrokes([]);
      
      // Add to gallery
      if (generatedStrokes.length > 0) {
        setTimeout(() => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const galleryItem: GalleryItem = {
              id: Date.now().toString(),
              imageData: canvas.toDataURL('image/png'),
              modelName: currentModel.name,
              modelNameAr: currentModel.nameAr,
              timestamp: new Date().toISOString(),
              strokeCount: generatedStrokes.length
            };
            setGallery(prev => [galleryItem, ...prev].slice(0, 50));
          }
        }, 100);
      }

      setSuccessMessage('تم إنشاء الرسمة بنجاح!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`فشل الإنشاء: ${err}`);
    }
  }, [currentModel, clearStrokes, generateStrokes]);

  const handleStrokesChange = useCallback((newStrokes: Stroke[]) => {
    setStrokesState(newStrokes);
  }, []);

  const handleRunTests = useCallback(async (model: ModelConfig) => {
    setError(null);
    try {
      await runTests(model);
    } catch (err) {
      setError(`فشل الاختبار: ${err}`);
    }
  }, [runTests]);

  const handleClearGallery = useCallback(() => {
    setGallery([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="border-red-500/30 bg-red-950/30">
                <AlertCircle className="w-5 h-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="border-green-500/30 bg-green-950/30 text-green-400">
                <Sparkles className="w-5 h-5" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <SketchCanvas
              strokes={displayStrokes}
              onStrokesChange={handleStrokesChange}
              isGenerating={isGenerating}
              progress={generationProgress}
            />
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              currentModel={currentModel}
              onModelSelect={handleModelSelect}
              onGenerate={handleGenerate}
              onAbort={abortGeneration}
              onRunTests={handleRunTests}
              isLoading={isLoading}
              isGenerating={isGenerating}
              isRunningTests={isRunningTests}
              temperature={temperature}
              onTemperatureChange={setTemperature}
              loadedModels={loadedModels}
            />
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && <TestResults results={testResults} />}

        {/* Gallery */}
        <SketchGallery items={gallery} onClear={handleClearGallery} />

        {/* Model Info */}
        <ModelInfo />
      </main>

      <Footer />
    </div>
  );
}

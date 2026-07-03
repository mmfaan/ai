import { useState, useCallback, useRef } from 'react';
import * as ms from '@magenta/sketch';
import type { ModelConfig, Stroke, SketchPoint, TestResult } from '../types/sketch';

interface ModelState {
  model: any;
  config: ModelConfig;
  isLoaded: boolean;
}

export function useSketchRNN() {
  const [models, setModels] = useState<Map<string, ModelState>>(new Map());
  const [currentModel, setCurrentModel] = useState<ModelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [temperature, setTemperature] = useState(0.6);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadModel = useCallback(async (config: ModelConfig) => {
    if (models.has(config.name)) {
      setCurrentModel(config);
      return;
    }

    setIsLoading(true);
    try {
      const model = new ms.SketchRNN(config.modelUrl);
      await model.initialize();
      
      const modelState: ModelState = {
        model,
        config,
        isLoaded: true
      };
      
      setModels(prev => new Map(prev).set(config.name, modelState));
      setCurrentModel(config);
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [models]);

  const generateStrokes = useCallback(async (seedStrokes?: Stroke[]): Promise<Stroke[]> => {
    if (!currentModel) {
      throw new Error('No model selected');
    }

    const modelState = models.get(currentModel.name);
    if (!modelState || !modelState.isLoaded) {
      throw new Error('Model not loaded');
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      const model = modelState.model;
      
      // Reset model state
      model.setPixelFactor(2.0);
      
      // Initialize state
      let state = model.zeroState();
      
      // If we have seed strokes, process them first
      if (seedStrokes && seedStrokes.length > 0) {
        for (const stroke of seedStrokes) {
          for (let i = 0; i < stroke.points.length - 1; i++) {
            const p1 = stroke.points[i];
            const p2 = stroke.points[i + 1];
            const strokeInput = [
              p2.x - p1.x,
              p2.y - p1.y,
              p1.pen === 'down' ? 1 : 0,
              p1.pen === 'up' ? 1 : 0,
              p1.pen === 'end' ? 1 : 0
            ];
            state = model.update(strokeInput, state);
          }
        }
      }

      const generatedStrokes: Stroke[] = [];
      const maxSteps = 200; // Increased max steps
      let currentStroke: SketchPoint[] = [];
      let prevX = 0;
      let prevY = 0;

      for (let i = 0; i < maxSteps; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        // Get PDF from current state
        const pdf = model.getPDF(state, temperature);
        
        // Sample next stroke
        const stroke = model.sample(pdf);
        
        const [dx, dy, _penDown, penUp, penEnd] = stroke;
        
        prevX += dx;
        prevY += dy;

        const penState = penEnd > 0.5 ? 'end' : penUp > 0.5 ? 'up' : 'down';
        
        currentStroke.push({
          x: prevX,
          y: prevY,
          pen: penState
        });

        if (penUp > 0.5 || penEnd > 0.5) {
          if (currentStroke.length > 1) {
            generatedStrokes.push({ points: [...currentStroke] });
          }
          currentStroke = [];
        }

        if (penEnd > 0.5) {
          break;
        }

        // Update state with this stroke
        state = model.update(stroke, state);

        setGenerationProgress(Math.round((i / maxSteps) * 100));
      }

      if (currentStroke.length > 1) {
        generatedStrokes.push({ points: currentStroke });
      }

      console.log('Generated', generatedStrokes.length, 'strokes with', generatedStrokes.reduce((a, s) => a + s.points.length, 0), 'points');
      if (generatedStrokes.length > 0) {
        const allPoints = generatedStrokes.flatMap(s => s.points);
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of allPoints) {
          minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
        }
        console.log('Bounds:', {minX: Math.round(minX), maxX: Math.round(maxX), minY: Math.round(minY), maxY: Math.round(maxY)});
      }

      setStrokes(generatedStrokes);
      setGenerationProgress(100);
      
      return generatedStrokes;
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [currentModel, models, temperature]);

  const clearStrokes = useCallback(() => {
    setStrokes([]);
    setGenerationProgress(0);
  }, []);

  const addStroke = useCallback((stroke: Stroke) => {
    setStrokes(prev => [...prev, stroke]);
  }, []);

  const abortGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
    setGenerationProgress(0);
  }, []);

  const runTests = useCallback(async (config: ModelConfig) => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    // Load model if not loaded
    let modelState = models.get(config.name);
    if (!modelState) {
      try {
        await loadModel(config);
        modelState = models.get(config.name);
      } catch (error) {
        results.push({
          id: 0,
          modelName: config.nameAr,
          success: false,
          duration: 0,
          timestamp: new Date().toISOString(),
          details: `فشل تحميل النموذج: ${error}`
        });
        setTestResults(results);
        setIsRunningTests(false);
        return results;
      }
    }

    if (!modelState || !modelState.isLoaded) {
      setIsRunningTests(false);
      return results;
    }

    // Run 10 tests
    for (let i = 1; i <= 10; i++) {
      const testStart = performance.now();
      try {
        const model = modelState.model;
        model.setPixelFactor(2.0);
        
        let state = model.zeroState();
        let strokeCount = 0;
        const temp = 0.6 + (i * 0.02);

        for (let step = 0; step < 80; step++) {
          const pdf = model.getPDF(state, temp);
          const stroke = model.sample(pdf);
          const [, , , , penEnd] = stroke;
          
          if (Math.abs(stroke[0]) > 0.1 || Math.abs(stroke[1]) > 0.1) strokeCount++;
          
          state = model.update(stroke, state);
          
          if (penEnd > 0.5) break;
        }

        const testDuration = performance.now() - testStart;
        results.push({
          id: i,
          modelName: config.nameAr,
          success: strokeCount > 5,
          duration: Math.round(testDuration),
          timestamp: new Date().toISOString(),
          details: `تم إنشاء ${strokeCount} نقطة رسم في ${Math.round(testDuration)}ms`
        });
      } catch (error) {
        const testDuration = performance.now() - testStart;
        results.push({
          id: i,
          modelName: config.nameAr,
          success: false,
          duration: Math.round(testDuration),
          timestamp: new Date().toISOString(),
          details: `خطأ: ${error}`
        });
      }
    }

    setTestResults(results);
    setIsRunningTests(false);
    return results;
  }, [models, loadModel]);

  return {
    currentModel,
    isLoading,
    isGenerating,
    strokes,
    temperature,
    generationProgress,
    testResults,
    isRunningTests,
    models: Array.from(models.values()).map(m => m.config),
    loadModel,
    generateStrokes,
    clearStrokes,
    addStroke,
    setTemperature,
    abortGeneration,
    runTests
  };
}

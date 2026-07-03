import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Stroke, SketchPoint } from '../types/sketch';
import { Download, Eraser, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

interface SketchCanvasProps {
  strokes: Stroke[];
  onStrokesChange?: (strokes: Stroke[]) => void;
  isGenerating?: boolean;
  progress?: number;
}

export function SketchCanvas({ strokes, onStrokesChange, isGenerating, progress = 0 }: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<SketchPoint[]>([]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;

  // Normalize strokes to fit in canvas
  const normalizeStrokes = useCallback((inputStrokes: Stroke[]): Stroke[] => {
    if (inputStrokes.length === 0) return [];

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let hasValidPoints = false;
    
    for (const stroke of inputStrokes) {
      for (const point of stroke.points) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
        hasValidPoints = true;
      }
    }

    if (!hasValidPoints) return inputStrokes;

    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const padding = 50;
    const scaleX = (CANVAS_WIDTH - padding * 2) / width;
    const scaleY = (CANVAS_HEIGHT - padding * 2) / height;
    const uniformScale = Math.min(scaleX, scaleY, 10); // Cap scale at 10

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return inputStrokes.map(stroke => ({
      points: stroke.points.map(p => ({
        x: (p.x - centerX) * uniformScale + CANVAS_WIDTH / 2,
        y: (p.y - centerY) * uniformScale + CANVAS_HEIGHT / 2,
        pen: p.pen
      }))
    }));
  }, []);

  const drawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    const normalizedStrokes = normalizeStrokes(strokes);

    // Draw strokes with glow effect
    for (let s = 0; s < normalizedStrokes.length; s++) {
      const stroke = normalizedStrokes[s];
      if (stroke.points.length < 2) continue;

      // Glow effect
      ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      
      let firstPoint = true;
      for (let i = 0; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        
        if (point.pen === 'up') {
          firstPoint = true;
          continue;
        }
        
        if (firstPoint) {
          ctx.moveTo(point.x, point.y);
          firstPoint = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
        
        if (point.pen === 'end') break;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw points
      ctx.fillStyle = '#e9d5ff';
      for (const point of stroke.points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw current stroke
    if (currentStroke.length > 1) {
      ctx.shadowColor = 'rgba(236, 72, 153, 0.6)';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // Draw generation progress
    if (isGenerating) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30);
      
      const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#ec4899');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, CANVAS_HEIGHT - 30, (progress / 100) * CANVAS_WIDTH, 30);
      
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`جاري الإنشاء... ${progress}%`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10);
    }

    // Draw stroke count
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`الخطوط: ${strokes.length} | النقاط: ${strokes.reduce((acc, s) => acc + s.points.length, 0)}`, 10, 20);
  }, [strokes, currentStroke, scale, offset, isGenerating, progress, normalizeStrokes]);

  useEffect(() => {
    drawStrokes();
  }, [drawStrokes]);

  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>): SketchPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pen: 'down' };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pen: 'down'
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || e.button === 2) {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }
    
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setCurrentStroke([point]);
  }, [getCanvasPoint]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isDrawing) return;
    
    const point = getCanvasPoint(e);
    setCurrentStroke(prev => [...prev, point]);
  }, [isDrawing, getCanvasPoint]);

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        points: [...currentStroke, { ...currentStroke[currentStroke.length - 1], pen: 'end' as const }]
      };
      onStrokesChange?.([...strokes, newStroke]);
    }
    setCurrentStroke([]);
  }, [isDrawing, currentStroke, strokes, onStrokesChange]);

  const handleExport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `ai-sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const handleClear = useCallback(() => {
    onStrokesChange?.([]);
    setCurrentStroke([]);
  }, [onStrokesChange]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.3));
  }, []);

  const handleResetView = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      className="relative flex flex-col items-center gap-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/30 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="cursor-crosshair block"
          style={{ width: '100%', maxWidth: 600, height: 'auto' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {isGenerating && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="gap-2 border-purple-500/30 hover:bg-purple-500/10"
        >
          <ZoomIn className="w-4 h-4" />
          تكبير
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="gap-2 border-purple-500/30 hover:bg-purple-500/10"
        >
          <ZoomOut className="w-4 h-4" />
          تصغير
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="gap-2 border-purple-500/30 hover:bg-purple-500/10"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة ضبط
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="gap-2 border-red-500/30 hover:bg-red-500/10 text-red-400"
        >
          <Eraser className="w-4 h-4" />
          مسح
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2 border-green-500/30 hover:bg-green-500/10 text-green-400"
          disabled={strokes.length === 0}
        >
          <Download className="w-4 h-4" />
          تصدير PNG
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        اضغط بالماوس للرسم | زر الماوس الأوسط للتحريك | عجلة الماوس للتكبير
      </div>
    </motion.div>
  );
}

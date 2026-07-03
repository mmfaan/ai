import { motion } from 'framer-motion';
import { Heart, Code, Cpu, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      className="mt-12 py-8 px-6 bg-slate-900/80 border-t border-purple-500/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left - Developer Info */}
          <motion.div
            className="text-center md:text-right"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
              <Code className="w-5 h-5 text-purple-400" />
              <span className="text-white font-bold text-lg">المطور</span>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              محمد محسن فالح
            </p>
            <p className="text-gray-500 text-sm mt-1">
              مطور ومصمم نماذج الذكاء الاصطناعي
            </p>
          </motion.div>

          {/* Center - Tech Stack */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">TensorFlow.js</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Sketch-RNN</span>
            </div>
          </motion.div>

          {/* Right - Credits */}
          <motion.div
            className="text-center md:text-left"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-gray-400 text-sm">بنّي بـ</span>
            </div>
            <p className="text-gray-500 text-sm">
              React + TypeScript + Tailwind CSS
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Google Magenta Project | QuickDraw Dataset
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-8 pt-4 border-t border-slate-800 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-gray-600 text-sm">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - محمد محسن فالح
          </p>
          <p className="text-gray-700 text-xs mt-1">
            نموذج ذكاء اصطناعي حقيقي يعمل محلياً على المتصفح | لا يحتاج اتصال إنترنت بعد التحميل
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}

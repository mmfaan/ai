import { motion } from 'framer-motion';
import { Brain, Sparkles, Cpu, Activity } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-6"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: 0
            }}
            animate={{
              y: [null, '-100%'],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.div
          className="flex justify-center items-center gap-3 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <div className="relative">
            <Brain className="w-16 h-16 text-purple-400" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          فنان الرسم الذكي
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          نموذج ذكاء اصطناعي حقيقي يعمل محلياً على معالجك | Sketch-RNN
        </motion.p>

        <motion.div
          className="flex justify-center gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Cpu className="w-4 h-4 text-green-400" />
            <span className="text-sm">يعمل على CPU</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm">نموذج حقيقي من Google</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">مدرب على QuickDraw</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 inline-block bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 px-6 py-3 rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-lg font-semibold">
            المطور: <span className="text-purple-300">محمد محسن فالح</span>
          </p>
        </motion.div>
      </div>
    </motion.header>
  );
}

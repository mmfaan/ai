import { motion, AnimatePresence } from 'framer-motion';
import type { TestResult } from '../types/sketch';
import { CheckCircle, XCircle, Clock, BarChart3, TrendingUp, Activity } from 'lucide-react';

interface TestResultsProps {
  results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
  if (results.length === 0) return null;

  const successCount = results.filter(r => r.success).length;
  const avgDuration = Math.round(results.reduce((acc, r) => acc + r.duration, 0) / results.length);
  const successRate = Math.round((successCount / results.length) * 100);

  return (
    <motion.div
      className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        نتائج الاختبار
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{successRate}%</div>
          <div className="text-sm text-gray-400">نسبة النجاح</div>
        </motion.div>

        <motion.div
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{avgDuration}ms</div>
          <div className="text-sm text-gray-400">متوسط السرعة</div>
        </motion.div>

        <motion.div
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{successCount}/{results.length}</div>
          <div className="text-sm text-gray-400">الاختبارات الناجحة</div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>التقدم</span>
          <span>{results.length}/10</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(results.length / 10) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-2 px-3 text-sm text-gray-400">#</th>
              <th className="py-2 px-3 text-sm text-gray-400">النموذج</th>
              <th className="py-2 px-3 text-sm text-gray-400">الحالة</th>
              <th className="py-2 px-3 text-sm text-gray-400">السرعة</th>
              <th className="py-2 px-3 text-sm text-gray-400">التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {results.map((result, index) => (
                <motion.tr
                  key={result.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="py-2 px-3 text-white font-mono">{result.id}</td>
                  <td className="py-2 px-3 text-white">{result.modelName}</td>
                  <td className="py-2 px-3">
                    {result.success ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        ناجح
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-4 h-4" />
                        فاشل
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-gray-300 font-mono">{result.duration}ms</td>
                  <td className="py-2 px-3 text-gray-400 text-sm">{result.details}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

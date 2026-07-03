import { motion } from 'framer-motion';
import { 
  Brain, 
  Layers, 
  Database, 
  Cpu, 
  Code2, 
  GitBranch,
  Network,
  Zap,
  BookOpen,
  Award,
  ExternalLink,
  FileCode
} from 'lucide-react';
import { useState } from 'react';

export function ModelInfo() {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'training'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: BookOpen },
    { id: 'technical' as const, label: 'تفاصيل تقنية', icon: Code2 },
    { id: 'training' as const, label: 'التدريب', icon: Database },
  ];

  return (
    <motion.div
      className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Brain className="w-7 h-7 text-purple-400" />
        معلومات النموذج الذكي
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={<Brain className="w-6 h-6 text-purple-400" />}
                title="نوع النموذج"
                description="Sketch-RNN (Recurrent Neural Network) - شبكة عصبية تكرارية متخصصة في توليد الرسومات الخطية"
              />
              <InfoCard
                icon={<Layers className="w-6 h-6 text-blue-400" />}
                title="البنية المعمارية"
                description="Variational Autoencoder (VAE) مع طبقات LSTM للترميز والفك - 256 خلية مخفية"
              />
              <InfoCard
                icon={<Database className="w-6 h-6 text-green-400" />}
                title="البيانات التدريبية"
                description="50 مليون رسمة من Google QuickDraw Dataset - بيانات مفتوحة المصدر"
              />
              <InfoCard
                icon={<Cpu className="w-6 h-6 text-cyan-400" />}
                title="طريقة التشغيل"
                description="يعمل محلياً على المتصفح باستخدام TensorFlow.js - لا يحتاج خادم خارجي"
              />
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                كيف يعمل؟
              </h4>
              <p className="text-gray-300 leading-relaxed">
                يستخدم النموذج شبكة عصبية تكرارية (RNN) لفهم أنماط الرسم البشري. 
                عند إنشاء رسمة جديدة، يبدأ النموذج من حالة عشوائية ويتنبأ بالخطوط التالية 
                واحدة تلو الأخرى، مما يخلق رسومات فريدة تشبه أسلوب رسم الأطفال.
                يمكن للنموذج أيضاً إكمال رسمة بدأها المستخدم.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'technical' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 font-mono text-sm">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2 font-sans">
                <Network className="w-5 h-5 text-purple-400" />
                بنية الشبكة العصبية
              </h4>
              <pre className="text-green-400 overflow-x-auto">
{`SketchRNN Architecture:
├── Encoder (LSTM):
│   ├── Input: Stroke sequences [dx, dy, p1, p2, p3]
│   ├── LSTM Layer: 256 units
│   ├── Latent Space: 128 dimensions (μ, σ)
│   └── Reparameterization trick
│
├── Decoder (LSTM):
│   ├── Latent Vector → Initial State
│   ├── LSTM Layer: 512 units
│   ├── Mixture Density Network (MDN)
│   └── Output: Gaussian mixture parameters
│
└── Hyperparameters:
    ├── Learning Rate: 0.001
    ├── Batch Size: 100
    ├── Max Seq Length: 200
    └── Temperature: 0.1 - 1.5`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={<FileCode className="w-6 h-6 text-orange-400" />}
                title="تنسيق المدخلات"
                description="متجهات من 5 أبعاد: [Δx, Δy, pen_down, pen_up, pen_end] تمثل حركة القلم"
              />
              <InfoCard
                icon={<GitBranch className="w-6 h-6 text-pink-400" />}
                title="خوارزمية التوليد"
                description="Mixture Density Networks (MDN) مع 20 Gaussian mixture components"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'training' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<Database className="w-6 h-6 text-blue-400" />}
                value="50M+"
                label="رسومات تدريب"
              />
              <StatCard
                icon={<Users className="w-6 h-6 text-green-400" />}
                value="15M+"
                label="مشارك في التدريب"
              />
              <StatCard
                icon={<Award className="w-6 h-6 text-yellow-400" />}
                value="345"
                label="فئة رسم"
              />
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                مصادر البيانات المفتوحة
              </h4>
              <ul className="space-y-2">
                <SourceLink
                  title="Google Quick Draw Dataset"
                  url="https://github.com/googlecreativelab/quickdraw-dataset"
                  description="50 مليون رسمة جمعها لعب Quick, Draw!"
                />
                <SourceLink
                  title="Magenta Sketch RNN"
                  url="https://github.com/tensorflow/magenta-js"
                  description="مكتبة Magenta لـ TensorFlow.js"
                />
                <SourceLink
                  title="TensorFlow.js"
                  url="https://www.tensorflow.org/js"
                  description="إطار عمل التعلم العميق للمتصفحات"
                />
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Developer Credit */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20 text-center"
        whileHover={{ scale: 1.01 }}
      >
        <p className="text-gray-300">
          تم تطوير هذا التطبيق بواسطة{' '}
          <span className="text-purple-400 font-bold text-lg">محمد محسن فالح</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          نموذج Sketch-RNN من Google Magenta Project
        </p>
      </motion.div>
    </motion.div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/30 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-white font-semibold">{title}</h4>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function SourceLink({ title, url, description }: { title: string; url: string; description: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors group"
    >
      <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-purple-400 mt-0.5 shrink-0" />
      <div>
        <div className="text-white font-medium group-hover:text-purple-300 transition-colors">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </a>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

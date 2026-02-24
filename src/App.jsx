import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  ChevronDown,
  Check,
  RefreshCw,
  Play,
  X,
} from "lucide-react";

const SAMPLES = [
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
];

const STYLE_TAGS = ["Cyberpunk", "Pixar", "Cinematic", "Anime", "Drone Shot"];

const LOG_MESSAGES = [
  "Connecting to AI Cluster...",
  "Uploading assets to S3 storage...",
  "Neural synthesis in progress...",
  "Upscaling to 4K resolution...",
];

const smartExpandPrompt = (input) => {
  if (!input)
    return "Breathtaking majestic landscape, golden hour, 8k resolution, cinematic lighting";
  const text = input.toLowerCase();
  const adjectives = [
    "Ethereal",
    "Hyper-realistic",
    "Atmospheric",
    "Vibrant",
    "Surreal",
    "Cinematic",
  ];
  const lighting = [
    "volumetric lighting",
    "neon glow",
    "soft bokeh",
    "dramatic shadows",
  ];
  const camera = [
    "captured on 35mm lens",
    "shot with IMAX camera",
    "macro photography",
    "aerial view",
  ];
  let context = "masterpiece, 8k, highly detailed, trending on artstation";

  if (
    text.includes("nature") ||
    text.includes("ocean") ||
    text.includes("bird")
  )
    context = "National Geographic style, wildlife documentary footage";
  if (text.includes("city") || text.includes("neon") || text.includes("cyber"))
    context = "Blade Runner 2049 aesthetic, cyberpunk atmosphere";

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return `${rand(adjectives)} ${input}, ${rand(lighting)}, ${rand(
    camera
  )}, ${context}`;
};

const SmartSelect = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 relative" ref={ref}>
      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold flex justify-between items-center hover:bg-slate-100 transition-all shadow-sm"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={12}
          className={`flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-[100]"
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="p-3 text-[11px] font-bold hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 last:border-0"
              >
                {opt}
                {value === opt && (
                  <Check size={12} className="text-indigo-600" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HailuoProductionReadyWidget() {
  const [status, setStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("text");
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentSample, setCurrentSample] = useState(0);
  const [logs, setLogs] = useState([]);

  const [settings, setSettings] = useState({
    model: "Hailuo 2.3 Turbo",
    quality: "Full HD",
    duration: "5s",
    ratio: "16:9",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const handleEnhance = async () => {
    if (!prompt || isEnhancing) return;
    setIsEnhancing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPrompt(smartExpandPrompt(prompt));
    setIsEnhancing(false);
  };

  const startGeneration = () => {
    if (activeTab === "text" && !prompt) return;
    if (activeTab === "image" && !uploadedImage) return;
    setStatus("loading");
    setProgress(0);
    setLogs([LOG_MESSAGES[0]]);
  };

  useEffect(() => {
    let interval;
    if (status === "loading") {
      interval = setInterval(() => {
        setProgress((old) => {
          const next = old + 2;
          if (next === 20) setLogs((prev) => [...prev, LOG_MESSAGES[1]]);
          if (next === 50) setLogs((prev) => [...prev, LOG_MESSAGES[2]]);
          if (next === 80) setLogs((prev) => [...prev, LOG_MESSAGES[3]]);
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setStatus("result"), 500);
            return 100;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-4 md:p-8 flex items-center justify-center font-sans text-slate-900 overflow-hidden">
      {/* GLOW EFFECT */}
      <div className="relative group max-w-6xl w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[44px] blur opacity-25 group-hover:opacity-45 transition duration-1000 animate-pulse"></div>

        <div className="relative bg-white rounded-[44px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[760px] border border-white">
          {/* LEFT PANEL */}
          <div className="p-10 flex flex-col border-r border-slate-50 bg-white relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#6366f1] rounded-2xl flex items-center justify-center text-white shadow-lg font-bold italic text-xl">
                H
              </div>
              <span className="font-black tracking-tighter text-2xl">
                Hailuo AI
              </span>
            </div>

            <div className="flex gap-1 mb-6 p-1.5 bg-slate-100 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("text")}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                  activeTab === "text"
                    ? "bg-white shadow-sm text-[#6366f1]"
                    : "text-slate-400"
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setActiveTab("image")}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                  activeTab === "image"
                    ? "bg-white shadow-sm text-[#6366f1]"
                    : "text-slate-400"
                }`}
              >
                Image
              </button>
            </div>

            <div className="mb-6 flex-grow">
              <div className="flex justify-between items-center mb-3 min-h-[20px]">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  {activeTab === "text" ? "Prompt" : "Source Image"}
                </label>

                <AnimatePresence>
                  {activeTab === "text" && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex gap-2"
                    >
                      {STYLE_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            setPrompt((prev) => prev + (prev ? ", " : "") + tag)
                          }
                          className="text-[9px] font-bold text-indigo-400 hover:text-indigo-600 transition-colors uppercase tracking-tighter border-b border-indigo-100"
                        >
                          #{tag}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {activeTab === "text" ? (
                <div className="relative h-44 animate-fadeIn">
                  <textarea
                    className="w-full h-full p-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm resize-none focus:ring-4 ring-indigo-50/50 outline-none transition-all placeholder:text-slate-300 shadow-inner leading-relaxed"
                    placeholder="Describe your vision..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className={`absolute bottom-4 right-4 w-11 h-11 bg-white border border-slate-100 rounded-2xl shadow-md flex items-center justify-center transition-all ${
                      isEnhancing
                        ? "animate-spin opacity-50"
                        : "hover:scale-110 text-indigo-600 active:scale-95"
                    }`}
                  >
                    <Sparkles size={18} />
                  </button>
                </div>
              ) : (
                <div className="h-44 relative animate-fadeIn">
                  <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50 overflow-hidden group">
                    {uploadedImage ? (
                      <div className="w-full h-full relative">
                        <img
                          src={uploadedImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-xl hover:bg-black transition-all backdrop-blur-md"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/30 transition-colors">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-500 mb-2 border border-slate-100 group-hover:scale-110 transition-transform">
                          <Upload size={20} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4 leading-relaxed">
                          Click to Upload Image
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-8">
              <SmartSelect
                label="Model"
                options={["Hailuo 2.3 Turbo", "V4 Pro"]}
                value={settings.model}
                onChange={(v) => setSettings({ ...settings, model: v })}
              />
              <SmartSelect
                label="Quality"
                options={["HD", "Full HD", "4K"]}
                value={settings.quality}
                onChange={(v) => setSettings({ ...settings, quality: v })}
              />
              <SmartSelect
                label="Duration"
                options={["5s", "10s", "15s"]}
                value={settings.duration}
                onChange={(v) => setSettings({ ...settings, duration: v })}
              />
              <SmartSelect
                label="Ratio"
                options={["16:9", "9:16", "1:1"]}
                value={settings.ratio}
                onChange={(v) => setSettings({ ...settings, ratio: v })}
              />
            </div>

            <button
              onClick={startGeneration}
              disabled={status === "loading"}
              className="w-full py-5 bg-[#6366f1] text-white rounded-[24px] font-black shadow-2xl shadow-indigo-100 active:scale-[0.97] disabled:opacity-50 uppercase tracking-[0.2em] text-[10px]"
            >
              {status === "loading"
                ? `Generating ${progress}%`
                : "Generate Magic Video"}
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-slate-950 flex flex-col h-full relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key={`idle-${currentSample}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full relative bg-slate-950"
                >
                  <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/40 backdrop-blur-xl px-5 py-2 rounded-full border border-white/20 shadow-xl tracking-[0.2em]">
                      Showcase
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSample((s) => (s - 1 + 2) % 2);
                        }}
                        className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90 text-xs"
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSample((s) => (s + 1) % 2);
                        }}
                        className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90 text-xs"
                      >
                        →
                      </button>
                    </div>
                  </div>
                  <video
                    key={SAMPLES[currentSample]}
                    src={SAMPLES[currentSample]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 pointer-events-none" />
                </motion.div>
              )}

              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12 bg-white"
                >
                  <div className="relative w-32 h-32 mb-12">
                    <div className="absolute inset-0 border-[6px] border-slate-50 rounded-full"></div>
                    <div className="absolute inset-0 border-[6px] border-[#6366f1] rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800 tracking-tighter">
                      {progress}%
                    </div>
                  </div>
                  <div className="w-full max-w-[320px] bg-slate-50 rounded-[32px] p-8 font-mono text-[10px] text-slate-400 space-y-3 border border-slate-100 shadow-inner">
                    {logs.map((log, i) => (
                      <div key={i} className="animate-fadeIn tracking-wider">
                        {" "}
                        {`> ${log}`}
                      </div>
                    ))}
                    <div className="animate-pulse">_</div>
                  </div>
                </motion.div>
              )}

              {status === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full relative bg-slate-900"
                >
                  <video
                    src={SAMPLES[0]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover blur-xl brightness-[0.3]"
                  />
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center z-50">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col items-center w-full max-w-sm"
                    >
                      <div className="bg-[#6366f1] px-6 py-2 rounded-full text-[10px] text-white font-black uppercase tracking-[0.2em] mb-8 shadow-2xl inline-flex items-center gap-2 border border-white/20">
                        <Check size={14} /> Ready for Export
                      </div>
                      <h3 className="text-white text-4xl font-black mb-4 tracking-tighter uppercase leading-none text-center">
                        Video Created
                      </h3>
                      <p className="text-white/80 text-xs mb-10 leading-relaxed text-center">
                        Your high-definition export is ready. Register to
                        Overchat AI to remove the watermark and save in 4K.
                      </p>

                      {}
                      <div className="w-full">
                        <a
                          href="https://overchat.ai/web"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-[#6366f1] text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#5558e3] transition-all shadow-xl text-lg px-8"
                        >
                          Open Web App
                        </a>
                      </div>

                      <button
                        onClick={() => setStatus("idle")}
                        className="mt-8 text-white/30 text-[10px] font-bold hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
                      >
                        <RefreshCw size={12} /> Create Another
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

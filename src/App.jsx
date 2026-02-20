import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

const SAMPLES = [
  "https://cdn.pixabay.com/video/2024/05/26/213757_tiny.mp4",
  "https://cdn.pixabay.com/video/2023/11/03/187654_tiny.mp4",
  "https://cdn.pixabay.com/video/2021/09/07/87742_tiny.mp4",
];

const LOG_MESSAGES = [
  "Initializing Hailuo 2.3 Turbo engine...",
  "Analyzing prompt semantics...",
  "Synthesizing motion vectors...",
  "Applying neural upscaling...",
  "Optimizing 4K video buffer...",
  "Finalizing render...",
];

const TAGS = ["Cyberpunk", "Pixar Style", "Cinematic", "Drone Shot"];

// --- UI COMPONENTS ---

const CustomSelect = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex-1 relative">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold cursor-pointer hover:bg-slate-100 transition-all flex justify-between items-center"
      >
        {value}{" "}
        <span className="text-[10px] opacity-30">{isOpen ? "▲" : "▼"}</span>
      </div>
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
                className="p-4 text-[11px] font-bold hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors border-b border-slate-50 last:border-0 uppercase tracking-wider"
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HailuoVibeWidget() {
  const [status, setStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("text");
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [currentSample, setCurrentSample] = useState(0);
  const [logs, setLogs] = useState([]);

  const [model, setModel] = useState("Hailuo 2.3 Turbo");
  const [ratio, setRatio] = useState("16:9");
  const [quality, setQuality] = useState("Full HD");
  const [duration, setDuration] = useState("5s");

  // --- FUNCTIONS ---
  const nextSample = () =>
    setCurrentSample((prev) => (prev + 1) % SAMPLES.length);
  const prevSample = () =>
    setCurrentSample((prev) => (prev - 1 + SAMPLES.length) % SAMPLES.length);

  // --- 3D TILT EFFECT LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- GENERATION LOGIC ---
  const startGen = () => {
    if (activeTab === "text" && !prompt) return;
    setStatus("loading");
    setProgress(0);
    setLogs([LOG_MESSAGES[0]]);
  };

  useEffect(() => {
    if (status === "loading") {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStatus("result"), 500);
            return 100;
          }
          const logIdx = Math.floor((p / 100) * LOG_MESSAGES.length);
          if (LOG_MESSAGES[logIdx] && !logs.includes(LOG_MESSAGES[logIdx])) {
            setLogs((prev) => [...prev, LOG_MESSAGES[logIdx]]);
          }
          return p + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status, logs]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 flex items-center justify-center font-sans text-slate-900 overflow-hidden">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group max-w-6xl w-full"
      >
        {/* Neon Aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-[48px] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>

        <div className="relative bg-white rounded-[44px] shadow-[0_50px_100px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[760px] border border-white">
          {/* LEFT PANEL */}
          <div
            className="p-12 flex flex-col border-r border-slate-50 bg-white"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-[#6366f1] rounded-[18px] flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-100 font-black tracking-tighter">
                H
              </div>
              <span className="font-black tracking-tighter text-2xl">
                Hailuo AI
              </span>
            </div>

            <div className="flex gap-1 mb-10 p-1.5 bg-slate-100 rounded-2xl w-fit">
              {["TEXT", "IMAGE"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                    activeTab === tab.toLowerCase()
                      ? "bg-white shadow-sm text-[#6366f1]"
                      : "text-slate-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mb-10 flex-grow">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Input
                </label>
                <div className="flex gap-3">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setPrompt(tag + ": ")}
                      className="text-[10px] font-bold text-indigo-400/60 hover:text-indigo-600 transition-colors tracking-tight"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "text" ? (
                <div className="relative h-48">
                  <textarea
                    className="w-full h-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm resize-none focus:ring-4 ring-indigo-50/50 outline-none transition-all placeholder:text-slate-300 leading-relaxed pr-16 shadow-inner"
                    placeholder="Describe your vision..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setPrompt("Cinematic Pixar style: " + prompt)
                    }
                    className="absolute bottom-5 right-5 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 border border-indigo-50"
                  >
                    ✨
                  </motion.button>
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/50 transition-all group">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                    ＋
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Upload Photo
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-12">
              <CustomSelect
                label="Model"
                options={["Hailuo 2.3 Turbo", "V4 Cinematic"]}
                value={model}
                onChange={setModel}
              />
              <CustomSelect
                label="Ratio"
                options={["16:9", "9:16"]}
                value={ratio}
                onChange={setRatio}
              />
              <CustomSelect
                label="Quality"
                options={["HD", "4K PRO"]}
                value={quality}
                onChange={setQuality}
              />
              <CustomSelect
                label="Duration"
                options={["5s", "15s"]}
                value={duration}
                onChange={setDuration}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGen}
              disabled={status === "loading"}
              className="w-full py-6 bg-[#6366f1] text-white rounded-[28px] font-black shadow-2xl shadow-indigo-200 uppercase tracking-[0.3em] text-[11px]"
            >
              {status === "loading" ? "Generating..." : "Start Creation"}
            </motion.button>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-[#fcfcfd] relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-30">
                    <div className="px-5 py-2 bg-black/30 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                      Sample Video
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={prevSample}
                        className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-xl text-xs"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextSample}
                        className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-xl text-xs"
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
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
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
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-slate-50"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="44"
                        cx="50"
                        cy="50"
                      />
                      <motion.circle
                        className="text-[#6366f1]"
                        strokeWidth="6"
                        strokeDasharray="276"
                        strokeDashoffset={276 - (276 * progress) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="44"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl tracking-tighter">
                      {progress}%
                    </div>
                  </div>
                  <div className="w-full max-w-xs bg-slate-50 rounded-3xl p-6 font-mono text-[10px] text-slate-400 space-y-2 border border-slate-100 shadow-inner">
                    {logs.map((log, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                      >
                        {" "}
                        {`> ${log}`}
                      </motion.div>
                    ))}
                    <motion.div
                      animate={{ opacity: [0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                      _
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {status === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full relative group"
                >
                  <motion.div
                    initial={{ filter: "blur(20px) brightness(0.5)" }}
                    animate={{ filter: "blur(0px) brightness(1)" }}
                    transition={{ duration: 1.5 }}
                  >
                    <video
                      src={SAMPLES[0]}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col items-center justify-end p-12 text-center">
                    <div className="flex gap-3 mb-8">
                      {["4K UNLOCK", "ADD MUSIC", "PRO RENDER"].map((label) => (
                        <div
                          key={label}
                          className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[9px] font-black text-white/80 uppercase tracking-widest"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                    <h3 className="text-white text-4xl font-black mb-4 tracking-tighter uppercase leading-none">
                      Your Creation is Ready
                    </h3>
                    <p className="text-white/40 text-[11px] mb-12 max-w-[320px] uppercase tracking-[0.2em] font-medium leading-relaxed">
                      Join 10M+ creators and export in Ultra HD without
                      watermarks.
                    </p>
                    <button className="px-16 py-6 bg-white text-indigo-600 rounded-[30px] font-black hover:scale-105 transition-transform shadow-[0_25px_60px_rgba(255,255,255,0.3)] uppercase text-[11px] tracking-[0.3em]">
                      Claim Full HD Export
                    </button>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-8 text-white/20 text-[10px] font-bold hover:text-white transition-colors uppercase tracking-[0.3em]"
                    >
                      Start Over
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

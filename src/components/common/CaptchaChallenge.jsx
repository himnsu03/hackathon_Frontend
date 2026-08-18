import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

export const CaptchaChallenge = ({ onCaptchaChange, error }) => {
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptchaCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const drawCaptcha = useCallback((code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Noise Background Lines
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 + Math.random() * 0.25})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Noise Dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(226, 232, 240, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Captcha Text characters with rotation & distortion
    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';

    const letterSpacing = (width - 30) / code.length;
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      ctx.save();
      const x = 20 + i * letterSpacing;
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Character color
      ctx.fillStyle = i % 2 === 0 ? '#f97316' : '#fb923c';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(char, 0, 0);

      ctx.restore();
    }
  }, []);

  const refreshCaptcha = useCallback(() => {
    const newCode = generateCaptchaCode();
    setCaptchaText(newCode);
    setUserInput('');
    drawCaptcha(newCode);
    if (onCaptchaChange) {
      onCaptchaChange('', newCode);
    }
  }, [drawCaptcha, onCaptchaChange]);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUserInput(val);
    if (onCaptchaChange) {
      onCaptchaChange(val, captchaText);
    }
  };

  return (
    <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3 shadow-inner">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-orange-400" /> Bot Protection Challenge <span className="text-rose-400">*</span>
        </label>
        <span className="text-[10px] text-slate-500 font-mono">Case-Insensitive</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Canvas Display */}
        <div className="relative shrink-0 flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
          <canvas
            ref={canvasRef}
            width={170}
            height={44}
            className="rounded border border-slate-800/80 shadow"
          />
          <button
            type="button"
            onClick={refreshCaptcha}
            title="Refresh CAPTCHA Code"
            className="p-2 text-slate-400 hover:text-orange-400 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Type CAPTCHA code..."
            value={userInput}
            onChange={handleInputChange}
            maxLength={6}
            className="w-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold tracking-widest text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-500 uppercase placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-medium leading-tight">
          • {error}
        </p>
      )}
    </div>
  );
};

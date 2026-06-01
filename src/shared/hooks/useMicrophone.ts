import { useCallback, useEffect, useRef } from 'react';

interface UseMicrophoneOptions {
  onVolume?: (volume: number, isSpeaking: boolean) => void;
}

const SPEAKING_THRESHOLD = 0.08;
const SMOOTHING = 0.8;

export function useMicrophone(
  enabled: boolean,
  { onVolume }: UseMicrophoneOptions = {},
) {
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const onVolumeRef = useRef(onVolume);
  useEffect(() => {
    onVolumeRef.current = onVolume;
  }, [onVolume]);

  const stopMic = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    contextRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    contextRef.current = null;
    analyserRef.current = null;
    rafRef.current = null;
    onVolumeRef.current?.(0, false);
  }, []);

  const startMic = useCallback(async () => {
    stopMic();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      contextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = SMOOTHING;
      analyserRef.current = analyser;

      const data = new Uint8Array(
        analyser.frequencyBinCount,
      ) as Uint8Array<ArrayBuffer>;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((s, v) => s + v, 0) / data.length / 255;
        onVolumeRef.current?.(avg, avg > SPEAKING_THRESHOLD);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // пользователь отказал в доступе
    }
  }, [stopMic]);

  useEffect(() => {
    if (enabled) {
      void startMic();
    } else {
      stopMic();
    }
    return stopMic;
  }, [enabled, startMic, stopMic]);
}

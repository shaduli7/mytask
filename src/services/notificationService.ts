// Notification and Alert Service for MyTaskFlow

let alarmInterval: NodeJS.Timeout | null = null;

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  return false;
};

export const playNotificationSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Play loud dual-tone alarm beep pulse
    [0, 0.2].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime( delay === 0 ? 880 : 1046.5, ctx.currentTime + delay); // A5 then C6

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.16);
    });
  } catch (err) {
    console.error('Audio playback error:', err);
  }
};

// Continuous looping alarm (rings repeatedly until turned off)
export const startContinuousAlarm = () => {
  stopContinuousAlarm();
  playNotificationSound();
  alarmInterval = setInterval(() => {
    playNotificationSound();
  }, 1200);
};

export const stopContinuousAlarm = () => {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
};

export const showNativeNotification = (title: string, body: string, icon = '/favicon.ico') => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon,
          badge: icon,
          requireInteraction: true,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (err) {
        console.error('Failed to display native notification:', err);
      }
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          showNativeNotification(title, body, icon);
        }
      });
    }
  }
};

export const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (err) {
      console.warn('Service Worker registration failed:', err);
    }
  }
};

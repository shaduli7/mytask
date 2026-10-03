// MyTaskFlow Service Worker for Background Task Notifications and Reminders
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || 'MyTaskFlow Reminder';
    const options = {
      body: data.body || 'You have a pending daily task.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: data.url || '/',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Push event parse error:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow(event.notification.data || '/');
    })
  );
});

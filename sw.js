// HabitOS Service Worker — notificari push
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('message', e => {
  if (e.data?.type === 'NOTIFY') {
    e.waitUntil(
      self.registration.showNotification(e.data.title, {
        body: e.data.body,
        icon: e.data.icon || '',
        badge: e.data.icon || '',
        tag: e.data.tag || 'habitos-reminder',
        renotify: true,
        vibrate: [100, 50, 100],
        data: { url: e.data.url || self.location.origin + '/habitos/habitos-app.html' }
      })
    );
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = e.notification.data?.url || '/habitos/habitos-app.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const match = list.find(c => c.url.includes('habitos-app'));
      if (match) return match.focus();
      return clients.openWindow(target);
    })
  );
});

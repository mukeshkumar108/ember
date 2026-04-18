import type * as Notifications from 'expo-notifications';

export type NotificationEventHandlers = {
  onForegroundNotification?: (notification: Notifications.Notification) => void;
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
};

let handlers: NotificationEventHandlers = {};

export function setNotificationEventHandlers(next: NotificationEventHandlers) {
  handlers = {
    ...handlers,
    ...next,
  };
}

export function getNotificationEventHandlers() {
  return handlers;
}

/**
 * Service pour gérer les notifications
 */

import type { NotificationType } from '../types/weather';

class NotificationService {
    /**
     * Vérifier si les notifications sont supportées
     */
    isSupported(): boolean {
        return 'Notification' in window && typeof Notification !== 'undefined';
    }

    /**
     * Obtenir le statut de permission des notifications
     */
    getPermissionStatus(): NotificationPermission {
        if (!this.isSupported()) {
            return 'denied';
        }
        return Notification.permission;
    }

    /**
     * Demander la permission pour les notifications
     */
    async requestPermission(): Promise<NotificationPermission> {
        if (!this.isSupported()) {
            throw new Error('Les notifications ne sont pas supportées par votre navigateur.');
        }

        if (Notification.permission === 'denied') {
            throw new Error('Les notifications sont bloquées. Veuillez les réactiver dans les paramètres.');
        }

        return await Notification.requestPermission();
    }

    /**
     * Envoyer une notification
     */
    async send(title: string, options?: NotificationOptions): Promise<void> {
        if (!this.isSupported()) return;

        if (Notification.permission === 'granted') {
            // Si le SW est actif, utiliser showNotification
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg) {
                    reg.showNotification(title, {
                        icon: '/pwa_react/icons/icon-192.png',
                        ...options
                    });
                    return;
                }
            }
            // Fallback navigateur classique
            new Notification(title, {
                icon: '/pwa_react/icons/icon-192.png',
                ...options
            });
        }
    }

    /**
     * Envoyer une notification météo
     */
    sendWeatherNotification(city: string, message: string, type: NotificationType = 'info'): void {
        const typeIcons: Record<NotificationType, string> = {
            rain: '🌧️',
            temp: '🌡️',
            info: 'ℹ️'
        };

        this.send(`MétéoPWA - ${city}`, {
             body: `${typeIcons[type]} ${message}`,
            tag: `weather-${type}`,
            requireInteraction: false
        });
    }
}

export const notificationService = new NotificationService();

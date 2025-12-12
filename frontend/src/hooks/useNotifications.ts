/**
 * Hook personnalisé pour gérer les notifications
 */

import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

interface UseNotificationsReturn {
    isSupported: boolean;
    permissionStatus: NotificationPermission;
    requestPermission: () => Promise<void>;
    sendNotification: (title: string, options?: NotificationOptions) => void;
    error: string | null;
}

export function useNotifications(): UseNotificationsReturn {
    const [isSupported] = useState(() => notificationService.isSupported());
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
        notificationService.getPermissionStatus()
    );
    const [error, setError] = useState<string | null>(null);

    const requestPermission = useCallback(async () => {
        setError(null);
        try {
            const permission = await notificationService.requestPermission();
            setPermissionStatus(permission);

            if (permission === 'granted') {
                notificationService.send('MétéoPWA', {
                    body: 'Les notifications sont maintenant activées ! 🎉'
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la demande de permission');
        }
    }, []);

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (permissionStatus === 'granted') {
            notificationService.send(title, options);
        }
    }, [permissionStatus]);

    useEffect(() => {
        // Mettre à jour le statut de permission au montage
        setPermissionStatus(notificationService.getPermissionStatus());
    }, []);

    return {
        isSupported,
        permissionStatus,
        requestPermission,
        sendNotification,
        error
    };
}

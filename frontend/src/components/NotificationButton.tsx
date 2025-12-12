/**
 * Composant de bouton pour gérer les notifications
 */

import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationButton: React.FC = () => {
    const { isSupported, permissionStatus, requestPermission } = useNotifications();

    if (!isSupported) {
        return (
            <button disabled className="notify-btn">
                🔔 Non disponible
            </button>
        );
    }

    const getButtonContent = (): string => {
        switch (permissionStatus) {
            case 'granted':
                return '✅ Notifications activées';
            case 'denied':
                return '❌ Notifications bloquées';
            default:
                return '🔔 Activer les notifications';
        }
    };

    const getButtonClass = (): string => {
        if (permissionStatus === 'granted') return 'notify-btn granted';
        if (permissionStatus === 'denied') return 'notify-btn denied';
        return 'notify-btn';
    };

    const isDisabled = permissionStatus === 'denied' || permissionStatus === 'granted';

    return (
        <button
            onClick={requestPermission}
            disabled={isDisabled}
            className={getButtonClass()}
        >
            {getButtonContent()}
        </button>
    );
};

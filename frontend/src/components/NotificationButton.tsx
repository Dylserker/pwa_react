/**
 * Composant de bouton pour gérer les notifications
 */

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationButton: React.FC = () => {
    const { isSupported, permissionStatus, requestPermission } = useNotifications();
	const [enabled, setEnabled] = useState<boolean>(() => {
		const stored = localStorage.getItem('notifications-enabled');
		if (stored !== null) return stored === 'true';
		return permissionStatus === 'granted';
	});

	// Synchroniser l'état local avec localStorage
	useEffect(() => {
		localStorage.setItem('notifications-enabled', String(enabled));
	}, [enabled]);

    if (!isSupported) {
        return (
            <button disabled className="notify-btn">
                🔔 Non disponible
            </button>
        );
    }

	const getButtonContent = (): string => {
		if (permissionStatus === 'denied') return '❌ Notifications bloquées';
		if (enabled) return '✅ Notifications activées (cliquer pour désactiver)';
		return '🔔 Activer les notifications';
	};

	const getButtonClass = (): string => {
		if (permissionStatus === 'denied') return 'notify-btn denied';
		if (enabled) return 'notify-btn granted';
		return 'notify-btn';
	};

	const isDisabled = permissionStatus === 'denied';

    const handleClick = async () => {
        if (permissionStatus === 'denied') return;
		if (enabled) {
			// Désactivation locale (l'utilisateur doit gérer la permission navigateur pour un vrai blocage)
			setEnabled(false);
		} else {
			await requestPermission();
			setEnabled(true);
		}
    };

	return (
		<button
			onClick={handleClick}
			disabled={isDisabled}
			className={getButtonClass()}
		>
			{getButtonContent()}
		</button>
	);
};

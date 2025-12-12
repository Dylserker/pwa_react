/**
 * Service pour gérer le Service Worker
 */

class ServiceWorkerService {
    /**
     * Enregistrer le Service Worker
     */
    async register(): Promise<ServiceWorkerRegistration | null> {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker non supporté');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.register('/pwa_react/service-worker.js');
            console.log('✅ Service Worker enregistré:', registration.scope);
            return registration;
        } catch (error) {
            console.error('❌ Erreur Service Worker:', error);
            return null;
        }
    }

    /**
     * Vérifier les mises à jour du Service Worker
     */
    async checkForUpdates(): Promise<void> {
        if (!('serviceWorker' in navigator)) return;

        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                registration.update();
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des mises à jour:', error);
        }
    }
}

export const serviceWorkerService = new ServiceWorkerService();

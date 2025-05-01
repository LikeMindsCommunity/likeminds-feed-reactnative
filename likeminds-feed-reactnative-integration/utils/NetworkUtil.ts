import NetInfo from '@react-native-community/netinfo';

export default class NetworkUtil {
    static async isNetworkAvailable() {
        try {
            const state = await NetInfo.fetch();

            const isConnected = state.isConnected;
            const isReachable = state.isInternetReachable;

            // If either is false or null, confirm by making a test request
            if (!isConnected || !isReachable) {
                const hasRealInternet = await NetworkUtil.pingInternet();
                return hasRealInternet;
            }

            return true;
        } catch (error) {
            console.log("Network check error:", error);
            return false;
        }
    }

    static async pingInternet() {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const response = await fetch("https://www.google.com", {
                method: 'HEAD',
                signal: controller.signal,
            });

            clearTimeout(timeout);
            return response.ok;
        } catch (e) {
            console.log("Ping failed:", e);
            return false;
        }
    }
}

// 👇 Import background handlers (required for FCM + Notifee)
import './notifications';

// 👇 Then import your actual app entry
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
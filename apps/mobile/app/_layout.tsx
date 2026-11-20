import '../src/styles/global.css';

import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme/tokens';

/**
 * Parents of each screen, stated explicitly.
 *
 * Android's hardware back button and its edge-swipe back gesture both pop whatever the router
 * pushed last, which can be a screen from a different branch of the flow (finish a local game and
 * swipe back to find yourself in the settings of a room you never opened). Every screen here has a
 * defined parent, so back is answered from this table rather than from history.
 */
const PARENT: Record<string, string | null> = {
  '/': null,
  '/play-type': '/',
  '/game-mode': '/play-type',
  '/local/setup': '/game-mode',
  '/local/play': '/local/setup',
  // The online flag must survive the trip back, or the parent renders the LOCAL cards.
  '/room': '/game-mode?path=online',
  '/preview/start': null,
  '/preview/loading': null,
};

/** Strip a route to its directory-level pattern: `/local/play?x=1` → `/local/play`. */
function patternOf(route: string): string {
  const clean = route.split('?')[0] ?? route;
  if (PARENT[clean] !== undefined) return clean;
  // dynamic segments: /room/ABCDE belongs to /room
  const parentDir = clean.slice(0, clean.lastIndexOf('/'));
  return parentDir && PARENT[parentDir] !== undefined ? parentDir : clean;
}

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // The listener is registered once, but must read the *current* route, so the route lives in a ref.
  const routeRef = useRef(pathname);
  routeRef.current = pathname;

  /**
   * One listener, mounted once. It resolves the current route at press time rather than capturing
   * it in a closure, so it never acts on a stale screen.
   */
  useEffect(() => {
    const onBack = () => {
      const route = routeRef.current;
      const pattern = route ? patternOf(route) : '/';
      const parent = PARENT[pattern];
      if (parent === null || parent === undefined) return false; // let Android close the app
      router.replace(parent as never);
      return true; // handled: do not also pop history
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [router]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.void },
          animation: 'fade',
          // The edge-swipe gesture follows the same parent table through the back handler above,
          // so the swipe cannot skip a level.
          gestureEnabled: false,
        }}
      />
    </SafeAreaProvider>
  );
}

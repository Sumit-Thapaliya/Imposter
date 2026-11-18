import { useRouter } from 'expo-router';
import { SplashGate } from '@/components/start/SplashGate';

/**
 * Start → Select Play Type.
 *
 * The app now walks the same path as the website: play type, then game mode, then the
 * screen for that branch. `push` is used rather than `back()` for the return journey, so
 * each screen names its own parent instead of trusting history.
 */
export default function Index() {
  const router = useRouter();
  return <SplashGate onPlay={() => router.push('/play-type')} />;
}

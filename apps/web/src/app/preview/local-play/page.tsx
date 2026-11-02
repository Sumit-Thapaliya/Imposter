import { Suspense } from 'react';
import { LocalPlayScreen } from '@/components/local/LocalPlayScreen';

export default function LocalPlayPage() {
  return (
    <Suspense fallback={null}>
      <LocalPlayScreen />
    </Suspense>
  );
}

import { Suspense } from 'react';
import { LocalSetupRoute } from '@/components/local/LocalSetupRoute';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LocalSetupRoute />
    </Suspense>
  );
}

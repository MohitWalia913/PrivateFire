import type { Metadata } from 'next'
import FireMapWrapper from '@/components/FireMapWrapper'

export const metadata: Metadata = {
  title: 'California Fire Map — Private Fire',
  description: 'Embeddable CAL FIRE incident map.',
  robots: { index: false, follow: false },
}

/** Headerless map for iframe embeds on external sites. */
export default function EmbedMapPage() {
  return (
    <div className="h-[100dvh] w-full min-h-[320px] m-0 p-0">
      <FireMapWrapper />
    </div>
  )
}

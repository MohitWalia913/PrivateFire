import FireMapWrapper from '@/components/FireMapWrapper'

export default function MapPage() {
  return (
    <div className="flex flex-col mt-16 h-[calc(100vh-64px)]">
      <div className="flex-1 relative overflow-hidden">
        <FireMapWrapper />
      </div>
    </div>
  )
}

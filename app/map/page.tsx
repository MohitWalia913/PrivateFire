import FireMapWrapper from '@/components/FireMapWrapper'

export default function MapPage() {
  return (
    <div className="flex flex-col mt-[92px] h-[calc(100vh-92px)]">
      <div className="flex-1 relative overflow-hidden">
        <FireMapWrapper />
      </div>
    </div>
  )
}

import { ArrowRight, Plus } from 'lucide-react'
import { Button } from '../../../registry/button'

export default function ButtonPreview({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="@container mx-auto grid min-h-64 w-full max-w-[36rem] content-center px-2 py-6">
      <div className="grid gap-5 @min-[24rem]:gap-6">
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 @max-[20rem]:[&>button]:px-2! @min-[24rem]:grid-cols-3 @min-[24rem]:gap-x-4">
          <Button disabled={disabled} rightIcon={<ArrowRight size={16} />}>Continue</Button>
          <Button disabled={disabled} variant="secondary">Secondary</Button>
          <Button disabled={disabled} variant="outline">Outline</Button>
          <Button disabled={disabled} variant="ghost">Ghost</Button>
          <Button disabled={disabled} variant="destructive">Delete</Button>
          <Button disabled={disabled} variant="success">Approve</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 border-t [border-color:light-dark(#c9d7ec,#3b4a5c)] pt-5 @min-[24rem]:gap-x-3 @min-[24rem]:pt-6">
          <div className="flex items-center gap-2 @min-[24rem]:gap-3">
            <Button disabled={disabled} size="sm" variant="outline">Small</Button>
            <Button disabled={disabled} size="md" variant="outline">Medium</Button>
          </div>
          <div className="flex items-center gap-2 @min-[24rem]:gap-3">
            <Button disabled={disabled} size="lg" variant="outline">Large</Button>
            <Button disabled={disabled} size="icon" variant="outline" aria-label="Add item"><Plus size={18} aria-hidden="true" /></Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-4">
          <Button variant="secondary" isLoading loadingText="Saving…">Save</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  )
}

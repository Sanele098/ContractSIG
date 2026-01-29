export default function Loading() {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b border-border">
        <div className="mb-4 space-y-2">
          <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          <div className="h-4 bg-muted rounded w-48 animate-pulse" />
        </div>

        <div className="flex gap-3">
          <div className="h-9 bg-muted rounded w-32 animate-pulse" />
          <div className="flex-1 h-9 bg-muted rounded animate-pulse" />
          <div className="h-9 bg-muted rounded w-32 animate-pulse" />
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        <div className="border border-border rounded-lg overflow-hidden flex flex-col h-full">
          <div className="bg-muted/30 h-12 animate-pulse" />
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

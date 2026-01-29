export default function Loading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-9 bg-muted rounded w-48 mb-2 animate-pulse" />
        <div className="h-5 bg-muted rounded w-64 animate-pulse" />
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded w-40 animate-pulse" />
      </div>

      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-6 h-6 bg-muted rounded" />
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded w-64 mb-2" />
                  <div className="h-4 bg-muted rounded w-48" />
                </div>
              </div>
              <div className="h-6 bg-muted rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

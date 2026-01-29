export default function InvoicesLoading() {
  return (
    <div className="h-full flex flex-col bg-background overflow-auto">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
            <div className="h-3 bg-muted rounded w-48 animate-pulse mt-2" />
          </div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg p-4 h-24 animate-pulse" />
          ))}
        </div>

        {/* Search skeleton */}
        <div className="h-10 bg-muted rounded animate-pulse" />

        {/* Table skeleton */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-4 h-12 animate-pulse mb-2" />
          <div className="space-y-2 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

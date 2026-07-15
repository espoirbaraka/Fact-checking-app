import { Skeleton } from "@/components/ui/skeleton";

export function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-3 px-4 py-3 border-b">
        <Skeleton className="h-9 w-64 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>
      <div className="border-t p-4">
        <Skeleton className="h-24 w-full max-w-3xl mx-auto rounded-2xl" />
      </div>
    </div>
  );
}

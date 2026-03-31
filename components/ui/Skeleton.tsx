interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-black/5 dark:bg-white/10 ${className}`} />
  );
}

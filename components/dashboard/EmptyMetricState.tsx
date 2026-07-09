interface EmptyMetricStateProps {
  message: string;
}

export function EmptyMetricState({ message }: EmptyMetricStateProps) {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
      {message}
    </div>
  );
}

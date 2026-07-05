export function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
    >
      <span>{message}</span>
      <button onClick={onRetry} className="shrink-0 font-medium underline">
        Retry
      </button>
    </div>
  );
}

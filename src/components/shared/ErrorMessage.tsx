interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
      <p className="text-red-400 mb-2">⚠️ {message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-300 hover:text-red-200 underline"
        >
          Try again
        </button>
      )}
    </div>
  )
}

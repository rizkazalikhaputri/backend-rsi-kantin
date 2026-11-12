export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state error">
      ⚠️ {message}
      {onRetry && <button onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}
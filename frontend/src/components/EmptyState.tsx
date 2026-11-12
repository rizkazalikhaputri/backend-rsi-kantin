export default function EmptyState({ message }: { message: string }) {
  return <div className="state empty">📭 {message}</div>;
}
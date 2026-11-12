export default function Loading({ text = 'Memuat data...' }: { text?: string }) {
  return (
    <div className="state">
      <div className="spinner" /> {text}
    </div>
  );
}
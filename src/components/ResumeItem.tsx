export default function ResumenItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-40 text-sm text-gray-700">{label}</span>
      <div className="flex-1 bg-gray-200 rounded h-4">
        <div
          className={`h-4 rounded ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <span className="w-6 text-sm font-semibold text-gray-700">{value}</span>
    </div>
  );
}

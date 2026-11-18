import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ChoiceChart({
  results,
  total
}: {
  results: { label: string; count: number }[];
  total: number;
}) {
  const data = results.map((result) => ({
    ...result,
    percentage: total ? Math.round((result.count / total) * 100) : 0
  }));

  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value, name) => [value, name === "count" ? "Responses" : name]} />
            <Bar dataKey="count" fill="#171717" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-600">
        {data.map((result) => (
          <span key={result.label}>{result.label}: {result.count} ({result.percentage}%)</span>
        ))}
      </div>
    </div>
  );
}

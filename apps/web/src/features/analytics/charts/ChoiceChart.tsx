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
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
            <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "#f5f5f4" }}
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", boxShadow: "0 8px 24px rgba(23,23,23,.08)" }}
              formatter={(value, name) => [value, name === "count" ? "Responses" : name]}
            />
            <Bar dataKey="count" fill="#262626" radius={[0, 6, 6, 0]} barSize={22} />
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

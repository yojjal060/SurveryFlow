import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RatingChart({
  distribution,
  average,
  total
}: {
  distribution: { rating: number; count: number }[];
  average: number;
  total: number;
}) {
  return (
    <div>
      <p className="mb-3 text-sm text-neutral-600">
        Average <strong className="text-neutral-950">{average.toFixed(1)}</strong> · {total} ratings
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "#f5f5f4" }}
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", boxShadow: "0 8px 24px rgba(23,23,23,.08)" }}
            />
            <Bar dataKey="count" fill="#262626" radius={[6, 6, 0, 0]} barSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

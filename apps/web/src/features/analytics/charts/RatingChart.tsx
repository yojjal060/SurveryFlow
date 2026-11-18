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
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="rating" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#171717" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

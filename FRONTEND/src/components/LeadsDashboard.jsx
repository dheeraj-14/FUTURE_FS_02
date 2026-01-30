import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#93c5fd", "#3b82f6", "#1e40af"];

export default function LeadsDashboard({ leads }) {
  const total = leads.length;
  const newCount = leads.filter(l => l.status === "New").length;
  const contacted = leads.filter(l => l.status === "Contacted").length;
  const converted = leads.filter(l => l.status === "Converted").length;

  const data = [
    { name: "New", value: newCount },
    { name: "Contacted", value: contacted },
    { name: "Converted", value: converted }
  ];

  const percent = (v) =>
    total === 0 ? 0 : Math.round((v / total) * 100);

  return (
    <>
      <h1>Leads Dashboard</h1>

      {/* STATUS CARDS */}
      <div className="stats">
        <div><span>Total Leads</span><strong>{total}</strong></div>
        <div><span>New Leads</span><strong>{newCount}</strong></div>
        <div><span>Contacted</span><strong>{contacted}</strong></div>
        <div><span>Converted</span><strong>{converted}</strong></div>
      </div>

      {/* PROGRESS */}
      <h2>Leads Progress</h2>

      {[
        ["New", newCount],
        ["Contacted", contacted],
        ["Converted", converted],
      ].map(([label, value]) => (
        <div key={label} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{label}</strong>
            <span>{percent(value)}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${percent(value)}%` }}
            />
          </div>
        </div>
      ))}

      {/* DONUT CHART */}
      <div style={{ height: 300, marginTop: 40 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

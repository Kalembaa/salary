import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#4f46e5','#16a34a','#dc2626','#f59e0b','#0891b2','#9333ea','#db2777','#65a30d','#ea580c','#475569']
const money = (value) => `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Number(value) || 0)} ₽`

function PieChart({ data = [], title = 'Распределение по категориям' }) {
  const safeData = Array.isArray(data) ? data.filter((item) => Number(item?.value ?? 0) > 0) : []
  if (!safeData.length) return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Недостаточно данных для графика «{title}».</div>
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie data={safeData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius="75%" innerRadius="45%" paddingAngle={2}>
            {safeData.map((item, index) => <Cell key={item?.id ?? item?.name ?? index} fill={item?.color ?? COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(value) => [money(value), 'Сумма']} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChart

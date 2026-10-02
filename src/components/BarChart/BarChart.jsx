import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const money = (value) => `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Number(value) || 0)} ₽`
const compact = (value) => Math.abs(value) >= 1_000_000 ? `${(value/1_000_000).toFixed(1)} млн` : Math.abs(value) >= 1000 ? `${Math.round(value/1000)} тыс.` : String(value || 0)

function BarChart({ data = [], title = 'Доходы и расходы по месяцам' }) {
  const safeData = Array.isArray(data) ? data : []
  if (!safeData.length) return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Недостаточно данных для графика «{title}».</div>
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={safeData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={compact} tickLine={false} axisLine={false} width={70} />
          <Tooltip formatter={(value, name) => [money(value), name === 'income' ? 'Доходы' : 'Расходы']} />
          <Legend formatter={(value) => value === 'income' ? 'Доходы' : 'Расходы'} />
          <Bar dataKey="income" fill="#16a34a" radius={[6,6,0,0]} />
          <Bar dataKey="expense" fill="#dc2626" radius={[6,6,0,0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChart

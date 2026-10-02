import { useState } from 'react'
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx'
import PieChart from '../../components/PieChart/PieChart.jsx'
import BarChart from '../../components/BarChart/BarChart.jsx'
import { getAllIncomes } from '../../services/incomeService.js'
import { getAllExpenses } from '../../services/expenseService.js'
import { getExpenseByCategory, getIncomeByCategory, getMonthlySummary, getSummary } from '../../services/summaryService.js'
import styles from './Analytics.module.css'

function Analytics() {
  const [incomes] = useState(() => getAllIncomes())
  const [expenses] = useState(() => getAllExpenses())
  const summary = getSummary(incomes, expenses)
  const incomeByCategory = getIncomeByCategory(incomes)
  const expenseByCategory = getExpenseByCategory(expenses)
  const monthlySummary = getMonthlySummary(incomes, expenses)

  return (
    <section className={styles.analytics}>
      <div className={styles.heading}><div><h1 className={styles.title}>Аналитика</h1><p className={styles.subtitle}>Анализируйте структуру доходов, расходов и финансовую динамику.</p></div></div>
      <div className={styles.cards}>
        <BalanceCard title="Текущий баланс" amount={summary.balance} color="var(--color-balance)" caption="Доходы минус расходы" />
        <BalanceCard title="Доходы" amount={summary.totalIncome} color="var(--color-income)" caption="Общая сумма доходов" />
        <BalanceCard title="Расходы" amount={summary.totalExpense} color="var(--color-expense)" caption="Общая сумма расходов" />
      </div>
      <div className={styles.chartsGrid}>
        <article className={styles.chartCard}><div className={styles.chartHeader}><h2 className={styles.chartTitle}>Расходы по категориям</h2><p className={styles.chartDescription}>Распределение общей суммы расходов.</p></div><PieChart data={expenseByCategory} title="Расходы по категориям" /></article>
        <article className={styles.chartCard}><div className={styles.chartHeader}><h2 className={styles.chartTitle}>Доходы по категориям</h2><p className={styles.chartDescription}>Распределение общей суммы доходов.</p></div><PieChart data={incomeByCategory} title="Доходы по категориям" /></article>
      </div>
      <article className={styles.chartCard}><div className={styles.chartHeader}><h2 className={styles.chartTitle}>Динамика по месяцам</h2><p className={styles.chartDescription}>Сравнение доходов и расходов за каждый месяц.</p></div><BarChart data={monthlySummary} /></article>
    </section>
  )
}

export default Analytics

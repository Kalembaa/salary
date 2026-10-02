import { useEffect, useState } from 'react'
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx'
import PieChart from '../../components/PieChart/PieChart.jsx'
import BarChart from '../../components/BarChart/BarChart.jsx'
import { getAllIncomes } from '../../services/incomeService.js'
import { getAllExpenses } from '../../services/expenseService.js'
import {
  getExpenseByCategory,
  getIncomeByCategory,
  getTotalIncome,
  getTotalExpense,
} from '../../services/summaryService.js'
import styles from './Analytics.module.css'

function Analytics() {
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [monthlySummary, setMonthlySummary] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setError('')

        const [incomeData, expenseData] = await Promise.all([
          getAllIncomes(),
          getAllExpenses(),
        ])

        setIncomes(incomeData)
        setExpenses(expenseData)

        // Формируем месячную статистику из загруженных операций
        const months = {}

        const addToMonth = (items, field) => {
          items.forEach((item) => {
            if (!item?.date) return

            const date = new Date(item.date)

            if (Number.isNaN(date.getTime())) return

            const monthKey =
              `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, '0')}`

            if (!months[monthKey]) {
              const [year, month] = monthKey.split('-')

              months[monthKey] = {
                monthKey,
                month: new Intl.DateTimeFormat('ru-RU', {
                  month: 'short',
                  year: 'numeric',
                }).format(
                  new Date(
                    Number(year),
                    Number(month) - 1,
                    1
                  )
                ),
                income: 0,
                expense: 0,
              }
            }

            months[monthKey][field] += Number(item.amount) || 0
          })
        }

        addToMonth(incomeData, 'income')
        addToMonth(expenseData, 'expense')

        setMonthlySummary(
          Object.values(months).sort((a, b) =>
            a.monthKey.localeCompare(b.monthKey)
          )
        )
      } catch (err) {
        console.error(err)
        setError('Не удалось загрузить аналитику с сервера.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const totalIncome = getTotalIncome(incomes)
  const totalExpense = getTotalExpense(expenses)

  const summary = {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  }

  const incomeByCategory = getIncomeByCategory(incomes)
  const expenseByCategory = getExpenseByCategory(expenses)

  if (isLoading) {
    return (
      <section className={styles.analytics}>
        <p>Загрузка аналитики...</p>
      </section>
    )
  }

  return (
    <section className={styles.analytics}>
      <div className={styles.heading}>
        <div>
          <h1 className={styles.title}>Аналитика</h1>
          <p className={styles.subtitle}>
            Анализируйте структуру доходов, расходов
            и финансовую динамику.
          </p>
        </div>
      </div>

      {error && <p>{error}</p>}

      <div className={styles.cards}>
        <BalanceCard
          title="Текущий баланс"
          amount={summary.balance}
          color="var(--color-balance)"
          caption="Доходы минус расходы"
        />

        <BalanceCard
          title="Доходы"
          amount={summary.totalIncome}
          color="var(--color-income)"
          caption="Общая сумма доходов"
        />

        <BalanceCard
          title="Расходы"
          amount={summary.totalExpense}
          color="var(--color-expense)"
          caption="Общая сумма расходов"
        />
      </div>

      <div className={styles.chartsGrid}>
        <article className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>
              Расходы по категориям
            </h2>

            <p className={styles.chartDescription}>
              Распределение общей суммы расходов.
            </p>
          </div>

          <PieChart
            data={expenseByCategory}
            title="Расходы по категориям"
          />
        </article>

        <article className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>
              Доходы по категориям
            </h2>

            <p className={styles.chartDescription}>
              Распределение общей суммы доходов.
            </p>
          </div>

          <PieChart
            data={incomeByCategory}
            title="Доходы по категориям"
          />
        </article>
      </div>

      <article className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>
            Динамика по месяцам
          </h2>

          <p className={styles.chartDescription}>
            Сравнение доходов и расходов за каждый месяц.
          </p>
        </div>

        <BarChart data={monthlySummary} />
      </article>
    </section>
  )
}

export default Analytics
import { useEffect, useState } from 'react'
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx'
import PieChart from '../../components/PieChart/PieChart.jsx'
import BarChart from '../../components/BarChart/BarChart.jsx'

import { getIncomes } from '../../services/incomeService.js'
import { getExpenses } from '../../services/expenseService.js'

import {
  getBalance,
  getByCategory,
  getMonthlySummary,
} from '../../services/summaryService.js'

import { getCategoryLabel } from '../../utils/constants.js'

import styles from './Analytics.module.css'

function Analytics() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  })

  const [incomeByCategory, setIncomeByCategory] = useState([])
  const [expenseByCategory, setExpenseByCategory] = useState([])
  const [monthlySummary, setMonthlySummary] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setError('')

        const [
          incomeResponse,
          expenseResponse,
          summaryResponse,
          categoryResponse,
          monthlyResponse,
        ] = await Promise.all([
          getIncomes(),
          getExpenses(),
          getBalance(),
          getByCategory(),
          getMonthlySummary(),
        ])

        const incomes = incomeResponse?.data || []
        const expenses = expenseResponse?.data || []

        // Получаем общую финансовую сводку
        const summaryData = summaryResponse?.data || {}

        const calculatedIncome = incomes.reduce(
          (sum, item) => sum + (Number(item.amount) || 0),
          0
        )

        const calculatedExpense = expenses.reduce(
          (sum, item) => sum + (Number(item.amount) || 0),
          0
        )

        const totalIncome =
          Number(summaryData.totalIncome) || calculatedIncome

        const totalExpense =
          Number(summaryData.totalExpense) || calculatedExpense

        setSummary({
          totalIncome,
          totalExpense,
          balance:
            summaryData.balance !== undefined
              ? Number(summaryData.balance)
              : totalIncome - totalExpense,
        })

        // Получаем статистику по категориям
        const categoryData = categoryResponse?.data || {}

        const incomeCategories = Array.isArray(
          categoryData.incomes
        )
          ? categoryData.incomes
          : []

        const expenseCategories = Array.isArray(
          categoryData.expenses
        )
          ? categoryData.expenses
          : []

        // Подготавливаем доходы для кругового графика
        setIncomeByCategory(
          incomeCategories.map((item) => ({
            id: item.category,
            name: getCategoryLabel(
              'income',
              item.category
            ),
            value: Number(item.total) || 0,
          }))
        )

        // Подготавливаем расходы для кругового графика
        setExpenseByCategory(
          expenseCategories.map((item) => ({
            id: item.category,
            name: getCategoryLabel(
              'expense',
              item.category
            ),
            value: Number(item.total) || 0,
          }))
        )

        // Подготавливаем месячную статистику
        const months = monthlyResponse?.data || []

        setMonthlySummary(
          Array.isArray(months)
            ? months.map((item) => {
                const [year, month] = item.month.split('-')

                return {
                  monthKey: item.month,

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

                  income:
                    Number(item.totalIncome) || 0,

                  expense:
                    Number(item.totalExpense) || 0,
                }
              })
            : []
        )
      } catch (err) {
        console.error(err)

        setError(
          err?.message ||
            'Не удалось загрузить аналитику с сервера.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

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
          <h1 className={styles.title}>
            Аналитика
          </h1>

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
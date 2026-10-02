import { useEffect, useState } from 'react'
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx'
import TransactionList from '../../components/TransactionList/TransactionList.jsx'

import {
  addIncome,
  deleteIncome,
  getIncomes,
  updateIncome,
} from '../../services/incomeService.js'

import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from '../../services/expenseService.js'

import { getCategoryLabel } from '../../utils/constants.js'

import styles from './History.module.css'

function History() {
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Добавляем данные, необходимые интерфейсу
  const prepareTransactions = (items, type) =>
    items.map((item) => ({
      ...item,
      type,
      categoryLabel: getCategoryLabel(
        type,
        item.category
      ),
      amount: Number(item.amount) || 0,
    }))

  // Загружаем доходы и расходы из backend
  const refreshData = async () => {
    try {
      setError('')

      const [incomeResponse, expenseResponse] =
        await Promise.all([
          getIncomes(),
          getExpenses(),
        ])

      setIncomes(
        prepareTransactions(
          incomeResponse?.data || [],
          'income'
        )
      )

      setExpenses(
        prepareTransactions(
          expenseResponse?.data || [],
          'expense'
        )
      )
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          'Не удалось загрузить данные с сервера.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Загружаем данные при открытии страницы
  useEffect(() => {
    refreshData()
  }, [])

  // Рассчитываем общие суммы
  const totalIncome = incomes.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  )

  const totalExpense = expenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  )

  const summary = {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  }

  // Объединяем доходы и расходы в общую историю
  const transactions = [
    ...incomes,
    ...expenses,
  ].sort(
    (a, b) =>
      new Date(b?.date || 0).getTime() -
      new Date(a?.date || 0).getTime()
  )

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  // Добавляем или редактируем операцию
  const handleSubmit = async (data) => {
    if (!data) return

    try {
      setError('')

      if (editingTransaction?.id) {
        if (editingTransaction.type === data.type) {
          if (data.type === 'income') {
            await updateIncome(
              editingTransaction.id,
              data
            )
          } else {
            await updateExpense(
              editingTransaction.id,
              data
            )
          }
        } else {
          // При изменении типа удаляем старую операцию
          if (editingTransaction.type === 'income') {
            await deleteIncome(editingTransaction.id)
          } else {
            await deleteExpense(editingTransaction.id)
          }

          // Создаём операцию нового типа
          if (data.type === 'income') {
            await addIncome(data)
          } else {
            await addExpense(data)
          }
        }
      } else {
        if (data.type === 'income') {
          await addIncome(data)
        } else {
          await addExpense(data)
        }
      }

      await refreshData()
      closeModal()
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          'Не удалось сохранить операцию.'
      )
    }
  }

  // Удаляем операцию
  const handleDelete = async (transaction) => {
    if (
      !transaction?.id ||
      !window.confirm('Удалить эту операцию?')
    ) {
      return
    }

    try {
      setError('')

      if (transaction.type === 'income') {
        await deleteIncome(transaction.id)
      } else {
        await deleteExpense(transaction.id)
      }

      await refreshData()
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          'Не удалось удалить операцию.'
      )
    }
  }

  if (isLoading) {
    return (
      <section className={styles.history}>
        <p>Загрузка данных...</p>
      </section>
    )
  }

  return (
    <section className={styles.history}>
      <div className={styles.heading}>
        <div>
          <h1 className={styles.title}>
            История операций
          </h1>

          <p className={styles.subtitle}>
            Все доходы и расходы в одном месте.
          </p>
        </div>

        <button
          className={styles.addButton}
          type="button"
          onClick={() => {
            setEditingTransaction(null)
            setIsModalOpen(true)
          }}
        >
          + Добавить операцию
        </button>
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
          caption="Всего получено"
        />

        <BalanceCard
          title="Расходы"
          amount={summary.totalExpense}
          color="var(--color-expense)"
          caption="Всего потрачено"
        />
      </div>

      <div className={styles.transactionsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Все операции
          </h2>

          <p className={styles.sectionDescription}>
            Полная история доходов и расходов.
          </p>
        </div>

        <TransactionList
          transactions={transactions}
          onEdit={(item) => {
            setEditingTransaction(item)
            setIsModalOpen(true)
          }}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title={
          editingTransaction
            ? 'Редактирование операции'
            : 'Новая операция'
        }
        onClose={closeModal}
      >
        <TransactionForm
          editData={editingTransaction}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </section>
  )
}

export default History
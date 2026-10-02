import { useEffect, useState } from 'react'
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx'
import TransactionList from '../../components/TransactionList/TransactionList.jsx'

import {
  addIncome,
  deleteIncome,
  getAllIncomes,
  updateIncome,
} from '../../services/incomeService.js'

import {
  addExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
} from '../../services/expenseService.js'

import {
  getAllTransactions,
  getTotalIncome,
  getTotalExpense,
} from '../../services/summaryService.js'

import styles from './History.module.css'

function History() {
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Загружаем доходы и расходы из backend
  const refreshData = async () => {
    try {
      setError('')

      const [incomeData, expenseData] = await Promise.all([
        getAllIncomes(),
        getAllExpenses(),
      ])

      setIncomes(incomeData)
      setExpenses(expenseData)
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить данные с сервера.')
    } finally {
      setIsLoading(false)
    }
  }

  // Загружаем данные при открытии страницы
  useEffect(() => {
    refreshData()
  }, [])

  const totalIncome = getTotalIncome(incomes)
  const totalExpense = getTotalExpense(expenses)

  const summary = {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  }

  const transactions = getAllTransactions(
    incomes,
    expenses
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
            await updateIncome(editingTransaction.id, data)
          } else {
            await updateExpense(editingTransaction.id, data)
          }
        } else {
          // Если пользователь изменил тип операции,
          // удаляем старую и создаём новую
          if (editingTransaction.type === 'income') {
            await deleteIncome(editingTransaction.id)
          } else {
            await deleteExpense(editingTransaction.id)
          }

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
      setError('Не удалось сохранить операцию.')
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
      setError('Не удалось удалить операцию.')
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
import { useState } from 'react'
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import TransactionForm from '../../components/TransactionForm/TransactionForm.jsx'
import TransactionList from '../../components/TransactionList/TransactionList.jsx'
import { addIncome, deleteIncome, getAllIncomes, updateIncome } from '../../services/incomeService.js'
import { addExpense, deleteExpense, getAllExpenses, updateExpense } from '../../services/expenseService.js'
import { getAllTransactions, getSummary } from '../../services/summaryService.js'
import styles from './History.module.css'

function History() {
  const [incomes, setIncomes] = useState(() => getAllIncomes())
  const [expenses, setExpenses] = useState(() => getAllExpenses())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const summary = getSummary(incomes, expenses)
  const recentTransactions = getAllTransactions(incomes, expenses)
  const refreshData = () => { setIncomes(getAllIncomes()); setExpenses(getAllExpenses()) }
  const closeModal = () => { setIsModalOpen(false); setEditingTransaction(null) }

  const handleSubmit = (data) => {
    if (!data) return
    if (editingTransaction?.id) {
      if (editingTransaction.type === data.type) {
        data.type === 'income' ? updateIncome(editingTransaction.id, data) : updateExpense(editingTransaction.id, data)
      } else {
        editingTransaction.type === 'income' ? deleteIncome(editingTransaction.id) : deleteExpense(editingTransaction.id)
        data.type === 'income' ? addIncome(data) : addExpense(data)
      }
    } else {
      data.type === 'income' ? addIncome(data) : addExpense(data)
    }
    refreshData(); closeModal()
  }

  const handleDelete = (transaction) => {
    if (!transaction?.id || !window.confirm('Удалить эту операцию?')) return
    transaction.type === 'income' ? deleteIncome(transaction.id) : deleteExpense(transaction.id)
    refreshData()
  }

  return (
    <section className={styles.history}>
      <div className={styles.heading}>
        <div><h1 className={styles.title}>История операций</h1><p className={styles.subtitle}>Все доходы и расходы в одном месте.</p></div>
        <button className={styles.addButton} type="button" onClick={() => { setEditingTransaction(null); setIsModalOpen(true) }}>+ Добавить операцию</button>
      </div>
      <div className={styles.cards}>
        <BalanceCard title="Текущий баланс" amount={summary.balance} color="var(--color-balance)" caption="Доходы минус расходы" />
        <BalanceCard title="Доходы" amount={summary.totalIncome} color="var(--color-income)" caption="Всего получено" />
        <BalanceCard title="Расходы" amount={summary.totalExpense} color="var(--color-expense)" caption="Всего потрачено" />
      </div>
      <div className={styles.transactionsSection}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Все операции</h2><p className={styles.sectionDescription}>Полная история доходов и расходов.</p></div>
        <TransactionList transactions={recentTransactions} onEdit={(item) => { setEditingTransaction(item); setIsModalOpen(true) }} onDelete={handleDelete} />
      </div>
      <Modal isOpen={isModalOpen} title={editingTransaction ? 'Редактирование операции' : 'Новая операция'} onClose={closeModal}>
        <TransactionForm editData={editingTransaction} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>
    </section>
  )
}

export default History

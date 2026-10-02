import EmptyState from '../EmptyState/EmptyState.jsx'
import styles from './TransactionList.module.css'

function TransactionList({ transactions = [], onEdit = null, onDelete = null }) {
  const safeTransactions = Array.isArray(transactions) ? transactions : []

  if (safeTransactions.length === 0) {
    return <EmptyState icon="📋" title="Нет операций" description="Добавьте первый доход или расход, и операция появится здесь." />
  }

  const formatAmount = (amount) => {
    const numericAmount = Number(amount ?? 0)
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(
      Number.isFinite(numericAmount) ? numericAmount : 0,
    )
  }

  const formatDate = (date) => {
    if (!date) return '—'
    const parsedDate = new Date(date)
    return Number.isNaN(parsedDate.getTime()) ? '—' : new Intl.DateTimeFormat('ru-RU').format(parsedDate)
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.header}>
          <tr>
            <th className={styles.headerCell}>Дата</th>
            <th className={styles.headerCell}>Категория</th>
            <th className={styles.headerCell}>Комментарий</th>
            <th className={`${styles.headerCell} ${styles.headerCellAmount}`}>Сумма</th>
            <th className={`${styles.headerCell} ${styles.headerCellActions}`}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {safeTransactions.map((transaction, index) => {
            const isIncome = transaction?.type === 'income'
            const key = transaction?.id ?? `${transaction?.date ?? 'transaction'}-${index}`
            return (
              <tr key={key} className={styles.row}>
                <td className={styles.cell}><span className={styles.date}>{formatDate(transaction?.date)}</span></td>
                <td className={styles.cell}><span className={styles.category}>{transaction?.categoryLabel || transaction?.category || 'Без категории'}</span></td>
                <td className={styles.cell}><div className={styles.comment} title={transaction?.comment || ''}>{transaction?.comment || '—'}</div></td>
                <td className={`${styles.cell} ${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
                  {isIncome ? '+' : '−'}{formatAmount(transaction?.amount)} ₽
                </td>
                <td className={styles.cell}>
                  <div className={styles.actions}>
                    <button className={styles.actionButton} type="button" onClick={() => onEdit?.(transaction)} aria-label="Редактировать операцию">✎</button>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`} type="button" onClick={() => onDelete?.(transaction)} aria-label="Удалить операцию">×</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionList

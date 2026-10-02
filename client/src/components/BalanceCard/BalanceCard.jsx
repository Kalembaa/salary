import styles from './BalanceCard.module.css'

function BalanceCard({ title = 'Без названия', amount = 0, color = 'var(--color-primary)', caption = '' }) {
  const safeAmount = Number(amount ?? 0)
  const formattedAmount = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(
    Number.isFinite(safeAmount) ? safeAmount : 0,
  )

  return (
    <article className={styles.card} style={{ '--card-color': color }}>
      <p className={styles.title}>{title}</p>
      <p className={styles.amount}>{formattedAmount} ₽</p>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </article>
  )
}

export default BalanceCard

import styles from './EmptyState.module.css'

function EmptyState({ icon = '📋', title = 'Данных пока нет', description = '', actionLabel = '', onAction = null }) {
  const showAction = Boolean(actionLabel) && typeof onAction === 'function'
  return (
    <div className={styles.emptyState}>
      {icon ? <div className={styles.icon} aria-hidden="true">{icon}</div> : null}
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {showAction ? <button className={styles.button} type="button" onClick={onAction}>{actionLabel}</button> : null}
    </div>
  )
}

export default EmptyState

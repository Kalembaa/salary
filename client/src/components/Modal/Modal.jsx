import { useEffect } from 'react'
import styles from './Modal.module.css'

function Modal({ isOpen = false, title = '', onClose = () => {}, children = null }) {
  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title || 'Диалог'}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'Окно'}</h2>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Закрыть">×</button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

export default Modal

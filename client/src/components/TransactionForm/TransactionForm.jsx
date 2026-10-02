import { useEffect, useState } from 'react'
import { getCategoriesByType } from '../../utils/constants.js'
import styles from './TransactionForm.module.css'

const getToday = () => new Date().toISOString().split('T')[0]

const createInitialForm = (editData = null) => ({
  type: editData?.type || 'expense',
  category: editData?.category || '',
  amount: editData?.amount ?? '',
  date: editData?.date || getToday(),
  comment: editData?.comment || '',
})

function TransactionForm({ onSubmit = () => {}, onCancel = () => {}, editData = null }) {
  const [formData, setFormData] = useState(() => createInitialForm(editData))
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(createInitialForm(editData))
    setErrors({})
  }, [editData])

  const categories = getCategoriesByType(formData.type)

  const handleTypeChange = (type) => {
    setFormData((current) => ({ ...current, type, category: '' }))
    setErrors((current) => ({ ...current, category: '' }))
  }

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors?.[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    const numericAmount = Number(formData.amount)
    if (!formData.category) nextErrors.category = 'Выберите категорию.'
    if (formData.amount === '' || !Number.isFinite(numericAmount) || numericAmount <= 0) nextErrors.amount = 'Введите сумму больше нуля.'
    if (!formData.date) nextErrors.date = 'Укажите дату операции.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const selectedCategory = categories.find((item) => item.id === formData.category)
    onSubmit({
      ...editData,
      ...formData,
      categoryLabel: selectedCategory?.label || 'Без категории',
      amount: numericAmount,
      comment: formData.comment.trim(),
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.typeSelector}>
        <button className={`${styles.typeButton} ${formData.type === 'income' ? styles.typeButtonActive : ''}`} type="button" onClick={() => handleTypeChange('income')}>Доход</button>
        <button className={`${styles.typeButton} ${formData.type === 'expense' ? styles.typeButtonActive : ''}`} type="button" onClick={() => handleTypeChange('expense')}>Расход</button>
      </div>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="transaction-category">Категория <span className={styles.required}>*</span></label>
          <select id="transaction-category" className={styles.select} name="category" value={formData.category} onChange={handleChange}>
            <option value="">Выберите категорию</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
          {errors.category ? <p className={styles.error}>{errors.category}</p> : null}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="transaction-amount">Сумма <span className={styles.required}>*</span></label>
          <input id="transaction-amount" className={styles.input} type="number" name="amount" min="0" step="0.01" value={formData.amount} onChange={handleChange} placeholder="0.00" />
          {errors.amount ? <p className={styles.error}>{errors.amount}</p> : null}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="transaction-date">Дата <span className={styles.required}>*</span></label>
          <input id="transaction-date" className={styles.input} type="date" name="date" value={formData.date} onChange={handleChange} />
          {errors.date ? <p className={styles.error}>{errors.date}</p> : null}
        </div>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor="transaction-comment">Комментарий</label>
          <textarea id="transaction-comment" className={styles.textarea} name="comment" value={formData.comment} onChange={handleChange} placeholder="Например: продукты на неделю" />
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.cancelButton} type="button" onClick={onCancel}>Отмена</button>
        <button className={styles.submitButton} type="submit">{editData ? 'Сохранить изменения' : 'Добавить операцию'}</button>
      </div>
    </form>
  )
}

export default TransactionForm

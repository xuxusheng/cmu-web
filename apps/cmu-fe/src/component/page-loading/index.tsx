import { FC } from 'react'
import styles from './index.module.scss'
export const PageLoading: FC = () => {
  return (
    <div className={styles.main}>
      <svg
        className={styles.spinner}
        height="65px"
        viewBox="0 0 66 66"
        width="65px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={styles.path}
          cx="33"
          cy="33"
          fill="none"
          r="30"
          strokeLinecap="round"
          strokeWidth="6"
        ></circle>
      </svg>
    </div>
  )
}

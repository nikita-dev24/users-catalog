import type { User } from '@/types/user';

import styles from './UserCard.module.css';

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className={styles.card}>
      <img
        className={styles.avatar}
        src={user.image}
        alt={`${user.firstName} ${user.lastName}`}
      />

      <div className={styles.info}>
        <div className={styles.name}>
          {user.firstName} {user.lastName}
        </div>

        <div className={styles.email}>{user.email}</div>
      </div>
    </div>
  );
};
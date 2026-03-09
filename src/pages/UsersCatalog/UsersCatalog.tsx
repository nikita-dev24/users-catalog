import { useEffect, useState } from 'react';

import { getUsers, searchUsers } from '@/api/usersApi';
import { Pagination } from '@/components/Pagination/Pagination';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { UserCard } from '@/components/UserCard/UserCard';
import { useDebounce } from '@/hooks/useDebounce';

import type { User } from '@/types/user';

import styles from './UsersCatalog.module.css';

const LIMIT = 10;

export const UsersCatalog = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const skip = (page - 1) * LIMIT;

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = debouncedQuery
        ? await searchUsers(debouncedQuery)
        : await getUsers(LIMIT, skip);

      setUsers(data.users);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, debouncedQuery]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Users catalog</h1>

      <div className={styles.search}>
        <SearchBar
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
      </div>

      {loading && <p>Loading...</p>}

      {!loading && users.length === 0 && (
      <p className={styles.empty}>No users found</p>
      )}

      {!loading && (
        <>
          <div className={styles.list}>
            {users.map((user) => (
              <div key={user.id} className={styles.item}>
                <UserCard user={user} />
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};
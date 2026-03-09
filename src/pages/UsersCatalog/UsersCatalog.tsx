import { useEffect, useReducer } from 'react';

import { getUsers, searchUsers } from '@/api/usersApi';
import { SEARCH_DEBOUNCE_MS, USERS_LIMIT } from '@/constants/pagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { UserCard } from '@/components/UserCard/UserCard';
import { useDebounce } from '@/hooks/useDebounce';

import type { User } from '@/types/user';

import styles from './UsersCatalog.module.css';

interface UsersCatalogState {
  users: User[];
  total: number;
  page: number;
  query: string;
  loading: boolean;
}

type UsersCatalogAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USERS'; payload: { users: User[]; total: number } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_QUERY'; payload: string };

const initialState: UsersCatalogState = {
  users: [],
  total: 0,
  page: 1,
  query: '',
  loading: false,
};

const usersCatalogReducer = (
  state: UsersCatalogState,
  action: UsersCatalogAction,
): UsersCatalogState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload.users,
        total: action.payload.total,
      };

    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload,
      };

    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload,
        page: 1,
      };

    default:
      return state;
  }
};

export const UsersCatalog = () => {
  const [state, dispatch] = useReducer(usersCatalogReducer, initialState);
  const { users, total, page, query, loading } = state;

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const skip = (page - 1) * USERS_LIMIT;

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const data = debouncedQuery
          ? await searchUsers(debouncedQuery, controller.signal)
          : await getUsers(USERS_LIMIT, skip, controller.signal);

        dispatch({
          type: 'SET_USERS',
          payload: {
            users: data.users,
            total: data.total,
          },
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        throw error;
      } finally {
        if (!controller.signal.aborted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    loadUsers();

    return () => {
      controller.abort();
    };
  }, [page, debouncedQuery, skip]);

  const handleSearchChange = (value: string) => {
    dispatch({ type: 'SET_QUERY', payload: value });
  };

  const handlePageChange = (nextPage: number) => {
    dispatch({ type: 'SET_PAGE', payload: nextPage });
  };

  const hasUsers = users.length > 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Users catalog</h1>

      <div className={styles.search}>
        <SearchBar value={query} onChange={handleSearchChange} />
      </div>

      {loading && <p>Loading...</p>}

      {!loading && !hasUsers && (
        <p className={styles.empty}>No users found</p>
      )}

      {!loading && hasUsers && (
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
            limit={USERS_LIMIT}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import './App.scss';
import './styles/general.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppDispatch,
  loadUsers,
  loadAllPosts,
  setCurrentUserAction,
  setIsLoadingAction,
} from './store';
import { PostsList } from './components/PostsList';
import {
  getCurrentUserSelector,
  getIsLoadingSelector,
  getUsersSelector,
} from './store/selectors';
import { Loader } from './components/Loader';
import { User } from './react-app-env.d';

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(getUsersSelector);
  const userSelectedId = useSelector(getCurrentUserSelector);
  const isLoading = useSelector(getIsLoadingSelector);
  const [kindOfSort, setKindOfSort] = useState('0');
  const [checked, setCheked] = useState(true);
  const currentUser = useSelector(getCurrentUserSelector);

  useEffect(() => {
    dispatch(loadUsers());
    dispatch(loadAllPosts());
  }, []);

  return (
    <div className="App">
      <header className="App__header">
        <div className="App__container-filters">
          <div className="App__box-user-selector">
            <p>Select a user: &nbsp;</p>
            <select
              className="App__selector"
              value={currentUser}
              onChange={(event) => {
                dispatch(setCurrentUserAction(event.target.value));
                dispatch(setIsLoadingAction(true));
              }}
            >
              <option value="0">All users</option>
              {users.map((user: User) => (
                <option
                  key={user.id}
                  value={`${user.id}`}
                >
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div className="App__box-sort-selector">
            <p>Sort by: &nbsp;</p>
            <select
              className="App__selector"
              value={kindOfSort}
              disabled={userSelectedId !== '0'}
              onChange={(event) => {
                setKindOfSort(event.target.value);
              }}
            >
              <option value="0" disabled>Choose one</option>
              <option value="1">Username</option>
              <option value="2">Email</option>
              <option value="3">Date</option>
            </select>
          </div>
          <div className="App__box-label-checkbox">
            <label
              htmlFor="checkbox"
              className="App__label-checkbox"
            >
              <input
                id="checkbox"
                type="checkbox"
                disabled={userSelectedId !== '0'}
                onChange={() => {
                  setCheked(!checked);
                }}
              />
              {!checked ? 'A ➡ Z or 1 ➡ 10' : 'Z ➡ A or 10 ➡ 1'}
            </label>
          </div>
        </div>

      </header>

      <main className="App__main">
        <div className="App__sidebar">
          {isLoading && <Loader />}
          <PostsList
            kindOfSort={kindOfSort}
            checked={checked}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

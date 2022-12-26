/* eslint-disable max-len */
import React, {
  useEffect,
  useState,
} from 'react';
import './PostsList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '../Pagination';
import { deletePost, getPosts } from '../../api/posts';
import {
  getCurrentUserSelector,
  getPostsSelector,
  getSelectedPostIdSelector,
  getUsersSelector,
} from '../../store/selectors';
import {
  AppDispatch,
  loadAllPosts,
  loadComments,
  setFilteredPosts,
  setIsLoadingAction,
  setPostsAction,
  setPostTitleAction,
  setSelectedPostIdAction,
} from '../../store';
import { PostDetails } from '../PostDetails';
import {
  Post,
  User,
} from '../../react-app-env.d';
import { getFormatDate } from '../../utils/formatDate';

type Props = {
  kindOfSort: string;
  checked: boolean;
};

export const PostsList: React.FC<Props> = ({ kindOfSort, checked }) => {
  const dispatch: AppDispatch = useDispatch();
  const userSelectedId = useSelector(getCurrentUserSelector);
  const postId = useSelector(getSelectedPostIdSelector);
  const currentPostList = useSelector(getPostsSelector);
  const allUsers = useSelector(getUsersSelector);

  const total = currentPostList.length;
  const [
    currentListPerPage,
    setCurrentListPerPage,
  ] = useState(currentPostList);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentListPerPage(currentPostList
      .slice(0 + (currentPage - 1) * 25, 25 * currentPage));
  }, [currentPage, currentPostList]);

  function sortBy() {
    let sortedArrUser: User[] = [];
    const sortedArrPosts: Post[] = [];

    function createdSortedPosts() {
      sortedArrUser.forEach(item => sortedArrPosts.push(...currentPostList.filter(post => post.userid === item.id)));
    }

    switch (kindOfSort) {
      case '1':
        if (checked) {
          sortedArrUser = [...allUsers].sort((a, b) => b.username.localeCompare(a.username));
        } else {
          sortedArrUser = [...allUsers].sort((a, b) => a.username.localeCompare(b.username));
        }

        createdSortedPosts();
        dispatch(setFilteredPosts(sortedArrPosts));

        break;
      case '2':
        if (checked) {
          sortedArrUser = [...allUsers].sort((a, b) => b.email.localeCompare(a.email));
        } else {
          sortedArrUser = [...allUsers].sort((a, b) => a.email.localeCompare(b.email));
        }

        createdSortedPosts();
        dispatch(setFilteredPosts(sortedArrPosts));

        break;
      case '3':
        if (checked) {
          sortedArrUser = [...allUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
          sortedArrUser = [...allUsers].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        createdSortedPosts();
        dispatch(setFilteredPosts(sortedArrPosts));

        break;

      default:
        break;
    }
  }

  const findposts = async () => {
    const result = await getPosts(userSelectedId);

    dispatch(setPostsAction(result));
    dispatch(setIsLoadingAction(false));
  };

  function getInfoUser(userId: number) {
    let date = '';
    const user = allUsers.find((item: User) => item.id === userId);

    if (user) {
      if (user?.createdAt) {
        date = getFormatDate(user?.createdAt);
      }
    }

    return { user, date };
  }

  useEffect(() => {
    findposts();

    if (userSelectedId === '0') {
      dispatch(loadAllPosts());
    }
  }, [userSelectedId]);

  useEffect(() => {
    sortBy();
  }, [kindOfSort, checked]);

  return (
    <div className="PostsList">

      <h2>Posts:</h2>
      <ul
        className="PostsList__list"
      >
        {currentListPerPage.map(post => {
          const objUser = getInfoUser(post.userid);

          return (
            <li
              className="PostsList__item"
              key={post.id}
            >
              <div className="PostsList__box-info">
                <div className="PostsList__box-left">
                  <div className="PostsList__box-avatar">
                    <img
                      className="PostsList__avatar"
                      src={objUser.user?.avatar}
                      alt="avatar"
                    />
                  </div>
                  <h3 className="PostsList__author">{objUser.user?.username}</h3>
                  <p className="PostsList__when">{objUser.date}</p>
                  <p className="PostsList__email"><i>{objUser.user?.email}</i></p>
                </div>
                <div className="PostsList__box-button PostsList__box-right">
                  <button
                    type="button"
                    className="PostsList__button button"
                    onClick={() => {
                      if (postId === post.id) {
                        dispatch(setSelectedPostIdAction(undefined));
                      } else {
                        dispatch(setSelectedPostIdAction(post.id));
                        dispatch(setPostTitleAction(post.title));
                        dispatch(loadComments(post.id));
                      }
                    }}
                  >
                    {postId === post.id ? 'Close' : '✚ Comment'}
                  </button>
                  <button
                    type="button"
                    className="PostsList__button button"
                    onClick={async () => {
                      await deletePost(post.id);
                      dispatch(loadAllPosts());
                    }}
                  >
                    ✖ Post
                  </button>
                </div>
              </div>
              <p className="PostsList__text-post">
                {post.body}
              </p>
              {postId === post.id && (
                <div className="App__content">
                  <PostDetails />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Pagination
        total={total}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

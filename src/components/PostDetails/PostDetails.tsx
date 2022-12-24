import React, {
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { NewCommentForm } from '../NewCommentForm';

import './PostDetails.scss';

import {
  getCommentsSelector,
  getPostTitleSelector,
  getSelectedPostIdSelector,
} from '../../store/selectors';
import {
  AppDispatch,
  loadComments,
} from '../../store';
import { delComment } from '../../api/comments';
import { getFormatDate } from '../../utils/formatDate';
import { randomNumber } from '../../utils/randomNumber';

export const PostDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const postTitle = useSelector(getPostTitleSelector);
  const commentsList = useSelector(getCommentsSelector);

  const postId = useSelector(getSelectedPostIdSelector);
  const [visiblecomments, setVisiblecomments] = useState(false);

  const findcomments = async () => {
    dispatch(loadComments(postId));
  };

  const deletecomment = async (id: number) => {
    if (commentsList) {
      await delComment(id);
      findcomments();
    }
  };

  useEffect(() => {
    findcomments();
  }, []);

  return (
    <div className="PostDetails">
      <h3 className="PostDetails__main-title">All comments on the post:</h3>
      {postId !== 0 && (
        <>
          <section className="PostDetails__post">
            <p>
              Title of post:
              {' '}
              <i>{postTitle}</i>
            </p>
          </section>
          <section className="PostDetails__comments">
            <button
              type="button"
              className="button"
              onClick={() => {
                setVisiblecomments(!visiblecomments);
              }}
            >
              {visiblecomments
                ? `Show ${commentsList.length} comments`
                : `Hide ${commentsList.length} comments`}
            </button>
            <ul
              className={visiblecomments
                ? 'PostDetails__visiblelist'
                : 'PostDetails__list'}
            >
              {commentsList.map(comm => {
                return (
                  <li
                    className="PostDetails__list-item"
                    key={comm.id}
                  >
                    <div className="PostDetails__box-info">
                      <div className="PostDetails__box-avatar">
                        <img
                          className="PostDetails__avatar"
                          src={`https://picsum.photos/id/${randomNumber()}/200/300`}
                          alt="avatar"
                        />
                      </div>
                      <h3 className="PostDetails__author">{comm.name}</h3>
                      <p className="PostDetails__when">{getFormatDate(comm.createdAt)}</p>
                      <p className="PostDetails__email"><i>{comm.email}</i></p>
                    </div>
                    <div className="PostDetails__comm-button">
                      <div
                        className="PostDetails__comm-text"
                      >
                        { ReactHtmlParser(comm.body) }
                      </div>
                      <button
                        type="button"
                        className="PostDetails__remove-button button"
                        onClick={() => {
                          deletecomment(comm.id);
                        }}
                      >
                        X
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <div className="PostDetails__form-wrapper">
              <NewCommentForm />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

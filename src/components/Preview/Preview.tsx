/* eslint-disable no-console */
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { getFormatDate } from '../../utils/formatDate';
import { randomNumber } from '../../utils/randomNumber';
import 'animate.css';
import './Preview.scss';

type Props = {
  name: string,
  email: string,
  comment: string,
  setShowPreview: (arg: boolean) => void,
};

export const Preview: React.FC<Props> = ({
  name, email, comment, setShowPreview,
}) => {
  return (
    <div className="Preview__container">
      <div className="Preview__container-content animate__animated animate__fadeInTopRight">
        <div className="Preview__box-info">
          <div className="Preview__box-avatar">
            <img
              className="Preview__avatar animate__swing"
              src={`https://picsum.photos/id/${randomNumber()}/200/300`}
              alt="avatar"
            />
          </div>
          <h3 className="Preview__author">{name}</h3>
          <p className="Preview__when">{getFormatDate(new Date().getTime())}</p>
          <p className="Preview__email"><i>{email}</i></p>
          <button
            className="Preview__button button"
            type="button"
            onClick={() => {
              setShowPreview(false);
            }}
          >
            X
          </button>
        </div>

        <div className="Preview__comment">
          <div
            className="Preview__comm-text"
          >
            { ReactHtmlParser(comment) }
          </div>
        </div>
      </div>
    </div>
  );
};

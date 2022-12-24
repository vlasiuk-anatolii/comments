/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-lonely-if */
import './NewCommentForm.scss';
import React, { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import ReactQuill from 'react-quill';
import { NewComment } from '../../react-app-env.d';
import { postComment } from '../../api/comments';

import {
  getCommentsSelector,
  getSelectedPostIdSelector,
} from '../../store/selectors';
import { AppDispatch, loadComments } from '../../store';
import { Preview } from '../Preview';

export const NewCommentForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const commentsList = useSelector(getCommentsSelector);
  const postId = useSelector(getSelectedPostIdSelector);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(false);
  const [isverified, setIsVerified] = useState(false);
  const [isTextFileFit, setIsTextFileFit] = useState(true);
  const [imageFile, setImageFile] = useState('');
  const [textFile, setTextFile] = useState('');
  const [homepage, setHomePage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const sitekey = '6LcTuKMjAAAAAH99EHMwIJg8G-gtMvEXW29BQffk';
  const modules = {
    toolbar: [
      ['bold', 'italic', 'link', 'code-block'],
    ],
  };

  const formats = ['bold', 'italic', 'link', 'code-block'];

  const handleComment = (event: React.SetStateAction<string>) => {
    setComment(event);
  };

  function onChange(value: string): void {
    if (value) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }

  const addComment = async (newComment: NewComment) => {
    if (commentsList) {
      await postComment(
        newComment.postid,
        newComment.name,
        newComment.email,
        newComment.homepage,
        newComment.body,
      );

      dispatch(loadComments(postId));
    }
  };

  function compressImage(base64: string) {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');

    img.onload = () => {
      let { width } = img;
      let { height } = img;
      const maxHeight = 240;
      const maxWidth = 320;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height *= maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width *= maxHeight / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      ctx?.drawImage(img, 0, 0, width, height);

      const compressedData = canvas.toDataURL('image/jpeg', 0.7);

      setImageFile(`<img src=${compressedData}>`);
    };

    img.onerror = (err) => {
      throw new Error(err.toString());
    };

    img.src = base64;
  }

  function validateimg(files: FileList | null) {
    let fileUpload: File;

    if (files) {
      [fileUpload] = files;

      const regex = new RegExp('([a-zA-Z0-9_.-])+(.jpe?g|.png|.gif)$');

      if (regex.test(fileUpload.name.toLowerCase())) {
        if (typeof (fileUpload) !== 'undefined') {
          const reader = new FileReader();

          reader.readAsDataURL(fileUpload);
          reader.onload = (e) => {
            const originImg: HTMLImageElement = new Image();

            if (e.target) {
              originImg.src = `${e.target.result}`;
            }

            compressImage(originImg.src);
          };
        }
      }
    }
  }

  function validateTextFile(files: FileList | null) {
    let fileUpload: File;

    if (files) {
      [fileUpload] = files;
      const regex = new RegExp('([a-zA-Z0-9_.-])+(.txt)$');

      if ((regex.test(fileUpload.name.toLowerCase())) && (typeof (fileUpload) !== 'undefined')) {
        if (fileUpload.size <= 100) {
          setIsTextFileFit(true);
          const reader = new FileReader();

          reader.readAsText(fileUpload);
          reader.onload = (e) => {
            if (e.target) {
              setTextFile(`${e.target.result}`);
            }
          };
        } else {
          setIsTextFileFit(false);
        }
      }
    }
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name && email && comment && commentsList && isverified && isTextFileFit) {
      const newComment: NewComment = {
        postid: postId,
        name,
        email,
        homepage,
        body: `${comment + imageFile}<br>${textFile}`,
      };

      addComment(newComment);
      setError(false);
      setName('');
      setEmail('');
      setComment('');
      setHomePage('');
    } else {
      setError(true);
    }
  };

  function validateEmail(value: string) {
    if (!value) {
      return 'Email is required';
    }

    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailPattern.test(value)) {
      return 'Email is not valid';
    }

    return 'Email is right';
  }

  function validateUserName(value: string) {
    if (!value) {
      return 'UserName is required';
    }

    const usernamePattern = /^[a-zA-Z0-9]+$/;

    if (!usernamePattern.test(value)) {
      return 'UserName is not valid';
    }

    return 'UserName is right';
  }

  function validateHomePage(value: string) {
    if (value === '') {
      return 'HomePage is not required';
    }

    const homepagePattern = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/ig;

    if (!homepagePattern.test(value)) {
      return 'HomePage is not valid';
    }

    return 'HomePage is right';
  }

  function validateComment(value: string) {
    if (!value) {
      return 'Comment is required';
    }

    const commentPattern = /(?!<\/?((a|code|strong|i|p|em|span)).*?>)<.*?>/g;

    if (commentPattern.test(value)) {
      return 'You should use allowed tags(a/code/strong/i/p/em/span)';
    }

    return 'Text of comment is correct';
  }

  return (
    <form
      className="NewCommentForm"
      onSubmit={submitHandler}
    >
      <div className="form-field">
        <input
          type="text"
          name="name"
          required
          placeholder="UserName"
          value={name}
          className="NewCommentForm__input"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        {(validateUserName(name) === 'UserName is not valid' || validateUserName(name) === 'UserName is required')
          ? <p className="NewCommentForm__validate-username-error">{validateUserName(name)}</p>
          : <p className="NewCommentForm__validate-username-right">{validateUserName(name)}</p>}
      </div>

      <div className="form-field">
        <input
          type="email"
          name="email"
          required
          placeholder="E-mail"
          className="NewCommentForm__input"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        {(validateEmail(email) === 'Email is not valid' || validateEmail(email) === 'Email is required')
          ? <p className="NewCommentForm__validate-email-error">{validateEmail(email)}</p>
          : <p className="NewCommentForm__validate-email-right">{validateEmail(email)}</p>}
      </div>

      <div className="form-field">
        <input
          type="text"
          name="home-page"
          placeholder="Home page"
          className="NewCommentForm__input"
          value={homepage}
          onChange={(event) => {
            setHomePage(event.target.value);
          }}
        />
        {(validateHomePage(homepage) === 'HomePage is not valid')
          ? <p className="NewCommentForm__validate-homepage-error">{validateHomePage(homepage)}</p>
          : <p className="NewCommentForm__validate-homepage-right">{validateHomePage(homepage)}</p>}
      </div>

      <div className="form-field">
        <div>
          <ReactQuill
            placeholder="write comment here"
            modules={modules}
            className="NewCommentForm__editor"
            formats={formats}
            value={comment}
            onChange={handleComment}
          />
        </div>
        {(validateComment(comment) === 'You should use allowed tags(a/code/strong/i/p/em/span)' || validateComment(comment) === 'Comment is required')
          ? <p className="NewCommentForm__validate-comment-error">{validateComment(comment)}</p>
          : <p className="NewCommentForm__validate-comment-right">{validateComment(comment)}</p>}
      </div>

      <div className="form-field">
        <label
          htmlFor="image-file"
          className="NewCommentForm__input-file-img-label"
        >
          Choose an image-file to upload
        </label>
        <input
          id="image-file"
          type="file"
          name="file-img"
          accept=".jpg, .gif, .png"
          className="NewCommentForm__input-file-img button"
          onChange={(event) => {
            validateimg(event.target.files);
          }}
        />
      </div>

      <div className="form-field">
        <label
          htmlFor="text-file"
          className="NewCommentForm__input-file-text-label"
        >
          {isTextFileFit ? 'Choose a text-file to upload' : 'Choose file which is less 100kB'}
        </label>
        <input
          id="text-file"
          type="file"
          name="file-text"
          accept=".txt"
          className="NewCommentForm__input-file-text button"
          onChange={(event) => {
            validateTextFile(event.target.files);
          }}
        />
      </div>
      <button
        type="button"
        className="NewCommentForm__preview-button button"
        onClick={() => {
          setShowPreview(true);
        }}
      >
        Preview
      </button>
      {showPreview && (
        <Preview
          name={name}
          email={email}
          comment={`${comment + imageFile}<br>${textFile}`}
          setShowPreview={setShowPreview}
        />
      )}
      <div>
        <ReCAPTCHA
          sitekey={sitekey}
          onChange={onChange}
          size="compact"
        />
      </div>

      <button
        type="submit"
        className="NewCommentForm__submit-button button"
      >
        Add a comment
      </button>
      {error && (
        <div style={{ color: 'red' }}>
          Add correct data
        </div>
      )}
    </form>
  );
};

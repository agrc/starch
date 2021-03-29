import React from 'react';
import './Header.css';
import propTypes from 'prop-types';

function Header({ title }) {
  return (
    <div className="app__header">
      <h1 className="header__heading">
        <span>{title}</span>
        <a
          className="heading__version"
          href="https://github.com/agrc/broadband/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noreferrer"
        >
          {process.env.REACT_APP_VERSION}
        </a>
      </h1>
    </div>
  );
}
Header.propTypes = {
  title: propTypes.string.isRequired,
};

export default Header;

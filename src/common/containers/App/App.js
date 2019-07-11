import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';

import '../../css/reset.css';
import './App.scss';

@connect(
  (state) => ({
    config: state.config
  }),
  {}
)
class App extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    children: PropTypes.element
  };

  render() {
    const { children } = this.props;

    const head = {
      defaultTitle: 'Title',
      meta: [{ charset: 'utf-8' }]
    };

    return (
      <React.Fragment>
        <Helmet {...head} />
        <div className="container">{children}</div>
      </React.Fragment>
    );
  }
}

export default App;

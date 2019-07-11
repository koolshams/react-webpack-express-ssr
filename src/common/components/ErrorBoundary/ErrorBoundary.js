import React from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';

export class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (__CLIENT__) {
      superagent
        .post('/report-error')
        .send({
          message: error.message,
          stack: error.stack,
          componentStack: info.componentStack,
          url: window.location.href
        })
        .then(() => {
          if (!__DEVELOPMENT__) {
            window.location = process.env.ERROR_PAGE_URL;
          }
        })
        .catch(() => {
          if (!__DEVELOPMENT__) {
            window.location = process.env.ERROR_PAGE_URL;
          }
        });
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return '';
    }

    return children;
  }
}

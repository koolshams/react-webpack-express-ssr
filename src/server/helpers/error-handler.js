import config from 'config';

const errorPageUrl = config.get('errorPageUrl');

export function handleError(res, reason) {
  if (__DEVELOPMENT__) {
    res.send(reason);
  } else {
    res.redirect(302, errorPageUrl);
  }
}

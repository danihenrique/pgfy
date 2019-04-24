function isBase64(v, opts) {
  if (v instanceof Boolean || typeof v === 'boolean') {
    return false;
  }
  if (!(opts instanceof Object)) {
    opts = {};
  }
  // eslint-disable-next-line no-prototype-builtins
  if (opts.hasOwnProperty('allowBlank') && !opts.allowBlank && v === '') {
    return false;
  }
  // eslint-disable-next-line no-useless-escape
  let regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?';

  if (opts.mime) {
    regex = `(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)?${regex}`;
  }
  if (opts.paddingRequired === false) {
    regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?';
  }
  return (new RegExp(`^${regex}$`, 'gi')).test(v);
}

module.exports = isBase64;

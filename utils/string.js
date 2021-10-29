module.exports = {
  trim: ($str, $char = null) => {
    return $char 
      ? $str.replace(new RegExp('^\\'+$char+'+|\\'+$char+'+$', 'g'), '')
      : this.replace(/^\s+|\s+$/g, '');
  },
  toQueryStr: ($params) => {
    return $sortkey = Object.keys($params)
      .sort()
      .map(k => `${k}=${$params[k]}`)
      .join('&');
  }
}


const crypto = require('crypto');
const stringUtil = require('./string');

const signatureUtil = {
  sign:  (path, parameters = {}, secret, delay = 60) => {
    const expiration = Math.round(Date.now()/1000) + delay;
    parameters.expires = expiration;
    const signature = signatureUtil.hash(path, parameters, secret);
    parameters.signature = signature;
    return parameters;
  },
  verify: (path, parameters, secret) => {
    console.log('start');
    const params = {...parameters};
    const paramskeys = Object.keys(params);
    if(!['expires','signature'].every(k => paramskeys.includes(k))) {
      return '缺少参数';
    }
    if(Math.round(Date.now()/1000) > params['expires']) {
      return '时间过期';
    }
    const signatureInParams = params['signature'];
    delete params.signature;
    const signature = signatureUtil.hash(path, params, secret);
    if(signature !== signatureInParams) {
      return '验证失败';
    }
    return 0;
  },
  hash: (path, parameters, secret) => {
    const hmac = crypto.createHmac('sha256', secret);
    const original = stringUtil.trim(path,'/') + '?' + stringUtil.toQueryStr(parameters);
    hmac.update(original);
    return hmac.digest('hex');
  },
  uri: (path, parameters = {}, secret, delay = 6000) => {
    const params = signatureUtil.sign(path, parameters, secret, delay);
    return stringUtil.trim(path,'/') + '?' + stringUtil.toQueryStr(params);
  }
}

module.exports = signatureUtil;
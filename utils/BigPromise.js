const BigPromise = (theFunc) => (req, res, next) => {
  return Promise.resolve(theFunc(req, res, next)).catch(next);
};

module.exports = BigPromise;

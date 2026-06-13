const protect = (req, res, next) => {
  next(); // Just passes through for now
};

module.exports = { protect };

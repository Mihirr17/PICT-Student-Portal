
const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
      next(); // User is authenticated, proceed to the next middleware/route
    } else {
      res.status(401).json({ message: 'Unauthorized' }); // Not authenticated
    }
  };
  
  module.exports = authMiddleware;
  
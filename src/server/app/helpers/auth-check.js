const jwt = require('jsonwebtoken');
const config = require('../../config');

function checkAuth (req, res, data) {
    if (!req.headers.authorization) {
      return res.status(401).end();
    }
  
    const token = req.headers.authorization.split(' ')[1];
  
    return jwt.verify(token, config.secret, (err, decoded) => {
      // the 401 code is for unauthorized status
      if (err) { return res.status(401).end(); }
  
      const id = decoded.id;
  
      // check if a user exists
      let user = data.user.findAll({where: {
        id: id
      }});

      if (!user) {
        return res.status(401).end();
      }
    });
}

module.exports = checkAuth;
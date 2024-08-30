function restricted(req, res, next) {
    if (req.session.user) {
        next()
      } else {
        next({ status: 401, message: 'you cannot touch this!' })
      }
  }


module.exports = {
    restricted,
}
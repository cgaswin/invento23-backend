class CustomError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }

  static respond(err, res) {
    res.status(err.code).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = CustomError

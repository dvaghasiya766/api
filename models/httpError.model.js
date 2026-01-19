class httpError extends Error {
  constructor(message, errCode) {
    super(message); //Add a 'message' property
    this.code = errCode;
  }
}

module.exports = httpError;

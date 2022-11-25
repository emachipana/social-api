// possible execution errors
const ERRORS_STORE = {
  // handle malformed ObjectId
  CastError: (res) => {
    res.status(400).json({ message: "id used is malformed" });
  },
  // handle file not supported
  Error: (res, err) => {
    res.status(422).json({ message: err.message });
  },
  // handle validation error
  ValidationError: (res, err) => {
    res.status(422).json({ message: err.message });
  },
  // handle malformed token
  JsonWebTokenError: (res) => {
    res.status(422).json({ message: "invalid token" });
  },
  // in case no error match
  defaultError: (res, err) => {
    res.status(500).json({ message: "Unknow error, please try again", detail: err });
  }
}

function handleErrors(err, _req, res, _next) {
  console.error(err);

  // condition based on error name
  const handler = ERRORS_STORE[err.name] || ERRORS_STORE.defaultError;
  handler(res, err);
}

export default handleErrors;

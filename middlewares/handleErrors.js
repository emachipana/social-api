// possible execution errors
const ERRORS_STORE = {
  CastError: (res) => {
    res.status(400).json({ message: "id used is malformed" });
  },
  defaultError: (res, err) => {
    res.status(500).json({ message: "Unknow error, please try again", detail: err });
  }
}

function handleErrors(err, _req, res, _next) {
  console.error(err);

  const handler = ERRORS_STORE[err.name] || ERRORS_STORE.defaultError;
  handler(res, err);
}

export default handleErrors;

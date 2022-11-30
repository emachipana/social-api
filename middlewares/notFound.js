function notFound(_req, res) {
  res.status(404).json({ message: "Endpoint not found" });
}

export default notFound;

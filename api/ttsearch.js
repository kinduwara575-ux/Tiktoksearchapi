module.exports = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Query is required",
      example: "/api/ttsearch?query=music"
    });
  }

  return res.status(200).json({
    status: true,
    query: query,
    total: 0,
    results: []
  });
};
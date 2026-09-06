const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(400).json({
        status: false,
        message: "Query is required",
        example: "/api/ttsearch?query=music"
      });
    }

    /*
      Put your authorized TikTok/public search provider here.

      Example:
      const response = await axios.get(
        `YOUR_SEARCH_PROVIDER_URL?q=${encodeURIComponent(query)}`
      );

      const results = response.data.results || [];
    */

    const results = [];

    return res.status(200).json({
      status: true,
      query,
      total: results.length,
      results
    });

  } catch (error) {
    console.error("TikTok Search Error:", error.message);

    return res.status(500).json({
      status: false,
      message: "TikTok search failed"
    });
  }
};

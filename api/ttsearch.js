export default async function handler(req, res) {
  try {
    const q = req.query.q;

    if (!q || typeof q !== "string" || !q.trim()) {
      return res.status(400).json({
        status: false,
        message: "Search query is required"
      });
    }

    const searchUrl = new URL("https://www.google.com/search");

    searchUrl.search = new URLSearchParams({
      q: `site:tiktok.com "${q.trim()}"`,
      num: "20",
      hl: "en",
      gl: "us"
    });

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });

    const html = await response.text();

    if (!response.ok) {
      return res.status(502).json({
        status: false,
        message: `Search provider error: ${response.status}`
      });
    }

    const matches =
      html.match(
        /https?:\/\/(?:www\.)?tiktok\.com\/[^"'<>\\\s]+/gi
      ) || [];

    const results = [];
    const seen = new Set();

    for (let rawUrl of matches) {
      try {
        rawUrl = rawUrl
          .replace(/\\u003d/g, "=")
          .replace(/\\u0026/g, "&")
          .replace(/\\\//g, "/");

        const url = new URL(rawUrl);

        if (!/^(www\.)?tiktok\.com$/i.test(url.hostname)) {
          continue;
        }

        url.hash = "";

        const cleanUrl = url.toString();

        if (seen.has(cleanUrl)) continue;

        if (
          url.pathname.includes("/video/") ||
          /^\/@[^/]+\/video\//.test(url.pathname)
        ) {
          seen.add(cleanUrl);

          results.push({
            url: cleanUrl
          });
        }
      } catch {
        // Ignore invalid URLs
      }
    }

    return res.status(200).json({
      status: true,
      query: q.trim(),
      total: results.length,
      results
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: error.message || "Search failed"
    });
  }
}
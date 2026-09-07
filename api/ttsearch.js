export default async function handler(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Please enter a search query"
    });
  }

  try {
    const url = new URL("https://www.google.com/search");

    url.searchParams.set(
      "q",
      `site:tiktok.com "${query}"`
    );
    url.searchParams.set("num", "20");
    url.searchParams.set("hl", "en");
    url.searchParams.set("gl", "us");

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36"
      }
    });

    const html = await response.text();

    const urls =
      html.match(
        /https?:\/\/(?:www\.)?tiktok\.com\/[^"'<>\\\s]+/gi
      ) || [];

    const results = [];
    const seen = new Set();

    for (let item of urls) {
      item = item
        .replace(/\\u003d/g, "=")
        .replace(/\\u0026/g, "&")
        .replace(/\\\//g, "/");

      try {
        const parsed = new URL(item);

        if (!parsed.hostname.includes("tiktok.com")) continue;
        if (!parsed.pathname.includes("/video/")) continue;

        parsed.search = "";
        parsed.hash = "";

        const clean = parsed.toString();

        if (!seen.has(clean)) {
          seen.add(clean);
          results.push({
            url: clean
          });
        }
      } catch {}
    }

    return res.status(200).json({
      status: true,
      query,
      total: results.length,
      results
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
}

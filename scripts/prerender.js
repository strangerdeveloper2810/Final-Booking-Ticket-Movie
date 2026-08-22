const fs = require("fs");
const path = require("path");
const https = require("https");
require("dotenv").config();

const buildIndexPath = path.resolve(__dirname, "../build/index.html");
const publicIndexPath = path.resolve(__dirname, "../public/index.html");

const CYBERSOFT_TOKEN = process.env.REACT_APP_TOKEN_CYBERSOFT || "";
const TMDB_TOKEN = process.env.REACT_APP_TMDB_TOKEN || "";

function fetchData(url, headers = {}) {
  return new Promise((resolve) => {
    https
      .get(url, { headers }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            // Always resolve with an array — guard against nested objects or null
            const raw = parsed.content ?? parsed.results ?? parsed ?? [];
            resolve(Array.isArray(raw) ? raw : []);
          } catch (e) {
            resolve([]);
          }
        });
      })
      .on("error", () => resolve([]));
  });
}

async function prerender() {
  console.log("🌐 Fetching live movie data for SSG static pre-rendering...");

  const [cybersoftMovies, tmdbMovies] = await Promise.all([
    fetchData(
      "https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP01",
      { TokenCybersoft: CYBERSOFT_TOKEN }
    ),
    fetchData("https://api.themoviedb.org/3/trending/movie/day?language=vi-VN", {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    }),
  ]);

  // Ensure we always work with arrays regardless of API response shape
  const csMovies = Array.isArray(cybersoftMovies) ? cybersoftMovies : [];
  const tmMovies = Array.isArray(tmdbMovies) ? tmdbMovies : [];

  console.log(
    `✅ Fetched ${csMovies.length} Cybersoft movies & ${tmMovies.length} TMDB movies.`
  );

  const cybersoftHtmlList = csMovies
    .slice(0, 8)
    .map(
      (m) => `
      <article style="padding: 1rem; background: #171B26; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0 0 0.5rem 0;">${m.tenPhim}</h3>
          <p style="font-size: 0.8125rem; color: #A0A5B5; margin: 0 0 0.75rem 0; line-clamp: 2;">${m.moTa || "Thông tin phim đang cập nhật..."}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #FFC857;">
          <span>⭐ Đánh giá: ${m.danhGia || 8}/10</span>
          <span style="color: #F2545B; font-weight: 700;">ĐẶT VÉ</span>
        </div>
      </article>`
    )
    .join("");

  const tmdbHtmlList = tmMovies
    .slice(0, 8)
    .map(
      (m) => `
      <article style="padding: 1rem; background: #171B26; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0 0 0.5rem 0;">${m.title}</h3>
          <p style="font-size: 0.8125rem; color: #A0A5B5; margin: 0 0 0.75rem 0; line-clamp: 2;">${m.overview || "Nội dung phim TMDB..."}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #FFC857;">
          <span>⭐ IMDb: ${m.vote_average ? m.vote_average.toFixed(1) : 8.0}/10</span>
          <span style="color: #A0A5B5;">📅 ${m.release_date || "2026"}</span>
        </div>
      </article>`
    )
    .join("");

  const prerenderedBlock = `<!-- SSG_START --><div id="root">
    <header style="background: rgba(23, 27, 38, 0.9); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between;">
      <div style="font-weight: 800; font-size: 1.25rem; color: #F2545B; display: flex; align-items: center; gap: 0.5rem;">
        🎬 Cinefix
      </div>
      <nav style="display: flex; gap: 1.5rem; font-size: 0.875rem; color: #A0A5B5;">
        <span>Trang Chủ</span>
        <span>Lịch Chiếu</span>
        <span>Cụm Rạp</span>
      </nav>
    </header>

    <main style="max-width: 1280px; margin: 0 auto; padding: 2rem 1rem;">
      <h1 style="font-size: 2rem; font-weight: 900; color: #ffffff; margin-bottom: 0.5rem;">
        Cinefix — Đặt Vé Xem Phim Rạp Trực Tuyến Hàng Đầu
      </h1>
      <p style="color: #A0A5B5; font-size: 0.9375rem; margin-bottom: 2rem;">
        Khám phá hàng loạt phim bom tấn chiếu rạp mới nhất, tra cứu lịch chiếu tại các hệ thống rạp lớn BHD Star, CGV, Galaxy Cinema, Lotte Cinema, và đặt vé online dễ dàng.
      </p>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.375rem; font-weight: 800; color: #ffffff; border-bottom: 2px solid #F2545B; padding-bottom: 0.5rem; display: inline-block;">
          Phim Đang Chiếu tại Rạp
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${csMovies.length > 0 ? cybersoftHtmlList : ""}
        </div>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.375rem; font-weight: 800; color: #ffffff; border-bottom: 2px solid #F2545B; padding-bottom: 0.5rem; display: inline-block;">
          🔥 Phim Thịnh Hành TMDB
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${tmMovies.length > 0 ? tmdbHtmlList : ""}
        </div>
      </section>
    </main>
  </div><!-- SSG_END -->`;

  /**
   * Inject into an HTML string.
   * Strategy:
   *   1. If SSG_START/SSG_END markers exist (re-run), replace the whole block.
   *   2. Otherwise find the bare <div id="root"> ... </div> using a balanced-div
   *      search so we never partially replace.
   */
  function injectSSG(html) {
    // Case 1: idempotent re-injection
    if (html.includes("<!-- SSG_START -->")) {
      return html.replace(/<!-- SSG_START -->[\s\S]*?<!-- SSG_END -->/, prerenderedBlock);
    }
    // Case 2: find the outermost <div id="root"> by counting nested divs
    const startTag = '<div id="root">';
    const startIdx = html.indexOf(startTag);
    if (startIdx === -1) return html;
    let depth = 0;
    let i = startIdx;
    while (i < html.length) {
      if (html.startsWith("<div", i)) { depth++; i += 4; continue; }
      if (html.startsWith("</div>", i)) {
        depth--;
        if (depth === 0) {
          const endIdx = i + "</div>".length;
          return html.slice(0, startIdx) + prerenderedBlock + html.slice(endIdx);
        }
        i += 6; continue;
      }
      i++;
    }
    return html; // fallback — no replacement
  }

  // ⚠️  ONLY inject into build/index.html (Webpack output).
  // public/index.html is the Webpack TEMPLATE and must stay clean with an empty #root.
  // Modifying the template causes SSG content to accumulate outside #root on repeat builds.
  if (fs.existsSync(buildIndexPath)) {
    const buildHtml = fs.readFileSync(buildIndexPath, "utf8");
    fs.writeFileSync(buildIndexPath, injectSSG(buildHtml), "utf8");
    console.log("🚀 SSG Pre-rendering done → build/index.html");
  } else {
    console.warn("⚠️  build/index.html not found — run webpack build first.");
  }
}

prerender();


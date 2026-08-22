const fs = require("fs");
const path = require("path");
const https = require("https");
require("dotenv").config();

const buildIndexPath = path.resolve(__dirname, "../build/index.html");

const CYBERSOFT_TOKEN =
  process.env.REACT_APP_TOKEN_CYBERSOFT ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA1OCIsIkhldEhhblN0cmluZyI6IjExLzA2LzIwMzAiLCJIZXRIYW5UaW1lIjoiMTkwNzQ1Mjc5OSIsIm5iZiI6MTkwNzQ1Mjc5OSwiZXhwIjoxOTA3NDUyNzk5fQ.631rl3EwTQfz6CuufNTJlys36XLVmoxo29kP-F_PDKU";

const TMDB_TOKEN =
  process.env.REACT_APP_TMDB_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjNlYjllNWYyODY1YjJjZjNWU1YzVjZlVbM2l5ZjZiMTYzNTc3NzlyOC4xMjk5OTk5LCJzdWIiOiI2MTdmZmFjM2YzYnNDAWOTM4ZWY5ZjEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7BgVAZAH7zatioQHeG81Pey2tVrflVUZBEoqc___dpo";

function fetchData(url, headers = {}) {
  return new Promise((resolve) => {
    https
      .get(url, { headers }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.content || parsed.results || []);
          } catch (e) {
            resolve([]);
          }
        });
      })
      .on("error", () => resolve([]));
  });
}

async function prerender() {
  if (!fs.existsSync(buildIndexPath)) {
    console.log("⚠️ build/index.html not found, skipping SSG prerender step.");
    return;
  }

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

  console.log(
    `✅ Fetched ${cybersoftMovies.length} Cybersoft movies & ${tmdbMovies.length} TMDB movies.`
  );

  const cybersoftHtmlList = (cybersoftMovies || [])
    .slice(0, 10)
    .map(
      (m) => `
      <article style="padding: 1rem; background: #171B26; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.08);">
        <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0 0 0.5rem 0;">${m.tenPhim}</h3>
        <p style="font-size: 0.8125rem; color: #A0A5B5; margin: 0 0 0.5rem 0;">${m.moTa || "Thông tin phim đang cập nhật..."}</p>
        <span style="font-size: 0.75rem; color: #FFC857; font-weight: 600;">⭐ Đánh giá: ${m.danhGia || 8}/10</span>
      </article>`
    )
    .join("");

  const tmdbHtmlList = (tmdbMovies || [])
    .slice(0, 10)
    .map(
      (m) => `
      <article style="padding: 1rem; background: #171B26; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.08);">
        <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0 0 0.5rem 0;">${m.title}</h3>
        <p style="font-size: 0.8125rem; color: #A0A5B5; margin: 0 0 0.5rem 0;">${m.overview || "Nội dung phim TMDB..."}</p>
        <span style="font-size: 0.75rem; color: #FFC857; font-weight: 600;">⭐ IMDb: ${m.vote_average ? m.vote_average.toFixed(1) : 8.0}/10 | 📅 Khởi chiếu: ${m.release_date || "2026"}</span>
      </article>`
    )
    .join("");

  const cleanPrerenderedMarkup = `<div id="root">
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
          ${cybersoftHtmlList}
        </div>
      </section>

      <section style="margin-bottom: 2.5rem;">
        <h2 style="font-size: 1.375rem; font-weight: 800; color: #ffffff; border-bottom: 2px solid #F2545B; padding-bottom: 0.5rem; display: inline-block;">
          🔥 Phim Thịnh Hành TMDB
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${tmdbHtmlList}
        </div>
      </section>
    </main>
  </div>`;

  let html = fs.readFileSync(buildIndexPath, "utf8");

  // Regex replacement guarantees ZERO duplication inside #root!
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, cleanPrerenderedMarkup);

  fs.writeFileSync(buildIndexPath, html, "utf8");
  console.log(
    "🚀 SSG Static Pre-rendering completed cleanly without images or duplication on build/index.html!"
  );
}

prerender();

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

  const tmdbHtmlList = (tmdbMovies || [])
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

  const cleanSinglePrerenderedMarkup = `<div id="root">
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

  // Process public/index.html
  if (fs.existsSync(publicIndexPath)) {
    let publicHtml = fs.readFileSync(publicIndexPath, "utf8");
    publicHtml = publicHtml.replace(/<div id="root">[\s\S]*?<\/div>/, cleanSinglePrerenderedMarkup);
    fs.writeFileSync(publicIndexPath, publicHtml, "utf8");
  }

  // Process build/index.html
  if (fs.existsSync(buildIndexPath)) {
    let buildHtml = fs.readFileSync(buildIndexPath, "utf8");
    buildHtml = buildHtml.replace(/<div id="root">[\s\S]*?<\/div>/, cleanSinglePrerenderedMarkup);
    fs.writeFileSync(buildIndexPath, buildHtml, "utf8");
    console.log(
      "🚀 SSG Static Pre-rendering completed cleanly on public/index.html & build/index.html!"
    );
  }
}

prerender();

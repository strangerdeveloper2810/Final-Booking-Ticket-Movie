const fs = require("fs");
const path = require("path");
const https = require("https");
require("dotenv").config();

const buildIndexPath = path.resolve(__dirname, "../build/index.html");
const publicIndexPath = path.resolve(__dirname, "../public/index.html");

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

  const cybersoftHtmlCards = (cybersoftMovies || [])
    .slice(0, 8)
    .map(
      (m) => `
    <article style="background: #171B26; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: space-between;">
      <img src="${m.hinhAnh}" alt="${m.tenPhim}" style="width: 100%; height: 260px; object-fit: cover;" onerror="this.src='https://picsum.photos/300/400'" />
      <div style="padding: 1rem;">
        <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0 0 0.5rem 0;">${m.tenPhim}</h3>
        <p style="font-size: 0.75rem; color: #A0A5B5; margin: 0 0 0.75rem 0; line-clamp: 2;">${m.moTa || "Thông tin phim đang cập nhật..."}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #FFC857;">
          <span>⭐ ${m.danhGia || 8}/10</span>
          <span style="color: #F2545B; font-weight: 700;">ĐẶT VÉ</span>
        </div>
      </div>
    </article>`
    )
    .join("");

  const tmdbHtmlCards = (tmdbMovies || [])
    .slice(0, 8)
    .map(
      (m) => `
    <article style="background: #171B26; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: space-between;">
      <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" alt="${m.title}" style="width: 100%; height: 260px; object-fit: cover;" onerror="this.src='https://picsum.photos/300/400'" />
      <div style="padding: 1rem;">
        <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin: 0 0 0.5rem 0;">${m.title}</h3>
        <p style="font-size: 0.75rem; color: #A0A5B5; margin: 0 0 0.75rem 0; line-clamp: 2;">${m.overview || "Nội dung phim TMDB..."}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #FFC857;">
          <span>⭐ ${m.vote_average ? m.vote_average.toFixed(1) : 8.0}/10</span>
          <span style="color: #A0A5B5;">📅 ${m.release_date || "2026"}</span>
        </div>
      </div>
    </article>`
    )
    .join("");

  const fullPrerenderedMarkup = `<div id="root">
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
      <h1 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 0.5rem; color: #ffffff;">
        Cinefix — Đặt Vé Xem Phim Rạp Trực Tuyến Hàng Đầu
      </h1>
      <p style="color: #A0A5B5; font-size: 1rem; margin-bottom: 2rem;">
        Khám phá hàng loạt phim bom tấn chiếu rạp mới nhất, xem trailer HD, tra cứu lịch chiếu tại các hệ thống rạp lớn BHD Star, CGV, Galaxy Cinema, Lotte Cinema, và đặt vé online dễ dàng.
      </p>

      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #ffffff; border-bottom: 2px solid #F2545B; padding-bottom: 0.5rem; display: inline-block;">
          Phim Đang Chiếu tại Rạp
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
          ${cybersoftHtmlCards}
        </div>
      </section>

      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #ffffff; border-bottom: 2px solid #F2545B; padding-bottom: 0.5rem; display: inline-block;">
          🔥 Phim Thịnh Hành TMDB
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
          ${tmdbHtmlCards}
        </div>
      </section>
    </main>
  </div>`;

  // Inject into public/index.html as well for dev server
  if (fs.existsSync(publicIndexPath)) {
    let publicHtml = fs.readFileSync(publicIndexPath, "utf8");
    if (publicHtml.includes('<div id="root">')) {
      const rootStart = publicHtml.indexOf('<div id="root">');
      const rootEnd = publicHtml.indexOf("</div>", rootStart) + 6;
      publicHtml = publicHtml.substring(0, rootStart) + fullPrerenderedMarkup + publicHtml.substring(rootEnd);
      fs.writeFileSync(publicIndexPath, publicHtml, "utf8");
    }
  }

  // Inject into build/index.html if exists
  if (fs.existsSync(buildIndexPath)) {
    let buildHtml = fs.readFileSync(buildIndexPath, "utf8");
    if (buildHtml.includes('<div id="root">')) {
      const rootStart = buildHtml.indexOf('<div id="root">');
      const rootEnd = buildHtml.indexOf("</div>", rootStart) + 6;
      buildHtml = buildHtml.substring(0, rootStart) + fullPrerenderedMarkup + buildHtml.substring(rootEnd);
      fs.writeFileSync(buildIndexPath, buildHtml, "utf8");
      console.log(
        "🚀 SSG Static Pre-rendering with LIVE MOVIE CARDS completed successfully on build/index.html & public/index.html!"
      );
    }
  }
}

prerender();

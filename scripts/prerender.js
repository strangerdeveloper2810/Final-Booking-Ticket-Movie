const fs = require("fs");
const path = require("path");

const buildIndexPath = path.resolve(__dirname, "../build/index.html");

if (fs.existsSync(buildIndexPath)) {
  let html = fs.readFileSync(buildIndexPath, "utf8");

  // Ensure initial static prerendered HTML content exists inside #root if truncated by HtmlWebpackPlugin
  if (html.includes('<div id="root"></div>')) {
    const prerenderedBody = `<div id="root">
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
        </section>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #ffffff; border-bottom: 2px solid #F2545B; padding-bottom: 0.5rem; display: inline-block;">
            🔥 Phim Thịnh Hành TMDB
          </h2>
        </section>
      </main>
    </div>`;

    html = html.replace('<div id="root"></div>', prerenderedBody);
    fs.writeFileSync(buildIndexPath, html, "utf8");
    console.log("✅ SSG Static Pre-rendering completed successfully on build/index.html");
  }
} else {
  console.log("⚠️ build/index.html not found, skipping SSG prerender step.");
}

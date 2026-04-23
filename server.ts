import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function start() {
  const app = express();
  const PORT = 3000;

  console.log("Menyiapkan server wrapper...");

  // Health check untuk diagnostik
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Berjalan dalam mode DEVELOMENT dengan Vite Middleware");
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Berjalan dalam mode PRODUCTION");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Handle SPA routing secara eksplisit
  app.use('*', async (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    // Untuk pengembangan, biarkan Vite menangani sisa rute
    next();
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> SERVER AKTIF DI: http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error("GAGAL MENYALAKAN SERVER:", err);
  process.exit(1);
});

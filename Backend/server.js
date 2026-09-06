app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = [
      "http://localhost:5173",
      "https://techtonic-final.vercel.app",
      "https://techtonic-final.onrender.com"
    ];
    if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true); // phone theke block korbe na
    }
  },
  credentials: true
}));
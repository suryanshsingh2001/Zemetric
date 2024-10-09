const CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/",
};

console.log(CONFIG.BASE_URL);

export default CONFIG;

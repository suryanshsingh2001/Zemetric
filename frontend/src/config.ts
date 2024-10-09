const CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/",
  GITHUB_URL: "https://github.com/suryanshsingh2001/Zemetric"
};

console.log(CONFIG.BASE_URL);

export default CONFIG;

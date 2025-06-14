// frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: []
};

// frontend/src/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { @apply bg-gradient-to-br from-gray-100 to-gray-200; }

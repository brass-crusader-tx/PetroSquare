/** @type {import('tailwindcss').Config} */
const sharedConfig = require("@petrosquare/config/tailwind.config.js");

module.exports = {
  ...sharedConfig,
  content: [
    ...sharedConfig.content,
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/app/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif", "Arial"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
    },
  },
};

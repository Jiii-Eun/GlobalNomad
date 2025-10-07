const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-pxtorem": {
      rootValue: 16, // 1rem = 16px 기준
      unitPrecision: 5,
      propList: ["*"],
      selectorBlackList: [], // 변환 제외할 선택자 없음
      replace: true, // px 대신 rem으로 대체
      mediaQuery: false,
      minPixelValue: 0,
      exclude: /node_modules/i,
    },
  },
};

export default config;

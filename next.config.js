const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  basePath: "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-sgn09.fptcloud.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

};

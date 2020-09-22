module.exports = {
  configureWebpack: {
    plugins: [],
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "shenzilong.cn",
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
        win: {
          icon: "./public/favicon.ico",
        },
        mac: {
          icon: "./public/favicon.ico",
        },
        linux: {
          icon: "./public/favicon.ico",
        },
      },
    },
  },
};

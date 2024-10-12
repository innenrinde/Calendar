const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/calendar/assets/templates/default/_variables.scss";
          @import "@/calendar/assets/templates/default/_frames";
        `
      }
    }
  }
})

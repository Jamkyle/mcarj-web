module.exports = {
  type: 'web-app',
  webpack : {
    extra:{
      resolve: {
        alias: {
          'ScrollMagicGSAP': 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
        }
      }
    }
  }
}

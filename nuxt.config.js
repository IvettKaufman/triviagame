import colors from 'vuetify/es5/util/colors';
import apikeys from './assets/apikeys';

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - land-invaders',
    title: 'land-invaders',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: apikeys.apikeys.apiKey,
          authDomain: apikeys.apikeys.authDomain,
          projectId: apikeys.apikeys.projectId,
          storageBucket: apikeys.apikeys.storageBucket,
          messagingSenderId: apikeys.apikeys.messagingSenderId,
          appId: apikeys.apikeys.appId,
          measurementId: apikeys.apikeys.measurementId
        },
        services: {
          firestore: {
            enablePersistence: false
          },
          functions: false
        }
      }
    ]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    defaultAssets: {
      font: {
        family: 'Julius Sans One'
      }
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#343435", //pop-up window colour
          accent: "FFFFFF", // icons, question boxes and letters colour on dark background
          secondary: "#000000", // letter colour on white background and username and game input boxes
          info: "#D7BE69", // player 1
          warning: "#E3AEB1", // player 2
          error: "#AAA9AD", // player 3
          success: "#A97142" // player 4
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}

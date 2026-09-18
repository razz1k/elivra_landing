import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

const APP_ENTRY = resolve(import.meta.dirname, 'src/main.ts')
const LOADER_MARKER = '<!-- deferred-app -->'

function deferredAppLoader(): Plugin {
  return {
    name: 'deferred-app-loader',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        let jsUrl = '/src/main.ts'
        let cssUrl = ''

        if (ctx.bundle) {
          const appChunk = Object.values(ctx.bundle).find(
            (item) =>
              item.type === 'chunk' &&
              item.isEntry &&
              item.facadeModuleId === APP_ENTRY,
          )

          if (!appChunk || appChunk.type !== 'chunk') {
            throw new Error('deferred-app-loader: app entry chunk not found')
          }

          jsUrl = `/${appChunk.fileName}`
          const cssFile = [...(appChunk.viteMetadata?.importedCss ?? [])][0]
          if (cssFile) {
            cssUrl = `/${cssFile}`
          }
        }

        const script = `<script>
(function () {
  var events = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel']
  var loaded = false
  var jsUrl = ${JSON.stringify(jsUrl)}
  var cssUrl = ${JSON.stringify(cssUrl)}

  function loadApp() {
    if (loaded) return
    loaded = true
    for (var i = 0; i < events.length; i++) {
      window.removeEventListener(events[i], loadApp)
    }

    function loadJs() {
      import(jsUrl)
    }

    if (!cssUrl) {
      loadJs()
      return
    }

    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = cssUrl
    link.onload = loadJs
    link.onerror = loadJs
    document.head.appendChild(link)
  }

  for (var j = 0; j < events.length; j++) {
    window.addEventListener(events[j], loadApp, { passive: true })
  }
})()
</script>`

        if (!html.includes(LOADER_MARKER)) {
          throw new Error(`deferred-app-loader: missing ${LOADER_MARKER}`)
        }

        return html
          .replace(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>\s*/g, '')
          .replace(LOADER_MARKER, script)
      },
    },
  }
}

export default defineConfig({
  plugins: [deferredAppLoader()],
  build: {
    modulePreload: false,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        app: APP_ENTRY,
      },
    },
  },
})

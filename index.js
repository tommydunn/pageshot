const Koa = require('koa')
const Nightmare = require('nightmare')

const PORT = process.env.PORT || 3003

const serveIntroHTML = async (ctx, next) => {
  if (!ctx.query.url) {
    ctx.body = require('fs').readFileSync('./intro.html', 'utf-8')
  } else {
    await next()
  }
}

const screenshotService = async ctx => {
  if (!ctx.query.url) return

  try {
    const { url, height, width } = ctx.query
    console.log(ctx.query)
    console.log(Nightmare)
    const result = await Nightmare({gotoTimeout: 6000})
      .viewport(parseInt(width) || 960, parseInt(height) || 640)
      .goto(url)
      .screenshot()
      .end()

    ctx.res.setHeader('Content-Type', 'image/png')
    ctx.body = result
  } catch (e) {
    ctx.body = e.stack ? e.stack.toString() : JSON.stringify(e)
    console.error(ctx.body)
  }
}

const app = new Koa()
app.use(serveIntroHTML)
app.use(screenshotService)
app.listen(PORT)

process.on('uncaughtException', (err) => {
  console.error(`Caught exception: ${err}`)
})

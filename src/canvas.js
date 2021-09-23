// Visualizations of linearithmic and quadratic dense layers.
const N = 256
draw(newCtx(500, 300), N, fullLayers(N, 1))
draw(newCtx(500, 300), N, hyperLayers(N, 4, 1))


function newCtx(w, h) {
  const ctx = document.body.appendChild(document.createElement('canvas')).getContext('2d')
  ctx.canvas.width = w, ctx.canvas.height = h
  return ctx
}

function fullLayers(N = 16, layers = 1) {
  const res = []
  for (let L = 0; L < layers; ++L)
    res.push(function fullLayer(connect, from, to) {
      for (let i = 0; i < from; ++i)
        for (let j = 0; j < to; ++j)
          connect(i, j)
    })
  return res
}

function hyperLayers(N = 16, n = 2, layers = 1) {
  const res = []
  for (let L = 0; L < layers; ++L) {
    const subs = Math.ceil(Math.log(N) / Math.log(n) - 1e-8)
    for (let sub = 0; sub < subs; ++sub)
      res.push(function logLayer(connect, from, to) {
        const stride = n ** sub
        for (let to = 0; to < N; ++to) {
          let batch_id = to % stride + (to / (n*stride) | 0) * n*stride
          for (let i = 0, from = batch_id; i < n && from < N; ++i, from += stride)
            connect(from, to)
        }
      })
  }
  return res.reverse()
}

function draw(ctx, n = 16, layers = [], radius = 4) {
  const lineW = 1
  const w = ctx.canvas.width - 2*(radius+lineW), h = ctx.canvas.height - 2*(radius+lineW)
  const offsetX = radius+lineW, offsetY = radius+lineW
  ctx.fillStyle = 'lightgray', ctx.strokeStyle = 'gray', ctx.lineWidth = lineW
  let prevProgress = 0, nextProgress = 0
  for (let L = 0; L <= layers.length; ++L) {
    prevProgress = L / layers.length, nextProgress = (L+1) / layers.length
    // Connect layers as they define.
    if (L < layers.length)
      layers[L](connect, n, n)
  }
  for (let L = 0; L <= layers.length; ++L) {
    prevProgress = L / layers.length, nextProgress = (L+1) / layers.length
    // Draw circles.
    for (let j = 0; j < n; ++j) {
      const x = offsetX + prevProgress * w, y = offsetY + j / (n-1 || 1) * h
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2*Math.PI)
      ctx.fill()
      ctx.stroke()
    }
  }
  return ctx
  function connect(from, to) {
    const fromX = offsetX + prevProgress * w, fromY = offsetY + from / (n-1 || 1) * h
    const toX = offsetX + nextProgress * w, toY = offsetY + to / (n-1 || 1) * h
    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke()
  }
}

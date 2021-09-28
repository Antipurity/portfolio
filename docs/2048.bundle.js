/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./small_projects/2048/2048.css":
/*!**************************************!*\
  !*** ./small_projects/2048/2048.css ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./small_projects/2048/2048.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _2048_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./2048.css */ "./small_projects/2048/2048.css");
const e = React.createElement
;



class Site extends React.Component {
  constructor(props) {
    super(props)
    const R = React.createRef
    this.plots = {
      numCount: R(),
      nums: R(),
      numSqrs: R(),
    }
  }
  render() {
    return e(
      'div',
      { className: 'site', },
      e(
        Grid,
        { key:'grid', w:4, h:4, plots:this.plots },
      ),
      e(
        'div',
        { className:'plots' },
        e(Plot, { ref:this.plots.numCount, data:[], aspectRatio:2, hint:'How many tiles are present.' }),
        e(Plot, { ref:this.plots.nums, data:[], aspectRatio:2, hint:'Sum of tiles.' }),
        e(Plot, { ref:this.plots.numSqrs, data:[], aspectRatio:2, hint:'Sum of squares of tiles.' }),
      ),
    )
  }
}



class Grid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: props.w,
      height: props.h,
      nums: [],
      keys: [],
    }
    this.onkeydown = this.onkeydown.bind(this)
    this.shift = this.shift.bind(this)
    this.timeout = null
  }
  render() {
    const fg = [], bg = [], s = this.state, w = s.width, h = s.height
    if (s.nums.length !== w*h)
      s.nums.length = s.keys.length = w*h, s.nums.fill(0), s.keys.fill(''), this.newRandomCell()
    for (let y = 0; y < s.height; ++y)
      for (let x = 0; x < s.width; ++x)
        if (s.nums[y*w + x]) {
          const at = y*w + x
          fg.push(e(Cell, { key: s.keys[at], x,y,w,h, n: s.nums[at], foreground: true })),
          bg.push(e(Cell, { key: s.keys[at], x,y,w,h, n: s.nums[at], foreground: false }))
        }
    const L = this.shift('left', null, true)
    const R = this.shift('right', null, true)
    const U = this.shift('up', null, true)
    const B = this.shift('down', null, true)
    if (!L && !R && !U && !B && this.timeout === null)
        this.timeout = setTimeout(() => {
          this.timeout = null
          this.state.nums.length = 0
          this.forceUpdate()
        }, 3000)
    return e(
      'div',
      { className: 'grid', },
      e(
        Buttons,
        {
          shift: this.shift,
          left: L, right: R, up: U, down: B,
        },
      ),
      e(
        'div',
        { className: 'grid-background', },
        ...bg,
      ),
      e(
        'div',
        { className: 'grid-foreground', },
        ...fg,
      ),
    )
  }
  onkeydown(evt) {
    if (evt.key === 'ArrowLeft') this.shift('left', evt)
    if (evt.key === 'ArrowRight') this.shift('right', evt)
    if (evt.key === 'ArrowUp') this.shift('up', evt)
    if (evt.key === 'ArrowDown') this.shift('down', evt)
  }
  componentDidMount() { document.body.addEventListener('keydown', this.onkeydown) }
  componentWillUnmount() { document.body.removeEventListener('keydown', this.onkeydown) }
  shift(dir, evt, dry = false) {
    // (Shifting down appears to re-create cells. We handle keys correctly; seems to be React's problem.)
    evt && evt.preventDefault()
    if (dir === 'left' || dir === 'right') this.transpose()
    if (dir === 'down' || dir === 'right') this.vertFlip()
    const dirty = this.shiftUp(dry)
    if (dir === 'down' || dir === 'right') this.vertFlip()
    if (dir === 'left' || dir === 'right') this.transpose()
    if (!dirty) return
    if (dry) return dirty
    this.newRandomCell(Math.random()<.2 ? 4 : 2)

    // Update plots.
    let nums = this.state.nums, p = this.props.plots, cnt = 0, sum = 0, sum2 = 0
    for (let i = 0; i < nums.length; ++i)
      cnt += nums[i] ? 1 : 0, sum += nums[i], sum2 += nums[i]*nums[i]
    p.numCount.current.props.data.push(cnt)
    p.numCount.current.forceUpdate()
    p.nums.current.props.data.push(sum)
    p.nums.current.forceUpdate()
    p.numSqrs.current.props.data.push(sum2)
    p.numSqrs.current.forceUpdate()

    this.forceUpdate()
  }
  newCell(x,y, n) {
    const k = ''+Math.random(), at = y * this.state.width + x
    this.state.nums[at] = n, this.state.keys[at] = k
  }
  newRandomCell(n = 2) {
    const s = this.state, free = []
    for (let i = 0; i < s.nums.length; ++i)
      if (!s.nums[i]) free.push(i)
    if (!free.length)
      return s.nums.fill(0), s.keys.fill(''), this.forceUpdate()
    const i = free[Math.random() * free.length | 0], w = s.width
    const x = i % w, y = i / w | 0
    this.newCell(x, y, n)
  }
  printKeys() { // For debugging.
    const s = this.state, keys = s.keys, w = s.width, h = s.height
    if (!this.chars) this.chars = Object.create(null), this.n = 0
    let out = ''
    for (let y = 0, at = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x, ++at)
        out += !keys[at] ? ' ' : this.chars[keys[at]] || (this.chars[keys[at]] = ''+(this.n++ % 10))
      out += '\n'
    }
    console.log(out)
  }
  shiftUp(dry = false) {
    // Shift cells down, adding same-value cells into one.
    const s = this.state, nums = s.nums, keys = s.keys, w = s.width, h = s.height
    let dirty = false
    for (let x = 0; x < w; ++x)
      for (let y1 = 1; y1 < h; ++y1)
        if (nums[y1*w + x])
          for (let y2 = y1; y2 > 0; --y2) {
            const at = y2*w + x, to = at - w
            if (!nums[to] || nums[to] === nums[at]) {
              if (dry) return true
              nums[to] += nums[at], keys[to] = keys[at]
              nums[at] = 0, keys[at] = ''
              dirty = true
            }
          }
      return dirty
  }
  transpose() {
    // Transpose cell state.
    const s = this.state, nums = s.nums, keys = s.keys, w = s.width, h = s.height
    for (let y = 0; y < h; ++y)
      for (let x = 0; x < w && x < y; ++x) {
        const i = y*w + x, j = x*w + y
        ;[nums[i], nums[j]] = [nums[j], nums[i]]
        ;[keys[i], keys[j]] = [keys[j], keys[i]]
      }
  }
  vertFlip() {
    // Vertically flip cell state.
    const s = this.state, nums = s.nums, keys = s.keys, w = s.width, h = s.height
    for (let y = 0; y*2 < h; ++y)
      for (let x = 0; x < w; ++x) {
        const i = y*w + x, j = (h - y - 1)*w + x
        ;[nums[i], nums[j]] = [nums[j], nums[i]]
        ;[keys[i], keys[j]] = [keys[j], keys[i]]
      }
  }
}



class Buttons extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const p = this.props, shift = p.shift
    const W = '5em'
    return [
      e(
        'button',
        {
          key:'left',
          disabled: !p.left,
          onClick: evt => shift('left', evt),
          style:{ width:W, left:'-'+W, height:'100%', top:0, },
        },
        '🡄',
      ),
      e(
        'button',
        {
          key:'right',
          disabled: !p.right,
          onClick: evt => shift('right', evt),
          style:{ width:W, left:'100%', height:'100%', top:0, },
        },
        '🡆',
      ),
      e(
        'button',
        {
          key:'up',
          disabled: !p.up,
          onClick: evt => shift('up', evt),
          style:{ width:'100%', left:0, height:W, top:'-'+W, },
        },
        '🡅',
      ),
      e(
        'button',
        {
          key:'down',
          disabled: !p.down,
          onClick: evt => shift('down', evt),
          style:{ width:'100%', left:0, height:W, top:'100%', },
        },
        '🡇',
      ),
    ]
  }
}



class Cell extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { x,y,w,h, n, foreground } = this.props
    const color = {
      [2** 0]: 'none',
      [2** 1]: '#50a91e',
      [2** 2]: '#839921',
      [2** 3]: '#a19a18',
      [2** 4]: '#c4b532',
      [2** 5]: '#9d9126',
      [2** 6]: '#a9862c',
      [2** 7]: '#ba9024',
      [2** 8]: '#c2912e',
      [2** 9]: '#c8862c',
      [2**10]: '#b26814',
      [2**11]: '#ab561f',
      [2**12]: '#a9411d',
      [2**13]: '#ab2727',
      [2**14]: '#a1223c',
      [2**15]: '#ab3055',
      [2**16]: '#9d2157',
      [2**17]: '#a3327d',
      [2**18]: '#992482',
      [2**19]: '#b037a3',
      [2**20]: '#b81bbe',
      [2**21]: '#a625ca',
      [2**22]: '#8d15d0',
      [2**23]: '#651edf',
      [2**24]: '#1c13db',
      [2**25]: '#1a4beb',
      [2**26]: '#107adf',
      [2**27]: '#15a9e9',
      [2**28]: '#06efe0',
      [2**29]: '#00ff00',
    }
    return e(
      'div',
      {
        className: 'cell',
        style:{
          left: (x / w * 100) + '%',
          top: (y / h * 100) + '%',
          width: (1 / w * 100) + '%',
          height: (1 / h * 100) + '%',
          backgroundColor: foreground ? 'none' : color[n]
        },
      },
      foreground ? ''+n : '',
    )
  }
}



class Plot extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const p = this.props, data = p.data, len = data.length, ar = p.aspectRatio, hint = p.hint
    if (len <= 1) return null
    let min = Infinity, max = -Infinity
    for (let i = 0; i < len; ++i)
      if (data[i] < min) min = data[i]
      else if (data[i] > max) max = data[i]
    const W = 100*ar
    let d = 'M 0,100 '
    for (let i = 0; i < len; ++i) {
      const x = i / (len-1) * W
      const y = 100 - ((data[i] - min) / (max - min)) * 100
      d += 'L ' + x + ',' + y + ' '
    }

    const score_0_1 = (data[data.length] - min) / (max - min)
    typeof directScore != ''+void 0 && directScore(score_0_1 * 2 - 1)

    d += 'L ' + W + ',100 Z'
    return e(
      'div',
      { className:'plot', title:hint },
      e(
        'svg',
        { width:'100%', height:'100%', viewBox:'0 0 ' + W + ' 100' },
        e(
          'path',
          { d },
        ),
      ),
    )
  }
}



self.Site = Site
})();

/******/ })()
;
//# sourceMappingURL=2048.bundle.js.map
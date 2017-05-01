'use strict'

let header =
`<nav>
  <ul>
    <li>
      <input id="menu__toggle" class="menu__toggle" type="checkbox">
      <label id="menu__toggle-label" for="menu__toggle">toggle menu</label>
      <nav id="menu__nav"></nav>
    </li>
    <li id="logo"><a href="index.html">lbcFeed</a></li>
    <li>
      <a id="stats-link" href="stats.html">
        <button type="button"><span>stats</span></button>
      </a>
    </li>
  </ul>
</nav>`

render('header', header)

'use strict'

const confirmPassword =
  `<div>
    <label for="confirm">确认密码</label>
    <input type="password" name="confirm">
  </div>`

const states = [
  ['signin', 'signup'],
  ['', confirmPassword],
  ['新用户?', '已有账号?'],
  ['登录', '注册']
]

/* Components. */
let isSignup = true
tabsToggle()  // first render

function tabsToggle () {
  try {
    document.body.removeChild(document.querySelector('form'))
  } catch (e) { /* nop */ }

  isSignup = !isSignup

  const [
    formClass,
    entryConfirm,
    toggleText,
    submitText
  ] = states.map(s => s[!!isSignup * 1])

  const form =
    `<form class="${formClass}">
      <div>
        <label for="username">用户名</label>
        <input type="text" name="username">
      <div/>
      <div>
        <label for="password">密码</label>
        <input type="password" name="password">
      </div>
      ${entryConfirm}
      <a id="toggle" href="#">${toggleText}</a>
      <button id="submit" type="button">${submitText}</button>
    </form>`

  document.body.insertAdjacentHTML('afterbegin', form)

  /* Listeners. */

  // FIXME: Adding listeners everytime it toggles.  BTW, it should be checked
  // that the `form' element being removed with the event listeners, otherwise
  // there will be memory leaks.

  // NOTE: As the following code are reference-free, GC is guaranteed.
  document.getElementById('toggle').addEventListener('click', _ => {
    tabsToggle()
  })

  document.getElementById('submit').addEventListener('click', _ => {
    let form = document.querySelector('form')
    let formData = new FormData(form)
  })
}


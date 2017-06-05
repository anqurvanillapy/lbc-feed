'use strict'

let [login, index] = ['login', 'index'].map(p => url.format({
  pathname: `${path.join(__dirname, p)}.html`,
  protocol: 'file:',
  slashes: true
}))

/* User profile. */

const homedir = require('os').homedir
const fpath = path.join(homedir(), '.lbc-feed')

let profile

try {
  profile = JSON.parse(fs.readFileSync(fpath))
} catch (e) {
  profile = {}
  fs.writeFileSync(fpath, JSON.stringify(profile) + '\n')
}

/* Templates. */

const confirmPassword =
  `<div>
    <label for="confirm">确认密码</label>
    <input type="password" name="confirm">
  </div>`

const toggleStates = [
  ['', confirmPassword],
  ['新用户?', '已有账号?'],
  ['登录', '注册']
]

/* Components. */

let isSignin = false
tabsToggle()  // first render

function tabsToggle () {
  try {
    document.body.removeChild(document.querySelector('form'))
  } catch (e) { /* nop */ }

  const [
    entryConfirm,
    toggleText,
    submitText
  ] = toggleStates.map(s => s[!!isSignin * 1])

  const form =
    `<form>
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

  // FIXME: Adding listeners every time it toggles.  BTW, it should be checked
  // that the `form' element being removed with the event listeners, otherwise
  // there will be memory leaks.

  // NOTE: As the following code are reference-free, GC is guaranteed.
  let toggle = document.getElementById('toggle')
  let submit = document.getElementById('submit')

  toggle.addEventListener('click', tabsToggle)
  submit.addEventListener('click', _ => {
    let form = document.querySelector('form')

    // Simple form validation.
    for (let [_, v] of new FormData(form).entries()) {
      if (!v) {
        insertMsg(form, '表格未填写完整')
        return
      } else if (!/^[a-z0-9]+$/i.test(v)) {
        insertMsg(form, '用户名或密码包含非英文字符或数字')
        return
      }
    }

    // NOTE: Sweet code but does not meet the need now :(.  FormData.values()
    // returns an Iterator.

    // let fvals = [... new FormData(form).values()]
    // if (fvals.filter(Boolean).length !== fvals.length) {
    //   insertMsg(form, '表格未填写完整')
    //   return
    // }

    if (isSignin) {
      let saltHash = profile[form.username.value]

      if (!saltHash) {
        insertMsg(form, '该用户不存在')
        return
      }

      if (!checkPassword(form.password.value, saltHash)) {
        insertMsg(form, '密码错误, 请重试')
        return
      }

      submit.disabled = true
      insertMsg(form, '登录成功', true)
      console.log('sign in!')
      setTimeout(_ => {
        window.location.replace(`${index}?username=${form.username.value}`)
      }, 1000)
    } else {
      if (form.password.value !== form.confirm.value) {
        insertMsg(form, '输入的密码不一致')
        return
      }

      if (profile[form.username.value]) {
        insertMsg(form, '该用户已存在')
        return
      }

      profile[form.username.value] = saltHashPassword(form.password.value)
      fs.writeFileSync(fpath, JSON.stringify(profile) + '\n')
      submit.disabled = true
      insertMsg(form, '注册成功', true)
      console.log('sign up!')
      setTimeout(_ => { window.location.replace(login) }, 1000)
    }
  })

  // Toggle.
  isSignin = !isSignin
}

function insertMsg (root, msg, isSuccess) {
  let elem = document.getElementById('errmsg')
  let color = (isSuccess) ? 'forestgreen' : 'maroon'

  if (elem) root.removeChild(elem)
  elem = `<p id="errmsg" style="color: ${color};"><em>${msg}</em></p>`
  root.insertAdjacentHTML('beforeend', elem)
}

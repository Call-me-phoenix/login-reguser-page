const signUpButton = document.getElementById('signUp')
const signInButton = document.getElementById('signIn')
const container = document.getElementById('container')

const signUpForm = document.getElementById('signUpForm')
const signInForm = document.getElementById('signInForm')

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active")
})

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active")
})

signInForm.addEventListener('submit', function (e) {
  e.preventDefault()
  let xhr = new XMLHttpRequest()
  let data = {
    username: this.username.value,
    password: this.password.value
  }
  let formData = ''
  for (let key in data) {
    formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
  }
  formData = formData.slice(0, -1)//删掉字符串最后的一个'&'
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let resData = JSON.parse(this.response)
      if (resData.status == 0) {
        window.location = 'https://www.bilibili.com'
      } else {
        alert(resData.message)
      }
    }
  }
  xhr.open('POST', 'http://127.0.0.1:3007/api/login', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(formData)
})

signUpForm.addEventListener('submit', function (e) {
  e.preventDefault()
  let xhr = new XMLHttpRequest()
  let data = {
    username: this.username.value,
    password: this.password.value,
    email: this.email.value
  }
  let formData = ''
  for (let key in data) {
    formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
  }
  formData = formData.slice(0, -1)//删掉字符串最后的一个'&'
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let resData = JSON.parse(this.response)
      if (resData.status == 0) {
        alert(resData.message)
        // alert('注册成功！')
        window.location.reload()
      } else {
        alert(resData.message)
      }
    }
  }
  xhr.open('POST', 'http://127.0.0.1:3007/api/reguser', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(formData)
})
'use strict';
var loginSuccess = false

function showMessage(message, className="success") {
  $("#submit").prop('disabled', false)
  $("#message").text(message).removeClass().addClass(className)
}

async function loginWsm() {
  var email, password;

  var getInfoPromies = new Promise(function(resolve, reject){
    chrome.storage.local.get('remain_unchanged_user', (data) => {
      resolve(data)
    })
  })
  var data = await getInfoPromies

  email = data.remain_unchanged_user.email
  password = data.remain_unchanged_user.password

  if(email == "" || password == "") {
    showMessage("Email hoặc mật khẩu không chính xác.", "error")
    return loginSuccess
  }

  // clear current cookies
  var clearCookiesPromies = new Promise(function(resolve, reject){
    chrome.cookies.getAll({domain: "sun-asterisk.vn"}, (cookies)=>{
      cookies.forEach((cookie) =>{
        chrome.cookies.remove({url: "https://" + cookie.domain , name: cookie.name})
      })
      resolve(cookies.forEach((cookie) =>{
        chrome.cookies.remove({url: "https://" + cookie.domain , name: cookie.name})
      }))
    })
  })
  var data = await clearCookiesPromies

  // login
  var setCookiesPromies = new Promise(function(resolve, reject){
    resolve(chrome.cookies.set({
      name: "_wsm_02_session",
      url: "http://wsm.sun-asterisk.vn",
      value: "aG5NL0ZSR0M1amdlZnVWWUdUY3JZQWgvQlJEa0tCckRsOWQvL09VUDZnSzlKalFzU3cvaW91Z245U1ljekpYUWJ1c0Z1T3A5dTZYQlFPeFVXSkZRdWtzOFVXNC9wUWtFMmc0bjRzN1c3VjFFL1M2cTlMdnBDQmNlWUxQaGZTZlJrdjJDSFZUdjB3THlHa0VXWGtOSXFBPT0tLTJ6NWs3b252b29rWXhtK0kvcnpSb2c9PQ%3D%3D--7ae38e62d95eb0c215ea53d096857a5d428b0b88"
    }))
  })
  var data = await setCookiesPromies

  function wsmLoginSuccess(data, textStatus, xhr) {
    let contentType = xhr.getResponseHeader("Content-Type")
    if(contentType.match(/application\/json/)){
      if(data.success) {
        loginSgoal()
      } else {
        showMessage(data.message, "error")
      }
    }
    if(contentType.match(/text\/html/)){
      loginSgoal()
    }
  }

  var wsmLoginSettings = {
    url: "https://wsm.sun-asterisk.vn/vi/users/sign_in",
    method: "POST",
    xhrFields: {
      withCredentials: true
    },
    async: false,
    headers: {
      "X-CSRF-Token": "VxfgIWM99d5nGl4gDR2W/LIxIG7gH9DzImFXUH4t+qDb/Genf4a3SoQAkTkwBhcFaIwf9U2Nq7o9z4kxTDt83g==",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      "user[email]": email,
      "user[password]": password,
      "user[remember_me]": "1"
    },
    beforeSend: function() {
      showMessage("")
      $("#submit").prop('disabled', true)
    },
    success: wsmLoginSuccess,
    error: function(e) {
      console.log(e)
      showMessage("Login Wsm fail")
    }
  }

  await $.ajax(wsmLoginSettings)

  return loginSuccess
}

function loginSgoal() {
  var sgoalLoginSettings = {
    url: "https://wsm.sun-asterisk.vn/authorize?client_id=cd398Lu2QqTdJTodWbM5AykC&redirect_uri=https%3A%2F%2Fgoal.sun-asterisk.vn%2Flogin%2Fframgia%2Fcallback&response_type=code",
    method: "GET",
    xhrFields: {
      withCredentials: true
    },
    async: false,
    beforeSend: function() {
      showMessage("")
      $("#submit").prop('disabled', true)
    },
    success: function() {
      createAlarm()
      showMessage("Login success")
      loginSuccess = true
    },
    error: function(e) {
      console.log(e)
      showMessage("Login Sgoal fail")
    }
  }
  $.ajax(sgoalLoginSettings)
}

function createAlarm() {
  var currentDate = new Date()
  var scheduleDate = new Date()
  scheduleDate.setHours(10, 0, 0)
  if (currentDate.getHours() >= 10) {
    scheduleDate.setDate(currentDate.getDate() + 1)
  }

  chrome.alarms.create(
    "scheduleRemainUnchanged",
    {when: scheduleDate.getTime(), periodInMinutes: 1440}
  )
}

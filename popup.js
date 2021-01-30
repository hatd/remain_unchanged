'use strict';

chrome.storage.local.get('remain_unchanged_user', (data) => {
  if(data.remain_unchanged_user){
    $('#email').val(data.remain_unchanged_user.email);
    $('#password').val(data.remain_unchanged_user.password);
  }
})

$("#submit").click(() => {
  let email = $('#email').val();
  let password = $('#password').val();
  let remain_unchanged_user = {email: email, password: password}

  chrome.storage.local.set({remain_unchanged_user: remain_unchanged_user}, () => {
    loginWsm()
  })
  // runJob();
})

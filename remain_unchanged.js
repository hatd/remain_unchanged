function runJob() {
  (async () => {
    var success = false
    success = await loginWsm()

    if (success) {
      let objectiveUrls = loadObjectives()

      objectiveUrls.forEach(function(url) {
        let keyResultIds = loadKeyResults(url)

        keyResultIds.forEach(function(objectiveId) {
          remainUnchaged(objectiveId)
        })
      })
    }
  })()
}

function remainUnchaged(objectiveId) {
  chrome.cookies.get(
    {url: "https://goal.sun-asterisk.vn", name: "access_token"},
    function(token) {
      var accessToken = token.value
      var remainUnchagedSettings = {
        url: "https://goal.sun-asterisk.vn/api/v1/objectives/" + objectiveId + "/remain_unchanged",
        method: "POST",
        xhrFields: {
          withCredentials: true
        },
        headers: {
          "X-CSRF-Token": "VxfgIWM99d5nGl4gDR2W/LIxIG7gH9DzImFXUH4t+qDb/Genf4a3SoQAkTkwBhcFaIwf9U2Nq7o9z4kxTDt83g==",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Bearer " + accessToken
        },
        data: {
          "keyResultId": objectiveId
        },
        success: function(data, statusText, xhr) {
          console.log(data)

        },
        error: function(e) {
          console.log(e)
        }
      }
      $.ajax(remainUnchagedSettings)
    }
  )
}

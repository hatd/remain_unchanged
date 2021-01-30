
function loadObjectives() {
  var objectiveUrls = []

  var objectivesSettings = {
    url: "https://goal.sun-asterisk.vn/dashboard",
    method: "GET",
    xhrFields: {
      withCredentials: true
    },
    async: false,
    success: function(data, statusText, xhr) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, "text/html");

      var objectiveItems = doc.getElementsByClassName("objectiveItem")
      objectiveUrls = Array.from(objectiveItems).map(function(objectiveItem) {
        return objectiveItem.getElementsByClassName("float-left obj-name")[0].getElementsByTagName("a")[0].href
      })
    },
    error: function(e) {
      console.log(e)
    }
  }
  $.ajax(objectivesSettings)

  return objectiveUrls
}

function loadKeyResults(url) {
  var keyResultIds = []

  var objectDetailSettings = {
    url: url,
    method: "GET",
    xhrFields: {
      withCredentials: true
    },
    async: false,
    success: function(data, statusText, xhr) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, "text/html");

      var keyResults = doc.getElementsByClassName("modal fade modalDetail keyResult-show")
      keyResultIds = Array.from(keyResults).map(function(keyResult) {
        return keyResult.id
      })
    },
    error: function(e) {
      console.log(e)
    }
  }
  $.ajax(objectDetailSettings)

  return keyResultIds
}

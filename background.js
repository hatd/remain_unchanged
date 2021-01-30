chrome.alarms.onAlarm.addListener(function() {
  console.log("Run job: " + new Date())
  runJob()
});

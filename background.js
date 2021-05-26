'use strict';

chrome.notifications.onButtonClicked.addListener(function() {
  console.log("button clicked")
  chrome.storage.sync.get(['minutes'], function(item) {
    chrome.action.setBadgeText({text: 'ON'});
  });
});

function filterAvailability(data){
 return data.centers.filter((obj) => {
    const sessions = obj.sessions;
    for(var i=0;i<sessions.length;i++){
      const session = sessions[i];
     if(session.min_age_limit === 18  && session.available_capacity_dose1 > 1){
       return true
     }
    }
  });
}

function closeAvailableCentersTab(){
  chrome.tabs.query({"title":"Available Centers"}, function(tabs) {
    if(tabs.length){
      chrome.tabs.remove(tabs[0].id); 
    }
  });
}

function handleAvailableCentersTab(){
  chrome.tabs.query({"title":"Available Centers"}, function(tabs) {
      if(!tabs.length){
        chrome.tabs.create({url : "availableCenters.html"}); 
      }else{
        chrome.tabs.reload(tabs[0].id);
      }
  });
}

async function fetchDataFromApi(district_id){
  let date = new Date();
  let dateString = date.getDate()  + "-" + ('0'+(date.getMonth()+1)).slice(-2) + "-" + date.getFullYear()
  let apiUrl = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=' + district_id +'&date=' + dateString;
  let fallbackApiUrl = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + district_id +'&date=' + dateString;
  console.log(apiUrl);
  let request = await fetch(apiUrl);
  if(!request.ok){
    console.log("Falback Api Url working")
    request = await fetch(fallbackApiUrl);
  }
  const data = await request.json();
  handleResponse(data);
}

function handleResponse(data){
  const availabeOptions = filterAvailability(data);
  console.log("availabeOptions : " + availabeOptions.length); 
  if(availabeOptions.length){
    console.log(new Date())
    chrome.action.setBadgeText({text: 'Available'});
    chrome.storage.local.set({"availabeOptions": availabeOptions});
    handleAvailableCentersTab();
  }else{
    chrome.storage.local.set({"availabeOptions": []});
    chrome.action.setBadgeText({text: 'ON'});
    closeAvailableCentersTab();
  }
}

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(['district'], function(result) {
    fetchDataFromApi(result.district);
  });
});

function onInstalled(){
  console.log("onInstalled");
  chrome.storage.local.set({"enableSound": true}, function() {
    console.log('Sound Notification is set to ' + true);
  });
}

function onStartup() {
  console.log("onStartup");
  chrome.storage.local.get(['state','district'], function(result) {
    if(result.state && result.district){
      chrome.alarms.clear("VacNotification");
      chrome.action.setBadgeText({text: 'ON'});
      chrome.alarms.create("VacNotification",{ periodInMinutes: 1 });
    }
  });
}

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(onStartup);


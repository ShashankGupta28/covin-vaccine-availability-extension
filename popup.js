'use strict';

(function populateStateSelect(){
  console.log("populateStateSelect");
  let apiUrl = 'https://cdn-api.co-vin.in/api/v2/admin/location/states';
  fetch(apiUrl).then(r =>  r.json()
    .then(data => { 
      console.log(data)
      let options = '<option selected>Select State</option>';
      data.states.forEach((state)=>{
        options+= '<option value="'+ state.state_id +'">' + state.state_name +'</option>';
      });
      document.getElementById('state').innerHTML = options;
      setSelectedFields();
    })
  );
})();

function enableNotification(event) {
  console.log("Notification set")
  chrome.alarms.clear("VacNotification");
  chrome.action.setBadgeText({text: 'ON'});
  chrome.alarms.create("VacNotification",{ periodInMinutes: 1 });
  window.close();
}

function clearNotification() {
  console.log("Notification cleared")
  chrome.action.setBadgeText({text: ''});
  chrome.alarms.clear("VacNotification");
  window.close();
}

function handleSoundNotification(){
  const checkBox = document.getElementById('soundCheckbox');
  chrome.storage.local.set({"enableSound": checkBox.checked}, function() {
    console.log('Sound Notification is set to ' + checkBox.checked);
  });
}

function handleAgeSelectionAdult(){
  console.log("Age selection Adult");
  const checkBox = document.getElementById('18+');
  chrome.storage.local.set({"18+": checkBox.checked}, function() {
    console.log('Adult age selection is set to ' + checkBox.checked);
  });
}

function handleAgeSelectionMiddle(){
  console.log("Age selection Middle Age");
  const checkBox = document.getElementById('45+');
  chrome.storage.local.set({"45+": checkBox.checked}, function() {
    console.log('Middle age selection is set to ' + checkBox.checked);
  });
}

function populateDistrictsSelect(state_id,selectedDistrict){
  let apiUrl = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/'+state_id;
  fetch(apiUrl).then(r =>  r.json()
    .then(data => { 
      console.log(data)
      let options = '<option selected>Select District</option>';
      data.districts.forEach((district)=>{
        options+= '<option value="'+ district.district_id +'">' + district.district_name +'</option>';
      });
      document.getElementById('district').innerHTML = options;
      if(selectedDistrict){
        document.getElementById('district').value = selectedDistrict;
      }
    })
  );
}

function setSelectedFields(){
  chrome.storage.local.get(['enableSound','state','district',"18+","45+"], function(result) {
    console.log("Sound Enabled : ");
    console.log(result.enableSound);
    if(result.enableSound){
      document.getElementById('soundCheckbox').checked = true;
    }else{
      document.getElementById('soundCheckbox').checked = false;
    }

    if(result["18+"]){
      document.getElementById('18+').checked = true;
    }else{
      document.getElementById('18+').checked = false;
    }

    if(result["45+"]){
      document.getElementById('45+').checked = true;
    }else{
      document.getElementById('45+').checked = false;
    }


    console.log("state");
    console.log(result.state)
    if(result.state){
      document.getElementById('state').value = result.state;
      populateDistrictsSelect(result.state);
    }
    console.log("district");
    console.log(result.district)
    if(result.district){
      populateDistrictsSelect(result.state, result.district);
    }
  });
}

function handleStateChange(){
  console.log(" handleStateChange");
  chrome.alarms.clear("VacNotification");
  chrome.action.setBadgeText({text: ''});
  const value = document.getElementById('state').value;
  if(value !== "Select State"){
    chrome.storage.local.set({"state": value}, function() {
      console.log('State is set to ' + value);
      chrome.storage.local.remove(["district"]);
      populateDistrictsSelect(value);
    });
  }
}

function handleDistrictChange(){
  console.log(" handleDistrictChange");
  const value = document.getElementById('district').value;
  if(value !== "Select District"){
    chrome.storage.local.set({"district": value}, function() {
      console.log('District is set to ' + value);
      startNotification();
      window.close();
    });
  }
}

function startNotification() {
  console.log("startNotification");
  chrome.alarms.clear("VacNotification");
  chrome.action.setBadgeText({text: 'ON'});
  chrome.alarms.create("VacNotification",{ periodInMinutes: 1 });
}

document.getElementById('enableNotification').addEventListener('click', enableNotification);
document.getElementById('clearNotification').addEventListener('click', clearNotification);
document.getElementById('soundCheckbox').addEventListener('change', handleSoundNotification);
document.getElementById('18+').addEventListener('change', handleAgeSelectionAdult);
document.getElementById('45+').addEventListener('change', handleAgeSelectionMiddle);
document.getElementById('state').addEventListener('change', handleStateChange);
document.getElementById('district').addEventListener('change', handleDistrictChange);

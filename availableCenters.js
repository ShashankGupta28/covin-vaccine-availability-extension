chrome.storage.local.get(['availabeOptions','enableSound'], function(result) {
    console.log(result.availabeOptions);

    var html = "";
    result.availabeOptions.forEach((centre)=> {
      var sessionData = ""; 
      centre.sessions.forEach((session)=> {
        if(session.min_age_limit === 18  && session.available_capacity_dose1){
          let val = session.date +  " - " +  session.vaccine + " - " + session.available_capacity_dose1;
          sessionData += '<div>'+val+'</div>'
        }
      });
      html += '<tr><th scope="row">'+ centre.name+'</th><td>'+ centre.address+'</td><td>'+ sessionData+'</td></tr>'
      });
    document.getElementById("availCentre").innerHTML = html;

    if(result.enableSound){
      document.getElementById('player').play();
    }
});

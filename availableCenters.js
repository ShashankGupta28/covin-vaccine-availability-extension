chrome.storage.local.get(['availabeOptions','enableSound','18+','45+'], function(result) {
    console.log(result.availabeOptions);
    var html = "";
    result.availabeOptions.forEach((centre)=> {
      var sessionData = ""; 
      centre.sessions.forEach((session)=> {
        if(session.available_capacity_dose1){
          if(result["45+"] && result["18+"]){
            const age = session.min_age_limit;
            let val = session.date +  " - " +  session.vaccine + " - " + age + "+ | " + session.available_capacity_dose1;
            if(age === 18){
              sessionData += '<div class="green">'+val+'</div>'
            }else{
              sessionData += '<div>'+val+'</div>'
            }
          }else if(result["18+"]){
            if(session.min_age_limit === 18){
              let val = session.date +  " - " +  session.vaccine + " - " + session.min_age_limit + "+ | " + session.available_capacity_dose1;
              sessionData += '<div class="green">'+val+'</div>'
            }
          }else if(result["45+"]){
            if(session.min_age_limit === 45){
              let val = session.date +  " - " +  session.vaccine + " - " + session.min_age_limit + "+ | " + session.available_capacity_dose1;
              sessionData += '<div>'+val+'</div>'
            }
          }
        }
      });
      html += '<tr><th class='+ centre.fee_type +' scope="row">'+ centre.name + " - "+ centre.fee_type  + '</th><td>'+ centre.address+'</td><td>'+ sessionData+'</td></tr>'
      });
    document.getElementById("availCentre").innerHTML = html;

    if(result.enableSound){
      document.getElementById('player').play();
    }
});

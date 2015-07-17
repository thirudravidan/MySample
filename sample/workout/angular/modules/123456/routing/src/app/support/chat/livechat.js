
//var __lc = {};
//__lc.license = 1075634;
//__lc.skill = 1;
//__lc.params = [
//    { name: 'Name', value: getCookie("FirstName") },
//    { name: 'Email', value: getCookie("CustomerEmail") }
//  ];
//(function () {
//    var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
//    lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
//    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
//})();

//var LC_API = LC_API || {};
//LC_API.on_after_load = function () {
//    LC_API.open_chat_window();
//};

var RNChat_Available_Sessions = -1;

//for RBU
RightNow.Client.Controller.addComponent({
    min_agents_avail_type: "sessions",
    label_dialog_header: "",
    label_title: "",
    label_question: "checking status",
    seconds: 0,
    instance_id: "PAC_obj",
    div_id: "chat",
    module: "ProactiveChat",
    type: 2,
    c: 1520
},
            "https://netgear-us.widget.custhelp.com/ci/ws/get"
        );

function onRNPACStatusResponse(type, args, instance) {
    result = args[0].data;

    if (result.availableAgentSessions > 0)
    {
        RNChat_Available_Sessions = result.availableAgentSessions;
    }
    else{ 
        RNChat_Available_Sessions = 0;
    }

    window.setTimeout(function () {
        PAC_obj.chatAvailability();
    }, 300000); //refresh after 5 mins

    updateChatStatus();
}

function setupForChatAvailabilityCheck() {
    if (typeof RightNow.Client.Event.evt_chatAvailabilityResponse === "undefined"){
        window.setTimeout(setupForChatAvailabilityCheck, 3000); // RN Client is not init yet. check after 3 secs
    }
    else {
        RightNow.Client.Event.evt_chatAvailabilityResponse.subscribe(onRNPACStatusResponse);
        startCheckChatAvail();
    }
}

setupForChatAvailabilityCheck();

function startCheckChatAvail() {
    if (RNChat_Available_Sessions != -1) {return;} //already triggered the first chat for all instances
    else {
        if (typeof PAC_obj === "undefined"){
            window.setTimeout(startCheckChatAvail, 3000); // RBU instance is not init yet. check after 3 secs		
        }
        else{
            PAC_obj.chatAvailability();
        }
    }
}

function updateChatStatus() {
    if (RNChat_Available_Sessions > 0) {
        //TODO: available
        //document.getElementById("chatstatus").innerHTML = '<a href="#" onclick="alert(\'user clicked chat, dosomething()\');">Chat Online</a> <!-- available sessions: ' + (RNChat_Available_Sessions) + ' -->';
        return true;
    }
    else {
        //TODO: not available
        //document.getElementById("chatstatus").innerHTML = 'Chat offline';
        return false;
    }
}
  

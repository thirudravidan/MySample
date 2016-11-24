
var _ = require('lodash'),
    glob = require('glob');


/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
    // For context switching
    var _this = this;

    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];
    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns, true);/*, function(err, files) {
                if (removeRoot) {
                    files = files.map(function(file) {
                        return file.replace(removeRoot, '');
                    });
                }
                output = _.union(output, files);
            });*/
            output = _.union(output, files);
        }
    }
    //console.log(output);
    return output;
};

module.exports.settings = function() {

    var settings = new Object;

    // Server Details
    settings.server = new Object;
    settings.server.ip = "10.20.28.29";
    settings.server.port = 8085;

    //DB Details
    settings.mongodb = "mongodb://10.40.2.46/iot";

    //Log Path
    settings.logPath = "d:/gearhead/";
    settings.logName = "gearHead.log";

    //Soap Service Api Key/Url Netgear
    settings.apikey = "SpeP7uxATasPApa";
    settings.netgearUrl = "https://my-stg1.netgear-support.com/NetgearAPI/Services.svc?WSDL";
    settings.activeiUrl = "https://my-stg1.netgear-support.com/NetgearAPI/Services.svc?WSDL";

    //Soap Service credentials/Url KB
    settings.KB_UserName = "kfapiaccess_us";
    settings.KB_Password = "thEma5up8a5P";
    settings.KB_AppID = "GearHeadConnect_Client";
    settings.kbServiceUrl = "https://kb.netgear.com/cgi-bin/netgear_us.cfg/services/kf_soap";

    //Soap Service product key/Url Message Center Service
    settings.productnamekey = "$$productname$$";
    settings.messageUrl = "http://devis.csscorp.com/MessageCenterService/MessageCenterService.svc";

    return settings;
    
};
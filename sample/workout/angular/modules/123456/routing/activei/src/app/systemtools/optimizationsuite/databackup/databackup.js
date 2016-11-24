/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'activei.databackup', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'databackup', {
    url: '/databackup',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/databackup/databackup.tpl.html",
        controller:"databackupController" 
    }
    },
    data:{ pageTitle: 'DataBackup' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'databackupController', function databackupController( $scope ,$rootScope,$http,$state,ngDialog) {
  $rootScope.isMiddleCont = true;
  $("#btnfileUpload").attr("disabled",true);

  $scope.uploadstart = function(){
    try{
    var files = document.getElementById('file').files;
    if (files.length !== 0 ){
      $("#btnfileUpload").attr("disabled",true);
      $("#btnbrowse").attr("disabled",true);
      $("#file").attr("disabled",true);
      $scope.disProgressbar =true;
     // var percentcompleted=Math.round((loadingval*100)/totalval);
     //document.getElementById("szliderbar").style.display='block';
     
      uploadFile();
      $scope.disProgressbar =false;
    }
    else
    {
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRDATABACKUP,$rootScope.getglobalErrorMessage.ERRORDATBACKUPNOFILE,$rootScope.getglobalErrorMessage.BTNOK);
    }
  }
  catch(e){
    stackTrace('databackupController','uploadstart ',e,$rootScope.getglobaldata.Client);
  }
  };
 /*$scope.loader= function()
{
  drawszlider(100,50);
};*/

});

var totUploadedsize=0;
var totUploadededsize=0;
var percentCurrent=0;
var uploadingFileCnt=0;
function bindFileList()
{
  try
  {
    
    var files = document.getElementById('file').files;
    // if (files.length > 0) {
        var fileStringHead="<table class=diskBackupTable border=1;cellspacing=0;cellpadding=1;width:100%;><tbody>";
        var fileHeaderRow="<tr class=filesHeader><td>File Name</td><td>File Size</td><td >Sync Status</td></tr>";
        var tableBodystring="";
        document.getElementById("szliderbar").style.width='0%';
        document.getElementById("szazalek").innerHTML='0%';
        if (files.length > 0) {
          $("#btnfileUpload").attr("disabled",false);
          // $("#file").val(files.length+" files selected");
        }
      for(var i=0;i<files.length;i++)
        {
           var file = document.getElementById('file').files[i]; 
           var sizeinbytes = document.getElementById('file').files[i].size;
           var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
           var fSize = sizeinbytes; j=0;while(fSize>900){fSize=(fSize/1024);j++;} 
           var sizeformat = (Math.round(fSize*100)/100)+' '+fSExt[j];

           tableBodystring = tableBodystring+"<tr><td>"+file.name+"</td><td>"+sizeformat+"</td><td id=progress"+i+" class='icon-checkmark progressStart'>&nbsp;<span id=progressText"+i+">Yet to start</span></td></tr>";
           totUploadedsize = totUploadedsize+ file.size;
        }

      if(files.length<8)
      {
        for (var a=files.length;a<8;a++)
        {
            tableBodystring = tableBodystring+"<tr class=whitebackground><td colspan=3>&nbsp;</td></tr>";
        }
      }
      var fileStringFoot="</tbody></table>";
      fileStringTable=fileStringHead+fileHeaderRow+tableBodystring+fileStringFoot;
      $(".fileListTable").empty();
      $(".fileListTable").append(fileStringTable);
      if(files.length > 8)
      {
        $('.fileListTable').slimScroll({
                      wheelStep: 5,
                      width: "100%",
                       height: "80%"
                    });
        }
        else{
        $('.fileListTable').slimScroll({
                      wheelStep: 5,
                      width: "100%",
                       height: "100%"
                    });
      }
    // }
  
}
  catch(e)
  {
    // stackTrace(e);
    stackTrace('databackupController','bindFileList',e,offlineGlobalData.Client);
  } 
}
function uploadFile () {
  try
  {
    document.getElementById("szliderbar").style.width='0%';
     document.getElementById("szazalek").innerHTML='0%';
     // $('#file').val('');
     uploadingFileCnt=0;
    var files = document.getElementById('file').files; 
    uploadSelectedFiles(files,0);
  // for(var i=0;i<files.length;i++)
  //   {
  //     // alert('uploadFile');
      
  //     var file =document.getElementById('file').files[i];
  //     var fd = new FormData();
  //     var key='Super/'+file.name;
  //        POLICY_JSON = { "expiration": "2020-12-01T12:00:00.000Z",
  //           "conditions": [
  //                           ["eq", "$bucket", "jack2"],
  //                           ["starts-with", "$key", "Super/"+file.name],
  //                           {"acl": "public-read"},
  //                           {"x-amz-meta-filename": file.name},
  //                           ["starts-with", "$Content-Type", file.type]
  //                         ]
  //         };      

  //     var secret = "FqpOdFoVxpdRtUV837qb7lBkQBJEHa7uMuqkEIUi";
  //     var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
  //     var signature = b64_hmac_sha1(secret, policyBase64);
  //     fd.append("key", "Super/"+file.name);
  //     fd.append("acl", "public-read"); 
  //     fd.append("Content-Type",file.type);      
  //     fd.append("AWSAccessKeyId", "AKIAJPSOLEVW3CMPKP7Q");
  //     fd.append("x-amz-meta-filename",file.name);
  //     fd.append("policy", policyBase64);
  //     fd.append("signature",signature);

  //     fd.append("file",document.getElementById('file').files[i]);

  //    // uploadFiles(file.size);

  //     $.ajax({
  //             url: 'https://jack2.s3.amazonaws.com/',
  //             type: 'POST',
  //             data: fd,
  //             async: false,
  //             cache: false,
  //             contentType: false,              
  //             processData: false,
  //             success: uploadComplete(file.size),
  //             error: uploadFailed
  //           }); 
  // }

  
  }

  catch(e)
  {
    // stackTrace(e);
    stackTrace('databackupController','uploadFile',e,offlineGlobalData.Client);
  } 
}

function uploadSelectedFiles(files,position)
{
  // alert(position);
    var file =document.getElementById('file').files[position];
      var fd = new FormData();
      var key='Super/'+file.name;
         POLICY_JSON = { "expiration": "2020-12-01T12:00:00.000Z",
            "conditions": [
                            ["eq", "$bucket", "jack2"],
                            ["starts-with", "$key", "Super/"+file.name],
                            {"acl": "public-read"},
                            {"x-amz-meta-filename": file.name},
                            ["starts-with", "$Content-Type", file.type]
                          ]
          };      

      var secret = "FqpOdFoVxpdRtUV837qb7lBkQBJEHa7uMuqkEIUi";
      var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
      var signature = b64_hmac_sha1(secret, policyBase64);
      fd.append("key", "Super/"+file.name);
      fd.append("acl", "public-read"); 
      fd.append("Content-Type",file.type);      
      fd.append("AWSAccessKeyId", "AKIAJPSOLEVW3CMPKP7Q");
      fd.append("x-amz-meta-filename",file.name);
      fd.append("policy", policyBase64);
      fd.append("signature",signature);

      fd.append("file",document.getElementById('file').files[position]);

     // uploadFiles(file.size);

      $.ajax({
              url: 'https://jack2.s3.amazonaws.com/',
              type: 'POST',
              data: fd,
              //async: false,
              cache: false,
              contentType: false,              
              processData: false,
              success: function(data) {
                //alert ("complete success thiru"+data);
                uploadComplete(file.size,files,position); 
              },
              error: uploadFailed
            }); 
}

function uploadFiles(filesize)
{
  // alert('In');
   $.post('https://jack2.s3.amazonaws.com/',fd).success(function (resp) {  
        // alert(resp);
        uploadComplete(filesize);
      }).error(function (resp) {
        uploadFailed(evt);
         // alert("failure"+ JSON.stringify(data));
      });
}

  function uploadComplete(filesize,files,pos) {
    try
    { 
      // alert('uploadComplete');
      //totUploadededsize = totUploadededsize + filesize;
      // alert("totUploadededsize--"+totUploadededsize +"filesize--"+filesize);
      //drawszlider(pos,files.length);

      var percentcompleted=Math.round(((pos+1)*100)/files.length);
      document.getElementById("szliderbar").style.width=percentcompleted+'%';
      document.getElementById("szazalek").innerHTML=percentcompleted+'%';

      $("#progress"+uploadingFileCnt).removeClass("progressStart").addClass("progressEnd");
      $("#progressText"+uploadingFileCnt).empty();
      $("#progressText"+uploadingFileCnt).html('Uploaded');
      uploadingFileCnt=uploadingFileCnt+1; 
      if(totUploadededsize === totUploadedsize) {
         document.getElementById("szliderbar").style.width='0%';
         document.getElementById("szazalek").innerHTML='';
         $('#file').val('');
         totUploadededsize=0;
         totUploadedsize=0;
         uploadingFileCnt=0;
      }

      //index++;
      // alert('files.length--'+(files.length-1) +"--index--"+pos);
      if ((parseInt(files.length,10)-1) > pos) {
        // alert('In');
          uploadSelectedFiles(files,++pos);
      }
      else if((parseInt(files.length,10)-1) === pos) {
          $("#btnbrowse").attr("disabled",false);
          $("#file").attr("disabled",false);
          $('#file').val('');
      }
    }
    catch(e)
    { 
      // stackTrace(e);
      stackTrace('databackupController','uploadComplete',e,offlineGlobalData.Client);
    } 
  }

  function uploadFailed(evt) {
    try{ 
         $("#progress"+uploadingFileCnt).removeClass("progressStart").addClass("progressfailed");
          $("#progressText"+uploadingFileCnt).empty();
          $("#progressText"+uploadingFileCnt).html('Failed to Upload');
    }
    catch(e)
    {
       // stackTrace(e);
       stackTrace('databackupController','uploadFailed',e,offlineGlobalData.Client);
    }
  }

  function uploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
  }

  function opendatabackup()
  {
     $("#file").click();
  }





 
    



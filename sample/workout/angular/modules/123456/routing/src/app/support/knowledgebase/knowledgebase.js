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
angular.module( 'activei.knowledgebase', ['fundoo.directives','ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'knowledgebase', {
    url: '/knowledgebase',
  views:{
           "RightView":{
        templateUrl:"support/knowledgebase/knowledgeBaseRight.tpl.html",
        controller:"knowledgeBaseRightController"
    
    }
    },
    data:{ pageTitle: 'Knowledge Base' }
  });
})
/**
 * And of course we define a controller for our route.
 */

.controller('knowledgeBaseRightController',['$scope','$rootScope','$cookieStore','$http','$state','FlickrApi','ngDialog','$interval','$window', function knowledgeBaseRightController( $scope ,$rootScope,$cookieStore,$http,$state,flickr,ngDialog,$interval,$window) {
  $rootScope.isMiddleCont = true;
  $scope.showPopular=false;
  $scope.showRecomend=false;
  $scope.showPopularCont=false;
  $scope.pop_content="Popular Content";
  $scope.rec_content="Recommended Content";  
  $scope.ispageload=true;
/*$scope.productdetail=[
  
    {
      "proId" : "C3000",
      "proValue" : "C3000"
    },
    {
      "proId" : "C3700",
      "proValue" : "C3700"
    }
 
];*/
 

$scope.bindrecContentDetails=function()
{
  try
   {  
      if($rootScope.kbFlag != null){ 
      $scope.txtSearch = $rootScope.kbFlag;
      $scope.searchContent(); 
    }
    bindpopularDetails($scope,$http,$cookieStore,$rootScope);
    bindrecomDetails($scope,$http,$cookieStore,$rootScope);
    }
    //$scope.txtSearch = "test" ; //flickr.get();  
   catch(e)
   {
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','bindrecContentDetails',e,$rootScope.getglobaldata.Client);
   }
};



$scope.indexSet=function()
{
  $scope.startIndex=10;
  $scope.previousIndex=0;
  $scope.totalRecords=0;
};

$scope.showNextContent=function(){
  try{
    var startindex = $scope.startIndex;
    var previousindex =$scope.previousIndex;
    var totalrecords = $scope.totalRecords;
    if($('.previousPage').hasClass("disableText"))
    { 
      $('.previousPage').removeClass("disableText");
    }
    if (parseInt(startindex,10) < parseInt(totalrecords,10)) {
         $scope.previousIndex=parseInt(startindex,10);
         $scope.startIndex=parseInt(startindex,10) + 10;
         showLoader();
         searchCont($http,$scope,$scope.txtSearch,parseInt(startindex,10),8);
    }
    else
    { 
      $('.nextPage').addClass("disableText");
    } 
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','showNextContent',e,$rootScope.getglobaldata.Client);
  }
};

$scope.showPreviousContent=function() {
  try{
    var previousindex = $scope.previousIndex;
    if (previousindex !== 0) {
      if (previousindex === 10) {
           $scope.startIndex=10;
            $scope.previousIndex=0;
               $('.previousPage').addClass("disableText");
        } else {
            $scope.startIndex=parseInt(previousindex,10);
            $scope.previousIndex=parseInt(previousindex,10) - 10;
        }
        showLoader();
       searchCont($http,$scope,$scope.txtSearch,(parseInt(previousindex,10) - 10),8);
    }
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','showPreviousContent',e,$rootScope.getglobaldata.Client);
  }
};


$scope.redirectToKBContentView=function(Id,Originid,originname)
{  
  try{
  showLoader();
   popularkbContentview(ngDialog,$scope,$http,$cookieStore,$rootScope,Id,Originid,originname);
 }
 catch(e){
  stackTrace('knowledgeBaseRightController','redirectToKBContentView',e,$rootScope.getglobaldata.Client);
 }
};

$scope.searchContent=function()
{  
  try{
  if ($scope.txtSearch!=="" && $scope.txtSearch !== undefined) 
  {  
    $rootScope.kbFlag = $scope.txtSearch;
    showLoader();
    searchCont($http,$scope,$scope.txtSearch,0,8);
    $scope.startIndex=10;
    $scope.previousIndex=0;
  }
  else{
     showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRKNOWLEDGEBASE,$rootScope.getglobalErrorMessage.INFOSEARCHCONT,$rootScope.getglobalErrorMessage.BTNOK);
  }
}
catch(e){
  stackTrace('knowledgeBaseRightController','searchContent',e,$rootScope.getglobaldata.Client);
}
};
$scope.productPopup=function(searchText){
$scope.headerText=$rootScope.getglobalErrorMessage.HDRSERACHPRODUCT;
$scope.searchText=searchText;
     ngDialog.openConfirm({
                    template: 'searchDialog',
                    className: 'ngdialog-theme-default',
                    plain: false,
                    scope: $scope
                  })
     .then(function(val){
          $rootScope.selectedproducttype=$('#proId').text();
         
          bindpopularDetails($scope,$http,$cookieStore,$rootScope);
           bindrecomDetails($scope,$http,$cookieStore,$rootScope);
     });
};
/*$scope.selectedProduct= function()
{
  $scope.loadproductfamily();
    $("#productCategory option:contains(" + $scope.searchText + ")").attr('selected', 'selected');
};*/
/*$scope.loadproductfamily =function()
{
     '<option value="tcm:122-58378-1024">Access Points &amp; Wireless Extenders</option>
            <option value="tcm:122-42208-1024">Adapters</option>
            <option value="tcm:122-81475-1024">Apps</option>
            <option value="tcm:122-42209-1024">Entertainment</option>
            <option value="tcm:122-74268-1024">Mobile Broadband</option>
            <option value="tcm:122-42210-1024">Phoneline</option>
            <option value="tcm:122-42211-1024">Powerline &amp; Coax</option>
            <option value="tcm:122-42212-1024">Print Servers</option>
            <option selected="selected" value="tcm:122-42215-1024">Routers, Modems &amp; Gateways</option>
            <option value="tcm:122-58380-1024">Storage</option>
            <option value="tcm:122-58381-1024">Unmanaged Switches</option>
            <option value="tcm:122-59529-1024">Video Monitoring</option>
            <option value="tcm:122-42218-1024">VOIP,Skype</option>'
};*/
/*$scope.showproducttypedetails =function(proCategory)
{
 $scope.proDetailsshow=true;
  if (proCategory.proId==="C3000") {
    $scope.pro_image="http://support.netgear.com/images/C3000_thumb_tcm122-81244.png";
    $scope.productId=proCategory.proId;
  }
  else{
     $scope.pro_image="http://support.netgear.com/images/C3700_thumb_tcm122-81249.png";
    $scope.productId=proCategory.proId;
  }

};
*/

$scope.accordionFun=function(clickedHeader)
{
if (clickedHeader==='recommend') {
  if($scope.showRecomendCont===false && $scope.norecordsShowRecomnd===false){
      if($scope.recomContent !== "" && $scope.recomContent !== null && $scope.recomContent !== undefined)
      {
        $scope.showPopularCont=false;
        $scope.norecordsShowRecomnd=false;
        $scope.showRecomendCont=true;
      }
      else
      {
        $scope.showPopularCont=false;
        $scope.norecordsShowRecomnd=true;
        $scope.showRecomendCont=false;
      }
      
   }
   else{
      $scope.norecordsShowRecomnd=false;
      $scope.showRecomendCont=false;
   }
}
else if(clickedHeader==='popular'){
   if($scope.showPopularCont===false){
      if($scope.recomContent !== "" && $scope.recomContent !== null && $scope.recomContent !== undefined)
      {
        $scope.showRecomendCont=false;
      }
      else
      {
        $scope.norecordsShowRecomnd=false;
      }
      $scope.showPopularCont=true;
   }
   else{
      $scope.showPopularCont=false;  
   }
}
else{
    if($scope.showSearchCont===false){
      if($scope.seaContent !== "" && $scope.seaContent !== null && $scope.seaContent !== undefined)
      {
          $scope.showSearchCont=true;
          $scope.nextPrevShow=true;
          $scope.norecordsShow=false;
      }
      else
      {
        $scope.showSearchCont=false;
        if($scope.norecordsShow===true){
          $scope.norecordsShow=false;
          $scope.nextPrevShow=false;
        }
        else
        {
          $scope.nextPrevShow=false;
          $scope.norecordsShow=true;
        }
      }
     }
   else{
      $scope.showSearchCont=false; 
      $scope.nextPrevShow=false;
   }
}

};
$scope.loadproductfamily = function () {
  try{
     var ngproductdetailsurl = $rootScope.getglobaldata.Client;
    $("#productCategory").html("");
    var productDetails = window.external.getKBProductDetails(ngproductdetailsurl, $scope.searchText);
    $("#productCategory").html(productDetails);
    document.getElementById("proDetailsshow").style.display = 'none';
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','loadproductfamily',e,$rootScope.getglobaldata.Client);
  }
};
$scope.loadproductfamilyonchange =function(){
  try{
    var ngproductdetailsurl = $rootScope.getglobaldata.Client;
    $("#profamily").html("");
    var selectedValue = $("#productCategory option:selected").text();
    var productDetails = window.external.getKBProductDetails(ngproductdetailsurl, selectedValue);   
    $("#profamily").html(productDetails);
    $("#productType").html("");
    document.getElementById("proDetailsshow").style.display = 'none';
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','loadproductfamilyonchange',e,$rootScope.getglobaldata.Client);
  }
};

$scope.loadproducttype = function(){
  try{
    var ngproductdetailsurl = $rootScope.getglobaldata.Client;

    $("#productcategory").html("");
    var selectedValue = $("#profamily option:selected").text();
    var productDetails = window.external.getKBProductDetails(ngproductdetailsurl, selectedValue);
    $("#productType").html(productDetails);
    document.getElementById("proDetailsshow").style.display = 'none';
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','loadproducttype',e,$rootScope.getglobaldata.Client);
  }
};

$scope.showproducttypedetails = function() {
  try{
    var ngproductdetailsurl = $rootScope.getglobaldata.Client;
    $scope.proDetailsshow=true;
    document.getElementById("proDetailsshow").style.display = 'block';
    var selectedValue = $("#productType option:selected").text();
    $("#proId").html(selectedValue);
    var imagePath = window.external.getKBProductDetails(ngproductdetailsurl, selectedValue);
    $("#productImage").attr("src", imagePath);
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','showproducttypedetails',e,$rootScope.getglobaldata.Client);
  }
};
$scope.initProLoad = function()
{
  $scope.proDetailsshow=false;
};
var pageCount=0;

 var carousel;

    $scope.hasPrevious = function() {
      return carousel ? carousel.hasPrevious() : false;
    };
    $scope.previous = function() {
      if (carousel) { carousel.prev(); }
    };
    $scope.hasNext = function() {
      return carousel ? carousel.hasNext() : false;
    };
    $scope.next = function() {
      if (carousel) { carousel.next(); }
    };

    var loadPhotos = function(carouselScope, page) {
      carousel.updatePageCount(2);
      carouselScope.photos = flickr.getPhotos(page);
      carouselScope.getPhotoUrl = function(photo) {
        return flickr.getPhotoUrl(photo);
      };
      carouselScope.getProText = function(photo) {
        return flickr.getProText(photo);
      };
      carouselScope.getSearchPro = function(photo) {
        return flickr.getSearchPro(photo);
      };


    };
    $scope.loadPage = function(page, tmplCb) {
      var newScope = $scope.$new();
      loadPhotos(newScope, page);
      tmplCb(newScope);
    };
    $scope.onCarouselAvailable = function(car) {
      carousel = car;
    };
  }])

.factory('FlickrApi', function() {
    var savedData = null;
    function set(data) { 
      savedData = data;
    }
    function get() {
      return savedData;
    }
    var pages =  [
    [
        {
            "img": "assets/Content/img/products/wnda3100_productimage_large18-5798_tcm122-50171.png",
            "searchpro" : "tcm:122-42208-1024",
            "textval" : "Adapters"
        },
        {
            "img": "assets/Content/img/products/home_product5_tcm122-50178.png",
            "searchpro" : "tcm:122-42215-1024",
            "textval" : "Routers, Modems & Gateways"
        },
        {
            "img": "assets/Content/img/products/home_product7_tcm122-50174.png",
            "searchpro" : "tcm:122-42211-1024",
            "textval" : "Powerline Coax"
        },
        {
            "img": "assets/Content/img/products/access - home_tcm122-50170.png",
            "searchpro" : "tcm:122-58378-1024",
            "textval" : "Access Points & Wireless Extenders"
        }
        
    ],
    [
        {
            "img": "assets/Content/img/products/readynas - Home_tcm122-50177.gif",
            "searchpro" : "tcm:122-58380-1024",
            "textval" : "Storage"
        },
        {
            "img": "assets/Content/img/products/home_product3_tcm122-50172.png",
            "searchpro" : "tcm:122-42209-1024",
            "textval" : "Entertainment"
        },
        {
            "img": "assets/Content/img/products/dual_indoor_cam_vuezone_tcm122-59558.png",
            "searchpro" : "tcm:122-59529-1024",
             "textval" : "Video Monitoring" 
        },
        {
            "img": "assets/Content/img/products/switches - home_tcm122-50842.png",
            "searchpro" : "tcm:122-58381-1024",
            "textval" : "Unmanaged Switch"
        }
    ]
];
    return {
      set: set,
      get: get,
      getPhotos: function(page) {
        // Ideally, go off and fetch the next page of data fromt he server, but we'll do it locally in the sample
        return pages[page];
      },
      getPhotoUrl: function(photo) {
        return photo.img;
      },
      getProText: function(photo) {
        return photo.textval;
      },
      getSearchPro: function(photo) {
        return photo.searchpro;
      }
    };
  });
    

function bindrecomDetails($scope,$http,$cookieStore,$rootScope)
{
  try{
      var servicePath = "https://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetKBRecommendedContent";
      // var servicePath = "http://gc.gearheadsupport.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetKBRecommendedContent";
      
      // var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetKBRecommendedContent";
      var selectedValue =$rootScope.selectedproducttype;
      var params='{ "limit" : 3, "productName" : "'+ selectedValue +'"}';
      showLoader();
      $http.post(servicePath, params).then(function (resp, status, headers, config) 
          {
             $.loader('close');
              if (resp.data.d !== null) {
                 $scope.recomContent=resp.data.d;
                 $scope.showRecomend=true;
                 $scope.showPopular=true;
                 $scope.showsearch=false;
                 $scope.showSearchCont=false;
                 $scope.showRecomendCont=false;
                 $scope.nextPrevShow=false;
                if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
                   $('.popular_cont').parent().removeClass("popcontShow");
                }
                if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
                  $('.sea_cont').parent().addClass("popcontShow");
                }
              }
              else
              {
                 $scope.showRecomend=true;
                 $scope.showPopular=true;
                 $scope.showsearch=false;
                 $scope.showSearchCont=false;
                 $scope.nextPrevShow=false;
                 $scope.showRecomendCont=false;
                 $scope.norecordsShowRecomnd=true;
                 $scope.recomContent="";
                  if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
                  // $('.popular_cont').parent().addClass("popcontShow");
                }
                if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
                  $('.sea_cont').parent().addClass("popcontShow");
                }
              }
              $scope.accordionFun('recommend');
          }).error(function (serverResponse, status, headers, config) {
              $.loader('close');
              stackTrace("failure");
          });
      }
      catch(e)
      {
      // stackTrace(e);
      stackTrace('knowledgeBaseRightController','bindrecomDetails',e,$rootScope.getglobaldata.Client);
      }
}
function bindpopularDetails($scope,$http,$cookieStore,$rootScope)
{
  try
  {
    var servePath = "https://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetPopularContent";
    // var servePath = "http://gc.gearheadsupport.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetPopularContent";
    // var servePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetPopularContent";
    var param='{ "limit" : 10}';
    $http.post(servePath, param).then(function (response, status, headers, config) 
    {
         $scope.popularContent=response.data.d;
          $scope.showPopular=true;
           $scope.showRecomend=true;
           $scope.showsearch=false;
            $scope.showSearchCont=false;
           $('.popular_cont').slimScroll({
              wheelStep: 5,
              height   : "14vw",
              width    : "99%"
            });
    if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
       $('.popular_cont').parent().removeClass("popcontShow");
    }
    if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
      $('.sea_cont').parent().addClass("popcontShow");
    }
    }).error(function (serverResponse, status, headers, config) {
      $.loader('close');
    });
  }
  catch(e)
  {  
    bindrecomDetails($scope,$http,$cookieStore,$rootScope);
    indexSet(); 
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','bindpopularDetails',e,$rootScope.getglobaldata.Client);
  }

}

function searchCont($http,$scope,searchText,startindex,limit)
{
  try
  {
    var servePath = "https://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "SearchContent";
    // var servePath = "http://gc.gearheadsupport.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "SearchContent";
    // var servePath = $rootScope.getglobaldata.getGlobalServiceUrl + "SearchContent";
    var param= '{ "searchTerm" : "' + searchText + '", "startIndex" : ' + parseInt(startindex,10) + ', "limit" : ' + parseInt(limit,10) + '}';
    $http.post(servePath, param).then(function (response, status, headers, config) 
    {
      $.loader('close');
      if(response.data.d !== null)
      {
        if($scope.startIndex === undefined){
          $scope.startIndex=10;
        }
         $scope.seaContent=response.data.d;
         $scope.norecordsShow="false";
         $scope.totalRecords=response.data.d[0].TotalResults;
         $scope.searc_content="Search Results";
         $scope.showsearch=true;
         $scope.showRecomend=false;
         $scope.showPopular=false;
         $scope.showRecomendCont=false;
         $scope.showPopularCont=false;
         $scope.showSearchCont=true;
         $scope.nextPrevShow=true;
          $('.sea_cont').slimScroll({
            wheelStep: 10,
            height   : "15vw",
            width    : "99%"
          });

          if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
            $('.popular_cont').parent().addClass("popcontShow");
          }
          if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
            $('.sea_cont').parent().removeClass("popcontShow");
          }
      }
      else
      {
          $scope.seaContent="";
         $scope.norecordsShow="true";
         $scope.searc_content="Search Results";
         $scope.showsearch=true;
         $scope.showRecomend=false;
         $scope.showPopular=false;
         $scope.showRecomendCont=false;
         $scope.showPopularCont=false;
         $scope.nextPrevShow=false;
          if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
            $('.popular_cont').parent().addClass("popcontShow");
          }
         if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
            $('.sea_cont').parent().addClass("popcontShow");
          }
      }

    }).error(function (serverResponse, status, headers, config) {
      $.loader('close');
    });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','searchCont',e,$rootScope.getglobaldata.Client);
  } 
}

function popularkbContentview(ngDialog,$scope,$http,$cookieStore,$rootScope,Id,Originid,originname)
{     
  try
  { 
     $rootScope.isnewpage=true;
      var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"GetContent";                      
      var params = '{ "answerContentID":' + Id + ', "viewOriginID" : ' + Originid + ', "viewOriginName" : "' + originname + '"}';      
      $http.post(servicePath, params).success(function (result) 
          { 
            $.loader('close');
            if (result.d === null) {
              var headerText = ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.APPHDRGEARHEAD : $rootScope.getglobalErrorMessage.APPLICATIONHDR;
              var buttonText = $rootScope.getglobalErrorMessage.BTNOK;
              var messageText= $rootScope.getglobalErrorMessage.INFOKBSEARCH;
              showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
            } 
            else{
                $(".right_bg_cont").empty();  
              result = "<div class='data_cont'><div class='cont_title'>" + "Knowledge Base" + "</div></br><div class='container_mid'><div style='margin-left: 0.2vw;background-color: whitesmoke;'><p><h4>" + result.d.Title + "</h4></p></div><div class='redirectPage' style='overflow:scroll !important;height:27vw; margin-top:1vw;'><span style='transform: scale(0.83); width: 100vw;' >" + result.d.Excerpt + "</span></div></div></div>";                                       
               $(".right_bg_cont").html(result) ;

            }           
            // $('.redirectPage').slimScroll({
            //   wheelStep: 2,
            //   height   : "26vw",
            //   width    : "98%"
            // }); 
        }).error(function (serverResponse, status, headers, config) {
          $.loader('close');
        });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','popularkbContentview',e,$rootScope.getglobaldata.Client);
  } 
}

function modelSearch()
{
  window.external.modelSearchRedirection();
}


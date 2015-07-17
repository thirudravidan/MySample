

function messageCount($rootScope)
{
	var param='';
	if ($rootScope.getglobaldata.Client === 'GearHead') {
            param = { "customerId": localStorage.getItem('StoredCustomerID') };
         }
         else{
           param= { "customerID": localStorage.getItem('StoredCustomerID') };
         }
         return param;
}

function customerProductInfo($rootScope)
{
	var param='';
	if ($rootScope.getglobaldata.Client === 'GearHead') {
             param = { "customerId": parseInt(localStorage.getItem('StoredCustomerID'),10) };
     }
     else{
       param = '{ "customerID":' + parseInt(localStorage.getItem('StoredCustomerID'),10) + ',"email": "","address": ""}';
     }
    return param;
}

function createScheduleCase($scope,$rootScope,scheduleCall)
{
	if ($rootScope.getglobaldata.Client === 'GearHead') {
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CreateCase";
	}
	else{
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "ScheduleaCall";
	} 
     
	if ($rootScope.getglobaldata.Client === 'GearHead') {
             param ='{ "customerId":0, "registrationId": 0, "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + encodeURIComponent($scope.scheduleProblemTitle) + '", "caseCauses": "", "caseNotes": "' + encodeURIComponent($scope.scheduleProblemDescription) + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
     }
     else{
       param ='{ "customerId":'+ parseInt(localStorage.getItem('StoredCustomerID'),10) +', "registrationId": '+ $scope.selectedproduct.RegistrationId +', "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + encodeURIComponent($scope.scheduleProblemTitle) + '", "caseCauses": "", "caseNotes": "' + encodeURIComponent($scope.scheduleProblemDescription) + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
     }
  
    //return serviceData;
    return {"param":param,"servicePath":servicePath};
}

function createNewWebTicket($scope,$rootScope,txtSummary,txtProblem)
{
	if ($rootScope.getglobaldata.Client === 'GearHead') {
             params = '{ "customerId":0, "registrationId": 0, "serialNumber": "' + $scope.selectedproductdet.SerialNo +
                        '", "caseSummary": "' + txtSummary + '","caseProblem": "", "caseCauses": "", "caseNotes": "' + txtProblem +
                        '", "caseSource":"Online", "caseAssingTo":"", "caseQueueId":63}';
     }
     else{
       params = '{ "customerId":"' + parseInt(localStorage.getItem('StoredCustomerID'),10) + '", "registrationId": "0", "serialNumber": "' + $scope.selectedproductdet.SerialNo +
                        '", "caseSummary": "' + txtSummary + '","caseProblem": "", "caseCauses": "", "caseNotes": "' + txtProblem +
                        '", "caseSource":"Online", "caseAssingTo":"css@cssconnect.com", "caseQueueId":63}';
     }
  
    return params;
}

function customerGetProduct($scope,$rootScope,customerId,customerEmail)
{

	if ($rootScope.getglobaldata.Client === 'GearHead') {
         param = '{ "customerId":' + customerId + ', "customerEmail":"' + customerEmail + '", "customerPhoneNo":"", "customerIsoCountry":"", "customerExactPhone":0}';
     }
     else{
       param = '{ "customerId":'+ customerId +', "email": "'+customerEmail+'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
     }
    return param;
}

function customerrenewProductDetails($scope,$rootScope,customerId,contractId)
{
	if ($rootScope.getglobaldata.Client === 'GearHead') {
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetContractsByContractId";
	}
	else{
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct";
	}

if ($rootScope.getglobaldata.Client === 'GearHead') {
     param = '{ "customerId" : ' + customerId + ', "contractId" : ' + contractId + '}';
 }
 else{
   param = '{ "customerId":'+ customerId +', "email": "'+localStorage.getItem("CustomerEmail")+'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
 }
	return {"param":param,"servicePath":servicePath};
}
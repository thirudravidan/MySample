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
var networkdata;
var myinfo;
angular.module('activei.networkmap', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('networkmap', {
        url: '/networkmap',
        views: {
            "RightView": {
                templateUrl: "systemtools/networktools/networkmap/networkmap.tpl.html",
                controller: "networkmapController"
            }
        },
        data: { pageTitle: 'Network Map' }
    });
})
/**
* And of course we define a controller for our route.
*/
.directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
})
.controller('networkmapController', function networkmapController($scope, $rootScope, $http, $state, $cookieStore, ngDialog) {
    $rootScope.isMiddleCont = true;

    $scope.loadDevices = function () {
        var connectedDev = window.external.loaddevices();
        var parsedDevices = JSON.parse(connectedDev);
        $scope.parsedDeviceList = parsedDevices;
        $scope.devList = parsedDevices.DeviceList;
        networkdata = parsedDevices;
         // networkdata = getData();

        // var param = { ipAddress: "C81F664331F1" };
        // $http.post("http://devis.csscorp.com/CSSConnect/CSSConnectClientService/CSSNetgearService/NetgearClientService.asmx/GetNetworkMapDeviceDetails", param).success(function (result, status, headers, config) {
        var param = { ipAddress: $rootScope.myinfo.MACAddress };
        $http.post($rootScope.getglobaldata.getGlobalServiceUrl + "GetNetworkMapDeviceDetails", param).success(function (result, status, headers, config) {
            $.each(networkdata.DeviceList.LANList, function (i, lann) {
                lann.Show = true;
            });
            $.each(networkdata.DeviceList.USBList, function (i, usbb) {
                usbb.Show = true;
            });
            $.each(networkdata.DeviceList.PrinterList, function (i, printerr) {
                printerr.Show = true;
            });
            $.each(networkdata.DeviceList.NetworkAdapterList, function (i, adpp) {
                adpp.Show = true;
            });
            if (result.d == null) {
                loadNetworkmap(0, null, true, true, $scope, $rootScope, $http);
                return;
            }
            var networklog = JSON.parse(result.d.DeviceDetails).DeviceList;

            if (networklog.Genie.MACAddress == networkdata.DeviceList.Genie.MACAddress) {
                networkdata.DeviceList.Genie.AlliasName = networklog.Genie.AlliasName;
            }

            $.each(networklog.LANList, function (idx, lan) {
                var status = false;
                $.each(networkdata.DeviceList.LANList, function (i, lann) {
                    if (lan.MACAddress == lann.MACAddress) {
                        status = true;
                        lann.AlliasName = lan.AlliasName;
                    }
                });
                if (!status) {
                    lan.Show = false;
                    networkdata.DeviceList.LANList.push(lan);
                }
            });
            $.each(networklog.USBList, function (idx, usb) {
                var status = false;
                $.each(networkdata.DeviceList.USBList, function (i, usbb) {
                    if (usb.VendorId == usbb.VendorId && usb.ProductID == usbb.ProductID) {
                        status = true;
                        usbb.AlliasName = usb.AlliasName;
                    }
                });
                if (!status) {
                    usb.Show = false;
                    networkdata.DeviceList.USBList.push(usb);
                }
            });

            $.each(networklog.PrinterList, function (idx, printer) {
                var status = false;
                $.each(networkdata.DeviceList.PrinterList, function (i, printerr) {
                    if (printer.DeviceID == printerr.DeviceID) {
                        status = true;
                        printerr.AlliasName = printer.AlliasName;
                    }
                });
                if (!status) {
                    printer.Show = false;
                    networkdata.DeviceList.PrinterList.push(printer);
                }
            });

            $.each(networklog.NetworkAdapterList, function (idx, adp) {
                var status = false;
                $.each(networkdata.DeviceList.NetworkAdapterList, function (i, adpp) {
                    if (adp.Name == adpp.Name) {
                        status = true;
                        adpp.AlliasName = adp.AlliasName;
                    }
                });
                if (!status) {
                    adp.Show = false;
                    networkdata.DeviceList.NetworkAdapterList.push(adp);
                }
            });
            loadNetworkmap(0, null, true, true, $scope, $rootScope, $http);
        }).error(function (e) {
            alert('Error');
        });
    };

    $scope.loadNetMap = function (wch, lnk, ispaging, isload) {
        loadNetworkmap(wch, lnk, ispaging, isload, $scope, $rootScope, $http);
    };
});

function getData() {
    return {
        "IPAddress": "10.20.28.100",
        "MACAddress": "001794489FC7",
        "Status": "Online",
        "DeviceList": {
            "Genie": {
                "MachineName": "HDC0007165",
                "IPAddress": "10.20.28.30",
                "MACAddress": "C81F664331F1",
                "HostName": "HDC0007165.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": null
            },
            "LANList": [
            {
                "MachineName": "HDC0005434",
                "IPAddress": "10.20.28.11",
                "MACAddress": "4437E620C6EB",
                "HostName": "HDC0005434.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "HDC0007094",
                "IPAddress": "10.20.28.34",
                "MACAddress": "C81F66433148",
                "HostName": "HDC0007094.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "HDC0007185",
                "IPAddress": "10.20.28.37",
                "MACAddress": "C81F66433403",
                "HostName": "HDC0007185.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "HDC0007190",
                "IPAddress": "10.20.28.3",
                "MACAddress": "C81F66433104",
                "HostName": "HDC0007190.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "HDC0007313",
                "IPAddress": "10.20.28.24",
                "MACAddress": "C81F663191F8",
                "HostName": "HDC0007313.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "HDC0007379",
                "IPAddress": "10.20.28.35",
                "MACAddress": "C81F66311CC4",
                "HostName": "HDC0007379.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "LAP-01-1165",
                "IPAddress": "10.20.28.18",
                "MACAddress": "1C659DA9F6FC",
                "HostName": "LAP-01-1165.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "LAP-01-1589",
                "IPAddress": "10.20.28.20",
                "MACAddress": "047D7B154F28",
                "HostName": "LAP-01-1589.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            },
            {
                "MachineName": "LAP-05-1850",
                "IPAddress": "10.20.31.91",
                "MACAddress": "001794489FC7",
                "HostName": "LAP-05-1850.ad.csscorp.com",
                "Status": "Active",
                "AddressFamily": "InterNetwork",
                "FriendlyName": ""
            }
        ],
            "USBList": [
            {
                "DeviceName": null,
                "DeviceId": "USB\\VID_0461&PID_4E22\\6&298C69D9&0&1",
                "VendorId": "0461",
                "ProductID": "4E22",
                "Status": "OK",
                "DeviceList": [
                    {
                        "FriendlyName": "",
                        "DeviceDescription": "USB Input Device",
                        "DeviceType": "",
                        "DeviceManufacturer": "(Standard system devices)",
                        "DeviceClass": "HIDClass",
                        "DeviceLocation": "Port_#0001.Hub_#0003",
                        "DevicePath": "PCIROOT(0)#PCI(1A00)#USBROOT(0)#USB(1)#USB(1)",
                        "DevicePhysicalObjectName": "\\Device\\USBPDO-4",
                        "COMPort": ""
                    }
                ]
            },
            {
                "DeviceName": null,
                "DeviceId": "USB\\VID_413C&PID_2107\\6&55CE37D&0&5",
                "VendorId": "413C",
                "ProductID": "2107",
                "Status": "OK",
                "DeviceList": [
                    {
                        "FriendlyName": "",
                        "DeviceDescription": "USB Input Device",
                        "DeviceType": "",
                        "DeviceManufacturer": "(Standard system devices)",
                        "DeviceClass": "HIDClass",
                        "DeviceLocation": "Port_#0005.Hub_#0004",
                        "DevicePath": "PCIROOT(0)#PCI(1D00)#USBROOT(0)#USB(1)#USB(5)",
                        "DevicePhysicalObjectName": "\\Device\\USBPDO-5",
                        "COMPort": ""
                    }
                ]
            }
        ],
            "SerialPortList": [],
            "ParallelPortList": [],
            "PrinterList": [
            {
                "Name": "Microsoft XPS Document Writer",
                "DeviceID": "Microsoft XPS Document Writer",
                "IsDefault": "False",
                "isNetworkPrinter": "False",
                "IPAddress": "-",
                "Status": "Ok",
                "FriendlyName": ""
            },
            {
                "Name": "Fax",
                "DeviceID": "Fax",
                "IsDefault": "False",
                "isNetworkPrinter": "False",
                "IPAddress": "-",
                "Status": "Ok",
                "FriendlyName": ""
            },
            {
                "Name": "\\\\INCHEAMVW041\\AM-6F-CIOG-COMMON",
                "DeviceID": "\\\\INCHEAMVW041\\AM-6F-CIOG-COMMON",
                "IsDefault": "True",
                "isNetworkPrinter": "True",
                "IPAddress": "-",
                "Status": "Ok",
                "FriendlyName": ""
            }
        ],
            "NetworkAdapterList": [
            {
                "Id": "{1FCA7B03-7857-404E-983B-A40C91B6C08D}",
                "Name": "Ethernet",
                "NetworkInterfaceType": "Ethernet",
                "Description": "Realtek PCIe GBE Family Controller",
                "OperationalStatus": "Up",
                "Speed": "100000000",
                "SupportsMultiCast": "True",
                "FriendlyName": ""
            },
            {
                "Id": "{BBED3E08-0B41-11E3-8249-806E6F6E6963}",
                "Name": "Loopback Pseudo-Interface 1",
                "NetworkInterfaceType": "Loopback",
                "Description": "Software Loopback Interface 1",
                "OperationalStatus": "Up",
                "Speed": "1073741824",
                "SupportsMultiCast": "True",
                "FriendlyName": ""
            },
            {
                "Id": "{F8DEBA8D-A1C5-4E0A-B89E-65289F2433B0}",
                "Name": "isatap.ad.csscorp.com",
                "NetworkInterfaceType": "Tunnel",
                "Description": "Microsoft ISATAP Adapter",
                "OperationalStatus": "Down",
                "Speed": "100000",
                "SupportsMultiCast": "False",
                "FriendlyName": ""
            }
        ]
        }
    };
}

// $scope.serviceurl = $rootScope.getglobaldata.getServiceURL;
// $scope.myinfo = $rootScope.myinfo;

// var scanners, adapters, printers, usbs;
// $scope.loadDevices = function () {
//     try {
//         if ($rootScope.userDetails.IsNetwork === 'True') {
//             showmap($scope, $rootScope);
//         }
//         else {
//             offlineshowmap();
//         }
//     }
//     catch (ex) {
//         // stackTrace(ex);
//         stackTrace('networkmapController','loadDevices',ex,$rootScope.getglobaldata.Client);
//     }
// };

// $scope.adddevicesList = function () {
//     adddevices($scope);
// };

// $scope.removedevicesList = function () {
//     $scope.msgDescription = $rootScope.getglobalErrorMessage.INFOREMOVEDEVICE;
//     $scope.headerText = $rootScope.getglobalErrorMessage.HDRNETWORKMAP;
//     $scope.confirmOk = $rootScope.getglobalErrorMessage.BTNYES;
//     $scope.confirmCancel = $rootScope.getglobalErrorMessage.BTNNO;
//     ngDialog.openConfirm(
//         {
//             template: 'confirmdialog',
//             className: 'ngdialog-theme-default',
//             scope: $scope
//         }
//         )
//         .then(function (value) {
//             removedevices($scope);
//         }, function (value) {

//         });
// };

// $scope.updateDeviceDetails = function (lnk) {
//     var deviceindex = $($(lnk).parent()).attr('deviceindex');
//     var devlistindex = $($(lnk).parent()).attr('devlistindex');
//     var specificdevindex = $($(lnk).parent()).attr('specificdevindex');
//     var usbclassindex = $($(lnk).parent()).attr('usbclassindex');
//     var alliasname;

//     if ($(lnk).hasClass('lan')) {
//         if ($(lnk).hasClass('save')) {
//             alliasname = $(lnk).closest('table').find('.allias').find('input').val();
//             $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].AlliasName = alliasname;
//             if (alliasname === '') {
//                 $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
//                 return;
//             }
//         }
//         else if ($(lnk).hasClass('add')) {
//             $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].IsRemove = false;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].Class = '';
//         }
//         else {
//             //$scope.mydevicelist[deviceindex].devList[devlistindex].LANList.splice(specificdevindex, 1);
//             $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].IsRemove = true;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].Class = 'disable';
//         }
//     }
//     else if ($(lnk).hasClass('uusb')) {
//         if ($(lnk).hasClass('save')) {
//             alliasname = $(lnk).closest('table').find('.allias').find('input').val();
//             $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList[usbclassindex].AlliasName = alliasname;
//             if (alliasname === '') {
//                 $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
//                 return;
//             }
//         }
//         else if ($(lnk).hasClass('add')) {
//             $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].IsRemove = false;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].Class = '';
//         }
//         else {
//             //$scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList.splice(usbclassindex, 1);
//             //$scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList[usbclassindex].IsRemove = true;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].IsRemove = true;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].Class = 'disable';
//         }
//     }
//     else if ($(lnk).hasClass('pprinter')) {
//         if ($(lnk).hasClass('save')) {
//             alliasname = $(lnk).closest('table').find('.allias').find('input').val();
//             $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].AlliasName = alliasname;
//             if (alliasname === '') {
//                 $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
//                 return;
//             }
//         }
//         else if ($(lnk).hasClass('add')) {
//             $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].IsRemove = false;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].Class = '';
//         }
//         else {
//             //$scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList.splice(specificdevindex, 1);
//             $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].IsRemove = true;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].Class = 'disable';
//         }
//     }
//     else if ($(lnk).hasClass('pnetwork')) {
//         if ($(lnk).hasClass('save')) {
//             alliasname = $(lnk).closest('table').find('.allias').find('input').val();
//             $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].AlliasName = alliasname;
//             if (alliasname === '') {
//                 $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
//                 return;
//             }
//         }
//         else if ($(lnk).hasClass('add')) {
//             $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].IsRemove = false;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].Class = '';
//         }
//         else {
//             //$scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList.splice(specificdevindex, 1);
//             $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].IsRemove = true;
//             $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].Class = 'disable';
//         }
//     }

//     adddevices($scope, deviceindex, devlistindex);
//     bindnetworkmap($scope); tooltip.hide();
// };
// function offlineshowmap() {
//     showLoader();
//     $('.btnrenewal_position .netgearbtncolor').remove();
//     var connectedDev = window.external.loaddevices();
//     var parsedDevices = JSON.parse(connectedDev);

//     binddevice(parsedDevices.DeviceList, 0, 0, false);

//     $.loader('close');
// }

// function showmap($scope, $rootScope) {
//     try {
//         var params = { username: localStorage.getItem("StoredCustomerID") };

//        showLoader();
//        $.ajax({
//            type: "POST",
//            url: $scope.serviceurl + "getDevice",
//            data: params,
//            success: function (d) {
//              //alert(JSON.stringify(d));

//                //prevoius data
//                // $scope.mydevicelist = d.success.devices;
//  //alert(JSON.stringify($scope.mydevicelist));
//                //current data
//                var connectedDev = window.external.loaddevices();
//                var parsedDevices = JSON.parse(connectedDev);
//                $scope.parsedDeviceList = parsedDevices;
//                $scope.devList = parsedDevices.DeviceList;


//                //New code

//                if (d.success == null) {
//                    $scope.mydevicelist = [];
//                    $.each($scope.devList.LANList, function (idx, rec) {
//                        rec.Class = 'new';
//                    });

//                    $.each($scope.devList.USBList, function (idx, rec) {
//                        rec.Class = 'new';

//                    });

//                    $.each($scope.devList.PrinterList, function (idx, rec) {
//                        rec.Class = 'new';

//                    });

//                    $.each($scope.devList.NetworkAdapterList, function (idx, rec) {
//                        rec.Class = 'new';
//                    });
//                }
//                else {
//                    $scope.mydevicelist = d.success.devices;
//                }

//                $.each($scope.mydevicelist, function (idx, rec) {//devices
//                    var devlsit = [];
//                    if (rec.macAdd == $scope.myinfo.MACAddress) {
//                        devlsit = rec.devList;
//                    }

//                    $.each(devlsit, function (i, lan) {//devlist
//                        $.each($scope.devList.LANList, function (ctidx, ctrec) {
//                            var status = false;
//                            $.each(lan.LANList, function (ii, l) {
//                                if (ctrec.MACAddress == l.MACAddress) {
//                                    status = true;
//                                    if (l.IsRemove === true) {
//                                        ctrec.IsRemove = true;
//                                        ctrec.Class = 'disable';
//                                    }
//                                }
//                            });
//                            if (status === false) {
//                                ctrec.Class = 'new';
//                            }
//                        });

//                        $.each(lan.LANList, function (ii, l) {//lanlist
//                            var status = false;
//                            $.each($scope.devList.LANList, function (ctidx, ctrec) {
//                                if (l.MACAddress == ctrec.MACAddress) {
//                                    status = true;
//                                    if (l.AlliasName !== undefined) {
//                                        ctrec.AlliasName = l.AlliasName;
//                                    }
//                                }
//                            });
//                            if (status === false) {
//                                l.Status = 'Inactive';
//                                l.Class = 'not';
//                                $scope.devList.LANList.push(l);
//                            }
//                        });

//                        $.each($scope.devList.USBList, function (ctidx, ctrec) {
//                            var status = false;
//                            $.each(lan.USBList, function (si, l) {
//                                if (ctrec.VendorId == l.VendorId && ctrec.ProductID == l.ProductID) {
//                                    status = true;
//                                    if (l.IsRemove === true) {
//                                        ctrec.IsRemove = true;
//                                        ctrec.Class = 'disable';
//                                    }
//                                    ctrec.DeviceList = l.DeviceList;
//                                }
//                            });
//                            if (status === false) {
//                                ctrec.Class = 'new';
//                            }
//                        });

//                        $.each(lan.USBList, function (si, l) {
//                            var status = false;
//                            $.each($scope.devList.USBList, function (ctidx, ctrec) {
//                                if (l.VendorId == ctrec.VendorId && l.ProductID == ctrec.ProductID) {
//                                    status = true;
//                                    ctrec.DeviceList = l.DeviceList;
//                                }
//                            });
//                            if (status === false) {
//                                l.Status = 'Inactive';
//                                l.Class = 'not';
//                                $scope.devList.USBList.push(l);
//                            }
//                        });

//                        $.each($scope.devList.PrinterList, function (ctidx, ctrec) {
//                            var status = false;
//                            $.each(lan.PrinterList === undefined ? [] : lan.PrinterList, function (pidx, prec) {
//                                if (ctrec.DeviceID == prec.DeviceID) {
//                                    status = true;
//                                    if (prec.IsRemove === true) {
//                                        ctrec.IsRemove = true;
//                                        ctrec.Class = 'disable';
//                                    }
//                                    if (prec.AlliasName !== undefined) {
//                                        ctrec.AlliasName = prec.AlliasName;
//                                    }
//                                }
//                            });
//                            if (status === false) {
//                                ctrec.Class = 'new';
//                            }
//                        });

//                        $.each(lan.PrinterList === undefined ? [] : lan.PrinterList, function (pidx, prec) {//lanlist
//                            var status = false;
//                            $.each($scope.devList.PrinterList, function (ctidx, ctrec) {
//                                if (prec.DeviceID == ctrec.DeviceID) {
//                                    status = true;
//                                    if (prec.AlliasName !== undefined) {
//                                        ctrec.AlliasName = prec.AlliasName;
//                                    }
//                                }
//                            });
//                            if (status === false) {
//                                prec.Status = 'Inactive';
//                                prec.Class = 'not';
//                                $scope.devList.PrinterList.push(prec);
//                            }
//                        });

//                        $.each($scope.devList.NetworkAdapterList, function (ctidx, ctrec) {
//                            var status = false;
//                            $.each(lan.NetworkAdapterList === undefined ? [] : lan.NetworkAdapterList, function (pidx, prec) {
//                                if (prec.Id == ctrec.Id) {
//                                    status = true;
//                                    if (prec.IsRemove === true) {
//                                        ctrec.IsRemove = true;
//                                        ctrec.Class = 'disable';
//                                    }
//                                    if (prec.AlliasName !== undefined) {
//                                        ctrec.AlliasName = prec.AlliasName;
//                                    }
//                                }
//                            });
//                            if (status === false) {
//                                ctrec.Class = 'new';
//                            }
//                        });

//                        $.each(lan.NetworkAdapterList === undefined ? [] : lan.NetworkAdapterList, function (pidx, prec) {//lanlist
//                            var status = false;
//                            $.each($scope.devList.NetworkAdapterList, function (ctidx, ctrec) {
//                                if (prec.Id == ctrec.Id) {
//                                    status = true;
//                                    if (prec.AlliasName !== undefined) {
//                                        ctrec.AlliasName = prec.AlliasName;
//                                    }
//                                }
//                            });
//                            if (status === false) {
//                                prec.Status = 'Inactive';
//                                prec.Class = 'not';
//                                $scope.devList.NetworkAdapterList.push(prec);
//                            }
//                        });

//                    });
//                });

//                var devicelist = JSON.stringify($scope.devList);

//                var params = { username: localStorage.getItem("StoredCustomerID"), devType: "desktop", name: $scope.myinfo.MachineName, ipaddress: $scope.myinfo.IPAddress, macAdd: $scope.myinfo.MACAddress, devList: devicelist };
//                // alert(JSON.stringify(params));
//                $.ajax({
//                    type: "POST",
//                    url: $rootScope.getglobaldata.getServiceURL + "addDevice",
//                    data: params,
//                    success: function (d) {
//                        $.loader('close');
//                        getdevices($scope);
//                    },
//                    error: function (e) {
//                        $.loader('close');
//                    }
//                });

//            },
//            error: function (e) {
//                $.loader('close');
//                //alert("failed");
//            }
//        });
//     }
//     catch (ex) {
//         // stackTrace(ex);
//         stackTrace('networkmapController','showmap',ex,$rootScope.getglobaldata.Client);
//     }
// }

// function tooltipbtnclk(lnk) {
//     angular.element(document.getElementById('rightCont')).scope().updateDeviceDetails(lnk);
// }

// function getdevices($scope) {
//     try {
//         var params = { username: localStorage.getItem("StoredCustomerID") };
//         $.ajax({
//             type: "POST",
//             url: $scope.serviceurl + "getDevice",
//             data: params,
//             success: function (d) {
//                 $scope.mydevicelist = d.success.devices;
//                 bindnetworkmap($scope);
//             },
//             error: function (e) {
//                 //alert("failed");
//             }
//         });
//     }
//     catch (ex) {
//         // stackTrace(ex);
//     }
// }

// function adddevices($scope, deviceindex, devlistindex) {
//     try {
//         var devicelist = JSON.stringify($scope.mydevicelist[deviceindex].devList[devlistindex]);
//         //alert(devicelist);
//         var params = { username: localStorage.getItem("StoredCustomerID"), devType: "desktop",name: $scope.myinfo.MachineName,ipaddress: $scope.myinfo.IPAddress, macAdd: $scope.myinfo.MACAddress, devList: devicelist };
//         //alert(JSON.stringify(params));
//         $.ajax({
//             type: "POST",
//             url: $scope.serviceurl + "addDevice",
//             data: params,
//             success: function (d) {
//                 //alert("success");
//             },
//             error: function (e) {
//               //  alert(JSON.stringify(e));
//             }
//         });
//     }
//     catch (ex) {
//         // stackTrace(ex);
//     }
// }

// function removedevices($scope) {
//     try {
//         var params = { username: localStorage.getItem("StoredCustomerID"), macAdd: $scope.myinfo.MACAddress };
//         //alert(JSON.stringify(params));
//         $.ajax({
//             type: "POST",
//             url: $scope.serviceurl + "removeDevice",
//             data: params,
//             success: function (d) {
//                 bindnetworkmap($scope);
//             },
//             error: function (e) {
//                // alert("failed");
//             }
//         });
//     }
//     catch (ex) {
//         // stackTrace(ex);
//     }
// }

// function binddevice(lan, idx, i,isonline) {
//     $('.networkmap .lanlist').html('');
//     $.each(lan.LANList, function (ii, l) {//lanlist
//         if (l.IsRemove === true && l.Class == 'not') {
//         }
//         else{
//             var tooltip = '<table>';
//             if (isonline) {
//                 if (l.Class == 'not') {
//                     tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;" + l.MachineName + "</td></tr>";
//                 }
//                 else {
//                     if (l.IsRemove === true) {
//                         tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;" + l.MachineName + "</td></tr>";
//                     }
//                     else {
//                         tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + l.MachineName + "'/></td></tr>";
//                     }
//                 }
//             }
//             else {
//                 tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;" + l.MachineName + "</td></tr>";
//             }
//             tooltip += "<tr><td>IP Address</td><td>&nbsp;:&nbsp;" + l.IPAddress + "</td></tr>";
//             tooltip += "<tr><td>MAC Address</td><td>&nbsp;:&nbsp;" + l.MACAddress + "</td></tr>";
//             tooltip += "<tr><td>Host Name</td><td>&nbsp;:&nbsp;" + l.HostName + "</td></tr>";
//             tooltip += "<tr><td>Status</td><td>&nbsp;:&nbsp;" + l.Status + "</td></tr>";
//             if (isonline) {
//                 tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";

//                 if (l.Class != 'not') {
//                     if (l.IsRemove === true) {
//                         tooltip += "<tr><td class='tooltip-lanlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button onclick='tooltipbtnclk(this);' class='map-btn lan add' type='button'>Add Device</button></td></tr>";
//                     }
//                     else {
//                         tooltip += "<tr><td class='tooltip-lanlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button class='map-btn lan save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn lan remove' type='button'>Remove Device</button></td></tr>";
//                     }
//                 }
//             }
//             tooltip += "</table>";                                                   //deviceindex,devlistindex,specificdevindex   //ondblclick="return changeAlliasName(this);"
//             $('.networkmap .lanlist').append('<div class="lanlst"><div class="machine ' + l.Class + '"></div><li deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + ii + '"  title="' + tooltip + '">' + (l.AlliasName === undefined ? l.MachineName : l.AlliasName) + '</li></div>');
//         }
//     });

//     if ($('.networkmap .lanlist').html() === '') {
//         $('.networkmap .lanlist').html('No LAN Machine Available');
//     }

//     $('.networkmap .usblist').html('');
//     $.each(lan.USBList, function (si, l) {
//         if (l.IsRemove === true && l.Class == 'not') {}
//         else
//         {
//             $.each(l.DeviceList, function (iii, recc) {
//                 var tooltip = '<table>';
//                 if (isonline) {
//                     if (l.Class == 'not') {
//                         tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "</td></tr>";
//                     }
//                     else {
//                         if (l.IsRemove === true) {
//                             tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "</td></tr>";
//                         }
//                         else {
//                             tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "'/></td></tr>";
//                         }
//                     }
//                 }
//                 else {
//                     tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "</td></tr>";
//                 }
//                 tooltip += "<tr><td>VendorID</td><td>&nbsp;:&nbsp;" + l.VendorId + "</td></tr>";
//                 tooltip += "<tr><td>ProductID</td><td>&nbsp;:&nbsp;" + l.ProductID + "</td></tr>";
//                 tooltip += "<tr><td>DeviceID</td><td>&nbsp;:&nbsp;" + l.DeviceId + "</td></tr>";
//                 tooltip += "<tr><td>Device Class</td><td>&nbsp;:&nbsp;" + recc.DeviceClass + "</td></tr>";
//                 tooltip += "<tr><td>Device Manufacturer</td><td>&nbsp;:&nbsp;" + recc.DeviceManufacturer + "</td></tr>";
//                 tooltip += "<tr><td>Device Description</td><td>&nbsp;:&nbsp;" + recc.DeviceDescription + "</td></tr>";
//                 tooltip += "<tr><td>Status</td><td>&nbsp;:&nbsp;" + l.Status + "</td></tr>";
//                 if (isonline) {
//                     tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";
//                     if (l.Class != 'not') {
//                         if (l.IsRemove === true) {
//                             tooltip += "<tr><td class='tooltip-usblist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + si + "' usbclassindex='" + iii + "'><button onclick='tooltipbtnclk(this);' class='map-btn uusb add' type='button'>Add Device</button></td></tr>";
//                         }
//                         else {
//                             tooltip += "<tr><td class='tooltip-usblist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + si + "' usbclassindex='" + iii + "'><button class='map-btn uusb save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn uusb remove' type='button'>Remove Device</button></td></tr>";
//                         }
//                     }
//                 }
//                 tooltip += "</table>";                                                              //ondblclick = "return changeAlliasName(this);"
//                 $('.networkmap .usblist').append('<div class="usblst"><div class="usb ' + l.Class + '"></div><li deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + si + '" usbclassindex="' + iii + '" title="' + tooltip + '">' + (recc.AlliasName === undefined ? (recc.FriendlyName === "" ? recc.DeviceClass : recc.FriendlyName) : recc.AlliasName) + '</li></div>');
//             });
//         }
//     });

//     if ($('.networkmap .usblist').html() === '') {
//         $('.networkmap .usblist').html('No USB Device Available');
//     }

//     $('.networkmap .printerlist').html('');
//     $.each(lan.PrinterList, function (ii, l) {//lanlist
//         if (l.IsRemove === true && l.Class == 'not') {}
//         else
//         {
//             var tooltip = '<table>';
//             if (isonline) {
//                 if (l.Class == 'not') {
//                     tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
//                 }
//                 else {
//                     if (l.IsRemove === true) {
//                         tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
//                     }
//                     else {
//                         tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + l.Name + "'/></td></tr>";
//                     }
//                 }
//             }
//             else {
//                 tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
//             }
//             tooltip += "<tr><td>Is Default</td><td>&nbsp;:&nbsp;" + l.IsDefault + "</td></tr>";
//             tooltip += "<tr><td>IsNetwork Printer</td><td>&nbsp;:&nbsp;" + l.isNetworkPrinter + "</td></tr>";
//             tooltip += "<tr><td>Device ID</td><td>&nbsp;:&nbsp;" + l.DeviceID + "</td></tr>";
//             tooltip += "<tr><td>IP Address</td><td>&nbsp;:&nbsp;" + l.IPAddress + "</td></tr>";
//             tooltip += "<tr><td>Status</td><td>&nbsp;:&nbsp;" + l.Status + "</td></tr>";
//             if (isonline) {
//                 tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";
//                 if (l.Class != 'not') {
//                     if (l.IsRemove === true) {
//                         tooltip += "<tr><td class='tooltip-printerlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button onclick='tooltipbtnclk(this);' class='map-btn pprinter add' type='button'>Add Device</button></td></tr>";
//                     }
//                     else {
//                         tooltip += "<tr><td class='tooltip-printerlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button class='map-btn pprinter save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn pprinter remove' type='button'>Remove Device</button></td></tr>";
//                     }
//                 }
//             }
//             tooltip += "</table>";                                                   //deviceindex,devlistindex,specificdevindex   //ondblclick="return changeAlliasName(this);"
//             $('.networkmap .printerlist').append('<div class="printerlst"><div class="printer ' + l.Class + '"></div><li style="max-width:150px;" deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + ii + '"  title="' + tooltip + '">' + (l.AlliasName === undefined ? l.Name : l.AlliasName) + '</li></div>');
//         }
//     });

//     if ($('.networkmap .printerlist').html() === '') {
//         $('.networkmap .printerlist').html('No Printer Available');
//     }

//     $('.networkmap .networklist').html('');
//     $.each(lan.NetworkAdapterList, function (ii, l) {//lanlist
//         if (l.IsRemove === true && l.Class == 'not') { }
//         else {
//             var tooltip = '<table>';
//             if (isonline) {
//                 if (l.Class == 'not') {
//                     tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
//                 }
//                 else {
//                     if (l.IsRemove === true) {
//                         tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
//                     }
//                     else {
//                         tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + l.Name + "'/></td></tr>";
//                     }
//                 }
//             }
//             else {
//                 tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
//             }
//             tooltip += "<tr><td>NetworkInterface Type</td><td>&nbsp;:&nbsp;" + l.NetworkInterfaceType + "</td></tr>";
//             tooltip += "<tr><td>Description</td><td>&nbsp;:&nbsp;" + l.Description + "</td></tr>";
//             tooltip += "<tr><td>Operational Status</td><td>&nbsp;:&nbsp;" + l.OperationalStatus + "</td></tr>";
//             tooltip += "<tr><td>Speed</td><td>&nbsp;:&nbsp;" + l.Speed + "</td></tr>";
//             tooltip += "<tr><td>Support MultiCast</td><td>&nbsp;:&nbsp;" + l.SupportsMultiCast + "</td></tr>";
//             if (isonline) {
//                 tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";
//                 if (l.Class != 'not') {
//                     if (l.IsRemove === true) {
//                         tooltip += "<tr><td class='tooltip-networklist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button onclick='tooltipbtnclk(this);' class='map-btn pnetwork add' type='button'>Add Device</button></td></tr>";
//                     }
//                     else {
//                         tooltip += "<tr><td class='tooltip-networklist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button class='map-btn pnetwork save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn pnetwork remove' type='button'>Remove Device</button></td></tr>";
//                     }
//                 }
//             }
//             tooltip += "</table>";                                                   //deviceindex,devlistindex,specificdevindex   //ondblclick="return changeAlliasName(this);"
//             $('.networkmap .networklist').append('<div class="networklst"><div class="network ' + l.Class + '"></div><li style="max-width:150px;" deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + ii + '"  title="' + tooltip + '">' + (l.AlliasName === undefined ? l.Name : l.AlliasName) + '</li></div>');
//         }
//     });

//     if ($('.networkmap .networklist').html() === '') {
//         $('.networkmap .networklist').html('<li>No Network Adapter Available</li>');
//     }

//     $('.networkmap').slimScroll({
//         wheelStep: 5,
//         height: "30vw",
//         width: "100%"
//     });

//     $('.networkmap .lanlist .lanlst').mouseover(function (d) {
//         tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//         return;
//     });

//     $('.networkmap .usblist .usblst').mouseover(function (d) {
//         tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//         return;
//     });

//     $('.networkmap .printerlist .printerlst').mouseover(function (d) {
//         tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//         return;
//     });

//     $('.networkmap .networklist .networklst').mouseover(function (d) {
//         tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//         return;
//     });
// }

// function bindnetworkmap($scope) {
//     //alert(JSON.stringify($scope.mydevicelist));
//     $.each($scope.mydevicelist, function (idx, rec) {//devices
//         //var devlsit = rec.devList;
//         var devlsit = [];
//         if (rec.macAdd == $scope.myinfo.MACAddress) {
//             devlsit = rec.devList;
//         }

//         $.each(devlsit, function (i, lan) {//devlist
//             binddevice(lan, idx, i,true);
//         });
//     });

//     $('.networkmap .lanlist .lanlst li').dblclick(function () {
//         var deviceindex = $(this).attr('deviceindex');
//         var devlistindex = $(this).attr('devlistindex');
//         var specificdevindex = $(this).attr('specificdevindex');

//         $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
//         $(this).find('input').focusout(function () {
//             var alliasname = $(this).val();
//             var li = $(this).parent();
//             li.text(alliasname);

//             $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].AlliasName = alliasname;

//             $($(li).parent()).mouseover(function (d) {
//                 tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//                 return;
//             });
//             adddevices($scope, deviceindex, devlistindex);
//         });
//         $(this).find('input').focus();

//         $($(this).parent()).off();
//         tooltip.hide();
//     });

//     $('.networkmap .usblist .usblst li').dblclick(function () {
//         var deviceindex = $(this).attr('deviceindex');
//         var devlistindex = $(this).attr('devlistindex');
//         var specificdevindex = $(this).attr('specificdevindex');
//         var usbclassindex = $(this).attr('usbclassindex');

//         $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
//         $(this).find('input').focusout(function () {
//             var alliasname = $(this).val();
//             var li = $(this).parent();
//             li.text(alliasname);

//             $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList[usbclassindex].AlliasName = alliasname;

//             $($(li).parent()).mouseover(function (d) {
//                 tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//                 return;
//             });
//             adddevices($scope, deviceindex, devlistindex);
//         });
//         $(this).find('input').focus();

//         $($(this).parent()).off();
//         tooltip.hide();
//     });

//     $('.networkmap .printerlist .printerlst li').dblclick(function () {
//         var deviceindex = $(this).attr('deviceindex');
//         var devlistindex = $(this).attr('devlistindex');
//         var specificdevindex = $(this).attr('specificdevindex');

//         $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
//         $(this).find('input').focusout(function () {
//             var alliasname = $(this).val();
//             var li = $(this).parent();
//             li.text(alliasname);

//             $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].AlliasName = alliasname;

//             $($(li).parent()).mouseover(function (d) {
//                 tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//                 return;
//             });
//             adddevices($scope, deviceindex, devlistindex);
//         });
//         $(this).find('input').focus();

//         $($(this).parent()).off();
//         tooltip.hide();
//     });

//     $('.networkmap .networklist .networklst li').dblclick(function () {
//         var deviceindex = $(this).attr('deviceindex');
//         var devlistindex = $(this).attr('devlistindex');
//         var specificdevindex = $(this).attr('specificdevindex');

//         $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
//         $(this).find('input').focusout(function () {
//             var alliasname = $(this).val();
//             var li = $(this).parent();
//             li.text(alliasname);

//             $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].AlliasName = alliasname;

//             $($(li).parent()).mouseover(function (d) {
//                 tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
//                 return;
//             });
//             adddevices($scope, deviceindex, devlistindex);
//         });
//         $(this).find('input').focus();

//         $($(this).parent()).off();
//         tooltip.hide();
//     });
// }
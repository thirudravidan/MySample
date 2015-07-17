angular.module('templates-app', ['home/homeRight.tpl.html', 'login/forgetpassword.tpl.html', 'login/loginRight.tpl.html', 'manageaccount/changePassword/changePasswordRight.tpl.html', 'manageaccount/contractupgrade/contractUpgradeRight.tpl.html', 'manageaccount/contractupgrade/newrenew.tpl.html', 'manageaccount/contractupgrade/newupgrade.tpl.html', 'manageaccount/myprofile/myProfileRight.tpl.html', 'messagecenter/messagecenterRight.tpl.html', 'support/chat/chatright.tpl.html', 'support/knowledgebase/knowledgeBaseRight.tpl.html', 'support/knowledgebase/productSearch.tpl.html', 'support/remote/remotesupportRight.tpl.html', 'support/scheduleacall/newschedule.tpl.html', 'support/scheduleacall/scheduleacallRight.tpl.html', 'support/webticket/newticket.tpl.html', 'support/webticket/webticketRight.tpl.html', 'systemtools/networktools/networkmap/networkmap.tpl.html', 'systemtools/networktools/networkspeed/networkspeed.tpl.html', 'systemtools/networktools/networkusage/networkusage.tpl.html', 'systemtools/optimizationsuite/antivirus/antivirus.tpl.html', 'systemtools/optimizationsuite/databackup/databackup.tpl.html', 'systemtools/optimizationsuite/defragmentation/defragmentation.tpl.html', 'systemtools/optimizationsuite/firewall/firewall.tpl.html', 'systemtools/optimizationsuite/parentalcontrol/parentalcontrol.tpl.html', 'systemtools/optimizationsuite/pcoptimization/pcoptimization.tpl.html', 'systemtools/optimizationsuite/registrycleaner/registrycleaner.tpl.html', 'systemtools/scheduledactivities/scheduledactivities.tpl.html', 'systemtools/wifitools/channelinterface/channelinterface.tpl.html', 'systemtools/wifitools/dbmgraph/dbmgraph.tpl.html', 'systemtools/wifitools/networkdetails/networkdetails.tpl.html', 'systemtools/wifitools/signalstrength/signalstrength.tpl.html']);

angular.module("home/homeRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/homeRight.tpl.html",
    "<div class=\"right_bg_index\" ng-init=\"getMessageCount();\">\n" +
    "<div>\n" +
    "    <div id=\"dvSupportMain\" class=\"polygon contsupport sicon icon-polygon\" ng-click=\"redirectmenu('contactsupport',1);\"\n" +
    "        ng-model='isSupportMenuDescription' ng-mouseover=\"showMenuDescription('ContactSupport',true);\"\n" +
    "        ng-mouseleave=\"showMenuDescription('ContactSupport',false);\">\n" +
    "        <span class=\"contsupport_icon icon-contactsupport\" ng-click=\"redirectmenu('contactsupport',1);\">\n" +
    "            </span> <span class=\"contsupport_text\">Contact\n" +
    "                <br>\n" +
    "                Support</span>\n" +
    "    </div>\n" +
    "    <div class=\"polygon systemtools icon-polygon\" ng-model='isSystemToolsMenuDescription' ng-mouseover=\"showMenuDescription('SystemTools',true);\"\n" +
    "        ng-mouseleave=\"showMenuDescription('SystemTools',false);\" ng-click=\"redirectmenu('systemtools',3);\">\n" +
    "        <!--ng-mouseover=\"supportMouseHover();\" ng-mouseleave=\"supportMouseLeave();\"-->\n" +
    "        <span class=\"contsupport_icon icon-systemtools\" ng-click=\"redirectmenu('systemtools',3);\">\n" +
    "            </span> <span class=\"contsupport_text\">System\n" +
    "                <br>\n" +
    "                Tools</span>\n" +
    "    </div>\n" +
    "    <div class=\"polygon manageaccount icon-polygon\" ng-model='isManageAccountMenuDescription' ng-mouseover=\"showMenuDescription('ManageAccounts',true);\"\n" +
    "        ng-mouseleave=\"showMenuDescription('ManageAccounts',false);\" ng-click=\"redirectmenu('manageaccount',2);\">\n" +
    "        <span class=\"contsupport_icon icon-manageaccount\"  ng-click=\"redirectmenu('manageaccount',2);\">\n" +
    "            </span> <span class=\"contsupport_text\">Manage\n" +
    "                <br>\n" +
    "                Account</span>\n" +
    "    </div>\n" +
    "    <div class=\"polygon messagecenter icon-polygon\" ng-model='isMessageCenterMenuDescription' ng-mouseover=\"showMenuDescription('MessageCenter',true);\"\n" +
    "        ng-mouseleave=\"showMenuDescription('MessageCenter',false);\" ng-click=\"redirectmenu('messagecenter',4);\">\n" +
    "        <span class=\"contsupport_icon icon-messagecenter\" ng-click=\"redirectmenu('messagecenter',4);\">\n" +
    "            </span> \n" +
    "        <span class=\"contsupport_text\">Message\n" +
    "            <br>\n" +
    "            Center</span>\n" +
    "            <span class=\"messagespan home-note\" ng-show=\"isMessagecount\" >\n" +
    "                <span class=\"icon-webticket messagebox\"></span>\n" +
    "                <span class=\"messagescount badge home-note\">{{MesageCount}}</span>\n" +
    "            </span>\n" +
    "    </div>\n" +
    "    <div id=\"dvSupportText\" ng-show=\"isSupportMenuDescription\" class=\"show_menu\">\n" +
    "        <table class=\"text_container\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
    "            <tr>\n" +
    "                            <td>\n" +
    "                                <b>Knowledge Base</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                Look up our Knowledge Base to get answers for commonly occurring <br />support questions\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <b>Schedule a Call</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                Schedule a support call at a time of your convenience\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <b>Web Ticket</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                Get Support Online. Raise a Web Ticket and one of our experts will reply back to you\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <b>Chat</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                               Chat with our Support Specialists and let them walk you through resolving your issue\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <b>Remote Support</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                                Get the convenience of Remote Support, sit back and watch the Tech Support Specialists work on your PC\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div id=\"dvSystemToolText\" ng-show=\"isSystemToolsMenuDescription\" class=\"show_menu\">\n" +
    "        <table class=\"text_container\">\n" +
    "            <tr>\n" +
    "                            <td>\n" +
    "                                <b>Optimization Suite</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                               Optimize your PC performance by using our state-of-the-art tools\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <!-- <tr>\n" +
    "                            <td>\n" +
    "                                <b>Router Config</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                               Access your routers configuration settings from here\n" +
    "                            </td>\n" +
    "                        </tr> -->\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <b>Wi-Fi Tools</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                               Access our suite of Wi-Fi Analytical Tools\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <b>Network Tools</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                               Access our Network Tools to Monitor Network Usage, Speed and see a map of your Network\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <b>Schedule Activities</b>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                               Task can be Scheduled from here\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div id=\"dvManageAccount\" ng-show=\"isManageAccountMenuDescription\" class=\"show_menu\">\n" +
    "        <table class=\"text_container\">\n" +
    "            <tr>\n" +
    "                <td>\n" +
    "                    <b>Profile</b>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    Access your Profile Settings and Change your Password\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td>\n" +
    "                    <b>Contract Status</b>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    Details of your Current Contract and Status\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div id=\"dvMessageCenterText\" ng-show=\"isMessageCenterMenuDescription\" class=\"show_menu\">\n" +
    "        <table class=\"text_container\">\n" +
    "            <tr>\n" +
    "                <td>\n" +
    "                    <b>Message Center</b>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    Receive the latest Updates and Previews from us and connect with us through our Social feeds.\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"strip icon-contactsupport-strip\">\n" +
    "        </div>\n" +
    "    <div class=\"strip2 icon-systemtools-strip\">\n" +
    "        </div>\n" +
    "    <div class=\"strip3  icon-manageaccount-strip\">\n" +
    "        </div>\n" +
    "    <div class=\"strip4 icon-messagecenter-strip\">\n" +
    "        </div>\n" +
    "</div>\n" +
    "</div>");
}]);

angular.module("login/forgetpassword.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/forgetpassword.tpl.html",
    "<form name=\"ForgetpasswordForm\">\n" +
    "<div class=\"login_right_cont\" >\n" +
    "    <input ng-model=\"txtEmail\" id=\"txtEmail\" class=\"form-control mar_zero logininput_tag\"  name=\"txtEmail\"\n" +
    "        type=\"text\" placeholder=\"Email\" autofocus /> \n" +
    "    <div class=\"mar_zero\">  \n" +
    "        <input type=\"submit\" class=\"btn btn-primary login_but new-ticket pull-right padd_new\" ng-model=\"forgetpass\" ng-click=\"forgetpasswordcheck();\" value=\"Submit\"/>\n" +
    "        <input type=\"button\" class=\"btn btn-primary login_but new-ticket pull-right\" ng-model=\"forgetpassrefresh\" ng-click=\"refreshforgetpassword();\" value=\"Back\"/> \n" +
    "             \n" +
    "    </div>\n" +
    "</div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("login/loginRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/loginRight.tpl.html",
    "<form name=\"LoginForm\" ng-init=\"redirectToHome();rememberPass();\" ng-show=\"showlogin\">\n" +
    "<div class=\"login_right_cont\" >\n" +
    "    <input ng-model=\"txtUserName\" class=\"form-control mar_zero logininput_tag\"  name=\"txtUserName\"\n" +
    "        type=\"email\" placeholder=\"UserName\" required autofocus tabindex=\"1\" />\n" +
    "    <input ng-model=\"txtPassword\" class=\"form-control mar_zero logininput_tag\"  name=\"txtPassword\"\n" +
    "        type=\"password\" placeholder=\"Password\" required tabindex=\"2\" />\n" +
    "    <input type=\"submit\" class=\"btn btn-primary login_but pull-right\" value=\"Login\"\n" +
    "            ng-click=\"getUserDetails(LoginForm.$valid);\" ui-sref=\"\" tabindex=\"4\"/>\n" +
    "    <div class=\"mar_zero\">\n" +
    "    <span class=\"rememberme\">\n" +
    "        <input type=\"checkbox\" ng-model=\"chkremembermeval\" tabindex=\"3\"/>&nbsp;Remember Me\n" +
    "    </span>\n" +
    "    <div class=\"clearfix\"> </div>\n" +
    "        <span class=\"pull-left helpText\"><a style=\"cursor:pointer;\" tabindex=\"5\" ng-click=\"redirectToForgetPassword();\" class=\"orange\">I cannot access my account</a>\n" +
    "            <!-- or <a href=\"#\" class=\"orange\">Sign up now</a> --></span>\n" +
    "        \n" +
    "        \n" +
    "    </div>\n" +
    "    <div class=\"clearfix\"> </div>\n" +
    "    <div class=\"customer_care\">\n" +
    "       {{tollfreeno}} <span class=\"orange\">24X7 Tech Support</span></div>\n" +
    "</div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("manageaccount/changePassword/changePasswordRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageaccount/changePassword/changePasswordRight.tpl.html",
    "<form name=\"changePasswordForm\">\n" +
    "<div class=\"login_right_cont\">\n" +
    "    <input data-ng-model=\"newPassword\" class=\"form-control mar_zero passInput\" name=\"newPassword\" id=\"txtnewPass\" password-strength=\"newPassword\" \n" +
    "        type=\"password\" placeholder=\"New Password\" required autofocus />\n" +
    "          <span  data-ng-class=\"strength\">{{strengthMsg}}  </span>\n" +
    "    <input data-ng-model=\"confirmPassword\" class=\"form-control mar_zero passInput\" name=\"txtConfirmPass\"\n" +
    "        type=\"password\" placeholder=\"Confirm Password\" required />\n" +
    "    <div class=\"mar_zero pull-left orange\" >\n" +
    "        <p  style=\"font-weight: bold;\">\n" +
    "            Password complexity:\n" +
    "            <br />\n" +
    "            1. Password must contain atleast one uppercase letter [A-Z]<br />\n" +
    "            2. Atleast one lowercase letter [a-z]<br />\n" +
    "            3. Atleast one number [0-9] and have a minimum length of 6 characters<br />\n" +
    "            4. Allowed symbols are !@#$%^&*()<br />\n" +
    "        </p>\n" +
    "        <input type=\"submit\" class=\"btn btn-primary login_but \" value=\"Change\"\n" +
    "        ng-click=\"changePassword(changePasswordForm.$valid);\"/>\n" +
    "    <input type=\"Reset\" class=\"btn btn-primary login_but \" ng-click=\"reset();\" value=\"Reset\"/>&nbsp;\n" +
    "    \n" +
    "    </div>\n" +
    "    <div class=\"clearfix\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("manageaccount/contractupgrade/contractUpgradeRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageaccount/contractupgrade/contractUpgradeRight.tpl.html",
    "\n" +
    "<div class=\"right_bg_cont\"> \n" +
    "<div class=\"data_cont_profile\" ng-init=\"getcontractUpgrade();\">\n" +
    "    <div class=\"cont_title\">Contract Upgrade/Renew </div> \n" +
    "     <div class=\"container_mid\"> \n" +
    "    <div class=\"center-block\" >\n" +
    "        <table class=\"table\" >\n" +
    "            <tbody>\n" +
    "                <tr>\n" +
    "                    <td class=\"tdlabel\" ng-model=\"contractavailable\" ng-show=\"contractavailable\" style=\"border:0;\" id=\"Contractavailable\">\n" +
    "                        Remaining Days :\n" +
    "                         <label id=\"lblremainingdays\"  class=\"contract-label\" ng-bind=\"remainingdays\">\n" +
    "                        </label>\n" +
    "                    </td>\n" +
    "\n" +
    "                    <td class=\"tdlabel\" ng-model=\"NoContractavailable\" ng-show=\"NoContractavailable\" style=\"border:0;\" id=\"NoContractavailable\"> \n" +
    "                         <label id=\"lblnocontracts\"  class=\"contract-label\" ng-bind=\"Nocontrats\">\n" +
    "                        </label>\n" +
    "                    </td>\n" +
    "\n" +
    "                </tr> \n" +
    "            </tbody>\n" +
    "        </table>  \n" +
    "	    <p>&nbsp;&nbsp;<a class=\"btn btn-primary btn-sm login_but\" ng-click=\"redirectToUpgrade();\">Upgrade</a> &nbsp;\n" +
    "		<a class=\"btn btn-primary btn-sm login_but\" ng-click=\"redirectToRenew();\">Renew</a></p> \n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "	<div class=\"panel panel-warning\">\n" +
    "      <div class=\"panel-heading\">\n" +
    "        <h3 class=\"panel-title\" ng-bind=\"productname\"></h3>\n" +
    "      </div>\n" +
    "      <div class=\"panel-body\" id=\"dvdate\" style=\"display:none;\">\n" +
    "        <p style=\"color: #000; text-decoration: none\"><b>Purchase Date :</b> <span ng-bind=\"purchasedate\"></span></p>\n" +
    " 	    <p style=\"color: #000; text-decoration: none\"><b>Expiry Date :</b> <span ng-bind=\"expirydate\"></span></p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>");
}]);

angular.module("manageaccount/contractupgrade/newrenew.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageaccount/contractupgrade/newrenew.tpl.html",
    "\n" +
    " \n" +
    "<form class=\"form-horizontal\" name=\"NewRenewForm\">\n" +
    "<div class=\"right_bg_cont\" ng-init=\"bindproductDetails();\">\n" +
    "    <div class=\"data_cont rightupgradedivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "        <div class=\"cont_scroll\">\n" +
    "            <div class=\"cont_title\">\n" +
    "                <span>Renew Subscription</span>\n" +
    "            </div>  \n" +
    "             <div class=\"container_mid\">                \n" +
    "                    <div class=\"tab-content\" >\n" +
    "                        <div role=\"tabpanel\" class=\"tab-pane ng-show active\" id=\"product\" >\n" +
    "                            <div class=\"table-upgraderenew_responsive\">\n" +
    "                                <span> &nbsp;&nbsp; Subscribed Product Details</span>\n" +
    "                                <br/>\n" +
    "                                <table class=\"table table-striped table-bordered\" style=\"width:100%;\">\n" +
    "                                     <thead>\n" +
    "                                         <tr>\n" +
    "                                         <th>Serial No</th>\n" +
    "                                         <th>Product Name</th>\n" +
    "                                         <th>Purchase Date</th>\n" +
    "                                         <th>Product Expired</th>\n" +
    "                                         </tr>\n" +
    "                                     </thead>\n" +
    "                                     <tbody>\n" +
    "                                         <tr ng-repeat=\"productDet in productDetailsRenew\" class=\"table-row table-row-group\">\n" +
    "                                             <td class=\"table-column table-column-group\">{{productDet.SerialNo}}</td>\n" +
    "                                             <td class=\"table-column table-column-group\">{{productDet.ProductName}}</td>\n" +
    "                                             <td class=\"table-column table-column-group\">{{productDet.PurchaseDate}}</td>\n" +
    "                                             <td class=\"table-column table-column-group\">{{productDet.ProductExpired}}</td>\n" +
    "                                         </tr>\n" +
    "                                     </tbody>\n" +
    "                                </table>\n" +
    "                            </div>  \n" +
    "                        </div>\n" +
    "                    </div>   \n" +
    "     <div class=\"promo_content\">\n" +
    "    <div class=\"row marg\">\n" +
    "        <label class=\"col-sm-3\">\n" +
    "            <em>*</em> Card Number\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input type=\"text\" id=\"txt_Cardnumber\" maxlength=\"16\" ng-model=\"cardnumber\" placeholder=\"Please enter Card Number\" name=\"cardnumber\"\n" +
    "                    class=\"form-control input_tag\" required onkeypress=\"javascript:return isNumber(event)\" />\n" +
    "               \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div> \n" +
    "    <div class=\"row marg\">\n" +
    "        <label class=\"col-sm-3\">\n" +
    "            <em>*</em> Card Name\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input type=\"text\" id=\"txt_Cardname\" maxlength=\"50\" ng-model=\"cardname\" placeholder=\"Please enter Card Name\" name=\"cardname\" onKeyPress=\"return ValidateAlpha(event);\"\n" +
    "                    class=\"form-control input_tag\" required />\n" +
    "               \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row marg\">\n" +
    "        <label class=\"col-sm-3\">\n" +
    "            <em>*</em> Amount\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input type=\"text\" id=\"txt_Amount\" value=\"0\" onKeyDown=\"preventBackspace();\" readonly=\"true\" ng-model=\"amount\" placeholder=\"Please enter Amount\" name=\"amount\"\n" +
    "                    class=\"form-control input_tag\" required />\n" +
    "              <!-- onkeypress=\"javascript:return isNumber(event)\" -->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row marg\">\n" +
    "        <label class=\"col-sm-3\">\n" +
    "            <em>*</em> Card Type\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "           <select id=\"ddlcardType\" name=\"selectedcardtype\" class=\"form-control select_tag\" ng-model=\"cardtype\" ng-options=\"cardType.DrpText for cardType in cardtypes\" required>\n" +
    "            <option value=\"\">Select</option>\n" +
    "            </select>  \n" +
    "            \n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "      <div class=\"row marg\">\n" +
    "        <label class=\"col-sm-3\">\n" +
    "            <em>*</em> Card Expiry\n" +
    "        </label>\n" +
    "         \n" +
    "        <div class=\"col-sm-9\">\n" +
    "\n" +
    "        <div style=\"float:left;\"> \n" +
    "             <select id=\"ddlmonth\" name=\"ddlmonth\" class=\"form-control select_taginput\"> \n" +
    "                                    <option value=\"01\">01</option>\n" +
    "                                    <option value=\"02\">02</option>\n" +
    "                                    <option value=\"03\">03</option>\n" +
    "                                    <option value=\"04\">04</option>\n" +
    "                                    <option value=\"05\">05</option>\n" +
    "                                    <option value=\"06\">06</option>\n" +
    "                                    <option value=\"07\">07</option>\n" +
    "                                    <option value=\"08\">08</option>\n" +
    "                                    <option value=\"09\">09</option>\n" +
    "                                    <option value=\"10\">10</option>\n" +
    "                                    <option value=\"11\">11</option>\n" +
    "                                    <option value=\"12\">12</option>\n" +
    "                                </select>\n" +
    "                                </div>\n" +
    "\n" +
    "\n" +
    "              <div style=\"float:left;padding-left:8px;\"> \n" +
    "              <select id=\"ddlyear\" class=\"form-control select_taginput\" name=\"ddlyear\" ng-model=\"ddlyear\" required>\n" +
    "                                    <option ng-repeat=\"year in expyear\" value=\"{{year}}\">{{year}}</option>\n" +
    "                                </select>\n" +
    "                                </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "     <div class=\"row marg\">\n" +
    "        <label class=\"col-sm-3\">\n" +
    "            <em>*</em> CVV\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input type=\"password\" id=\"txt_Cvv\" ng-model=\"cvv\" maxlength=\"3\" placeholder=\"Please enter CVV\" name=\"cvv\"\n" +
    "                    class=\"form-control input_tag\" required onkeypress=\"javascript:return isNumber(event)\"/>\n" +
    "                 \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"btnrenewal_position\">\n" +
    "        <input type=\"submit\" class=\"netgearbtncolor login_but\" id=\"btnnewrenew\" ng-click=\"saveRenew(NewRenewForm.$valid);\" value=\"Submit\" />\n" +
    "    </div>\n" +
    "    </div>  \n" +
    "    </div>  \n" +
    "</div>   \n" +
    " </div>\n" +
    " </div>\n" +
    " </div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("manageaccount/contractupgrade/newupgrade.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageaccount/contractupgrade/newupgrade.tpl.html",
    "<form class=\"form-horizontal\" name=\"NewUpgradeForm\">\n" +
    "    <div class=\"right_bg_cont\" ng-init=\"bindproductDetails();accordionFunc('subProDet');accordionFunc('subscrDet');\">\n" +
    "        <div class=\"data_cont rightupgradedivHeight\">\n" +
    "            <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_scroll\">\n" +
    "                    <div class=\"cont_title\" >\n" +
    "                        <span>Upgrade Subscription</span>\n" +
    "                    </div>\n" +
    "                     <div class=\"container_mid\">\n" +
    "                     <div class=\"contHeader\" style=\"margin-top: 0.5vw;\">\n" +
    "                        <span>Subscribed Product Details</span><a class=\"seemore\" ng-show=\"!showsubProDet\"  ng-click=\"accordionFunc('subProDet');\">See more&nbsp;&nbsp;</a>\n" +
    "                    </div>\n" +
    "                            <div class=\"table-upgrade_responsive\" ng-show=\"showsubProDet\">\n" +
    "                                <table class=\"protable table-striped table-bordered\">\n" +
    "                                    <thead>\n" +
    "                                        <tr>\n" +
    "                                            <th>\n" +
    "                                                Serial No\n" +
    "                                            </th>\n" +
    "                                            <th>\n" +
    "                                                Product Name\n" +
    "                                            </th>\n" +
    "                                            <th>\n" +
    "                                                Purchase Date\n" +
    "                                            </th>\n" +
    "                                            <th>\n" +
    "                                                Product Expired\n" +
    "                                            </th>\n" +
    "                                        </tr>\n" +
    "                                    </thead>\n" +
    "                                    <tbody>\n" +
    "                                        <tr ng-repeat=\"productDet in productDetailsNew\" class=\"table-row table-row-group\">\n" +
    "                                            <td class=\"table-column table-column-group\">\n" +
    "                                                {{productDet.SerialNo}}\n" +
    "                                            </td>\n" +
    "                                            <td class=\"table-column table-column-group\">\n" +
    "                                                {{productDet.ProductName}}\n" +
    "                                            </td>\n" +
    "                                            <td class=\"table-column table-column-group\">\n" +
    "                                                {{productDet.PurchaseDate}}\n" +
    "                                            </td>\n" +
    "                                            <td class=\"table-column table-column-group\">\n" +
    "                                                {{productDet.ProductExpired}}\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                    </tbody>\n" +
    "                                </table>\n" +
    "                        </div> \n" +
    "\n" +
    "                    <div class=\"contHeader\">\n" +
    "                        <span>Subscription Details</span><a class=\"seemore\" ng-show=\"!showSubscription\" ng-click=\"accordionFunc('subscrDet');\">See more&nbsp;&nbsp;</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"promo_content\" ng-show=\"showSubscription\">\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> Promotion\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <select id=\"ddlPromotion\" name=\"selectedpromotion\" class=\"form-control select_tag\"\n" +
    "                                    ng-change=\"chgPromotion(selectedpromotion)\" ng-model=\"selectedpromotion\" ng-options=\"promotiondetail.promocode for promotiondetail in promotiondetails\"\n" +
    "                                    required>\n" +
    "                                    <option value=\"\">Select</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> Product\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <select id=\"ddlProduct\" name=\"selectedproduct\" class=\"form-control select_tag\" ng-change=\"loadProductPrice(selectedproduct)\"\n" +
    "                                    ng-model=\"selectedproduct\" ng-options=\"procuctdetail.prodname for procuctdetail in productDetails\"\n" +
    "                                    required>\n" +
    "                                    <option value=\"\">Select</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> Card Number\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <div class=\"controls\">\n" +
    "                                    <input type=\"text\" id=\"txt_Cardnumber\" maxlength=\"16\" ng-model=\"cardnumber\" placeholder=\"Please enter Card Number\"\n" +
    "                                        name=\"cardnumber\" class=\"form-control input_tag\" required onkeypress=\"javascript:return isNumber(event)\" />\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> Card Name\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <div class=\"controls\">\n" +
    "                                    <input type=\"text\" maxlength=\"50\" id=\"txt_Cardname\" ng-model=\"cardname\" placeholder=\"Please enter Card Name\" onKeyPress=\"return ValidateAlpha(event);\"\n" +
    "                                        name=\"cardname\" class=\"form-control input_tag\" required />\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> Amount\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <div class=\"controls\">\n" +
    "                                    <input type=\"text\" value=\"0\" id=\"txt_Amount\" ng-model=\"amount\" placeholder=\"Please enter Amount\"\n" +
    "                                        name=\"amount\" class=\"form-control input_tag\" required onKeyDown=\"preventBackspace();\" readonly=\"true\" />\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> Card Type\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <select id=\"ddlProduct\" name=\"selectedcardtype\" class=\"form-control select_tag\" ng-model=\"cardtype\"\n" +
    "                                    ng-options=\"cardType.DrpText for cardType in cardtypes\" required>\n" +
    "                                    <option value=\"\">Select</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> Card Expiry\n" +
    "                            </label>\n" +
    "                         <div class=\"col-sm-9\">\n" +
    "\n" +
    "                                <div style=\"float:left;\"> \n" +
    "                                     <select id=\"ddlmonth\" name=\"ddlmonth\" class=\"form-control select_taginput\"> \n" +
    "                                                            <option value=\"01\">01</option>\n" +
    "                                                            <option value=\"02\">02</option>\n" +
    "                                                            <option value=\"03\">03</option>\n" +
    "                                                            <option value=\"04\">04</option>\n" +
    "                                                            <option value=\"05\">05</option>\n" +
    "                                                            <option value=\"06\">06</option>\n" +
    "                                                            <option value=\"07\">07</option>\n" +
    "                                                            <option value=\"08\">08</option>\n" +
    "                                                            <option value=\"09\">09</option>\n" +
    "                                                            <option value=\"10\">10</option>\n" +
    "                                                            <option value=\"11\">11</option>\n" +
    "                                                            <option value=\"12\">12</option>\n" +
    "                                                        </select>\n" +
    "                                 </div> \n" +
    "                                <div style=\"float:left;padding-left:8px;\"> \n" +
    "                                      <select id=\"ddlyear\" class=\"form-control select_taginput\" name=\"ddlyear\" ng-model=\"ddlyear\" required>\n" +
    "                                                            <option ng-repeat=\"year in expyear\" value=\"{{year}}\">{{year}}</option>\n" +
    "                                      </select>\n" +
    "                                </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row marg\">\n" +
    "                            <label class=\"col-sm-3\">\n" +
    "                                <em>*</em> CVV\n" +
    "                            </label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <div class=\"controls\">\n" +
    "                                    <input type=\"password\" id=\"txt_Cvv\" maxlength=\"3\" ng-model=\"cvv\" placeholder=\"Please enter CVV\" name=\"cvv\"\n" +
    "                                        class=\"form-control input_tag\" required onkeypress=\"javascript:return isNumber(event)\" />\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"btnpanel-gray-style upgrade_positoin\">\n" +
    "                            <input type=\"submit\" id=\"btnnewugrade\" class=\"netgearbtncolor login_but\" ng-click=\"saveUpgrade(NewUpgradeForm.$valid);\"\n" +
    "                                value=\"Submit\" />\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("manageaccount/myprofile/myProfileRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageaccount/myprofile/myProfileRight.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont_profile\">\n" +
    "        <div class=\"cont_title\">\n" +
    "            My Profile\n" +
    "        </div>\n" +
    "         <div class=\"container_mid\">\n" +
    "        <div class=\"center-block\" ng-init=\"bindcustomerDetails();bindproductDetails();\">\n" +
    "            <table class=\"table\">\n" +
    "                <tbody>\n" +
    "                    <tr style=\"border-left: 1px solid #ddd !important;\">\n" +
    "                        <td class=\"tdlabel\">\n" +
    "                            Customer Id\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <label id=\"lblCustomerID\" ng-bind=\"customerid\">\n" +
    "                            </label>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr style=\"border-left: 1px solid #ddd !important;\">\n" +
    "                        <td class=\"tdlabel\">\n" +
    "                            Email\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <label id=\"lblEmail\" ng-bind=\"email\">\n" +
    "                            </label>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr style=\"border-left: 1px solid #ddd !important;\">\n" +
    "                        <td class=\"tdlabel\">\n" +
    "                            First Name\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <label id=\"lblFirstName\" ng-bind=\"fname\">\n" +
    "                            </label>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr style=\"border-bottom: 1px solid #ddd !important; border-left: 1px solid #ddd !important;\">\n" +
    "                        <td class=\"tdlabel\">\n" +
    "                            Last Name\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <label id=\"lblLastName\" ng-bind=\"lname\">\n" +
    "                            </label>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "            <div role=\"tabpanel\">\n" +
    "                <!-- Nav tabs -->\n" +
    "                <div role=\"tabpanel\">\n" +
    "                    <!-- Nav tabs -->\n" +
    "                    <ul class=\"nav nav-tabs\" role=\"tablist\">\n" +
    "                        <li ng-click=\"setTab('#product')\" role=\"presentation\" class=\"active\"><a aria-controls=\"product\"\n" +
    "                            role=\"tab\" data-toggle=\"tab\">Product</a></li>\n" +
    "                        <li ng-click=\"setTab('#password')\" role=\"presentation\"><a aria-controls=\"password\"\n" +
    "                            role=\"tab\" data-toggle=\"tab\">Change Password</a></li>\n" +
    "                    </ul>\n" +
    "                    <!-- Tab panes -->\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div role=\"tabpanel\" class=\"tab-pane ng-show active\" id=\"product\">\n" +
    "                            <div class=\"table-responsive\">\n" +
    "                                <table class=\"table table-striped table-bordered\" style=\"width: 100%;\">\n" +
    "                                    <thead>\n" +
    "                                        <tr>\n" +
    "                                            <th>Warranty</th>\n" +
    "                                            <th>Purchase Date </th>\n" +
    "                                            <th>Expiry Date</th>\n" +
    "                                        </tr>\n" +
    "                                    </thead>\n" +
    "                                    <tbody>\n" +
    "                                        <tr ng-repeat=\"productDet in productDetails\" class=\"table-row table-row-group\">\n" +
    "                                            <td class=\"table-column table-column-group\">\n" +
    "                                                {{productDet.ProductWarranty}}\n" +
    "                                            </td>\n" +
    "                                            <td class=\"table-column table-column-group\">\n" +
    "                                                {{productDet.PurchaseDate}}\n" +
    "                                            </td>\n" +
    "                                            <td class=\"table-column table-column-group\">\n" +
    "                                                {{productDet.ProductExpired}}\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                    </tbody>\n" +
    "                                </table>\n" +
    "                            </div>\n" +
    "                            <div style=\"height:1.2vw;\"></div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div role=\"tabpanel\" class=\"tab-pane\" id=\"password\">\n" +
    "                            <form name=\"changePasswordForm\">\n" +
    "                                <div ng-hide=\"showDetails\" id=\"password\">\n" +
    "                                    <div class=\"chgpwd_left_conts\">\n" +
    "                                        <div class=\"newpassText\">\n" +
    "                                           \n" +
    "                                            <span id=\"newPasswordPar\">\n" +
    "                                                <input data-ng-model=\"newPassword\" class=\"form-control mar_zero passInput input_tag\"\n" +
    "                                                name=\"newPassword\" id=\"txtnewPassword\"  password-strength=\"newPassword\" type=\"password\"\n" +
    "                                                placeholder=\"New Password\" required autofocus />\n" +
    "                                                <span data-ng-class=\"strength\" id=\"strmsg\" class=\"strMessage\">{{strengthMsg}} </span>\n" +
    "                                            </span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"conpasstext\">\n" +
    "                                            <span>\n" +
    "                                                <input data-ng-model=\"confirmPassword\" id=\"confirmPassword\" class=\"form-control mar_zero passInput input_tag\"\n" +
    "                                                name=\"txtConfirmPass\" type=\"password\" placeholder=\"Confirm Password\" required />\n" +
    "                                            </span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"btndiv\">\n" +
    "                                              <input type=\"submit\" class=\"btn btn-primary login_but \" value=\"Change\" ng-click=\"changePassword(changePasswordForm.$valid);\" />\n" +
    "                                              <input type=\"Reset\" class=\"btn btn-primary login_but \" ng-click=\"reset();\" value=\"Reset\" /> \n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"chgpwd_right_conts\">\n" +
    "                                        <div class=\"orange_profile\">\n" +
    "                                            <p style=\"font-weight: bold;\">\n" +
    "                                                Password complexity:\n" +
    "                                                <br />\n" +
    "                                                1. Password must contain atleast one uppercase letter [A-Z]<br />\n" +
    "                                                2. Atleast one lowercase letter [a-z]<br />\n" +
    "                                                3. Atleast one number [0-9] and have a minimum length of 6 characters<br />\n" +
    "                                                4. Allowed symbols are !@#$%^&*()<br />\n" +
    "                                            </p>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </form>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("messagecenter/messagecenterRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("messagecenter/messagecenterRight.tpl.html",
    "<div class=\"right_bg_cont_msgcenter\" ng-init=\"getMessageDetails();\" >\n" +
    "\n" +
    "	<div class=\"message_alert\" ng-repeat=\"msg in Messagelist\">\n" +
    "		<h1>		 \n" +
    "			<a style=\"cursor:pointer\" ng-click=\"redirecttoMessageDescription(msg.MessageID,1);\">{{ msg.MessageTitle }}</a>\n" +
    "		</h1>\n" +
    "		<p>{{ msg.ShortDescription }}</p>\n" +
    "	</div>\n" +
    "   <div class=\"social\" ng-show=\"socialshow\">\n" +
    "<img src=\"assets/Content/img/fb.png\" class=\"popup_window\" data-popup-target=\"#example-popup\" />\n" +
    "<br>\n" +
    "<img class=\"popup_window\" data-popup-target=\"#example-popup2\" src=\"assets/Content/img/twi.png\" /> \n" +
    "</div>\n" +
    "<br>\n" +
    "\n" +
    "<div id=\"example-popup\" class=\"popup\">\n" +
    "    <div class=\"popup-body\">\n" +
    "        <span class=\"popup-exit\"></span>\n" +
    "        <div class=\"popup-content\">\n" +
    "            <h2 class=\"popup-title\">Facebook</h2>\n" +
    "            <iframe id=\"dvfb\" src=\"https://www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2FNetgear&amp;width=590&amp;height=480&amp;colorscheme=light&amp;show_faces=false&amp;header=false&amp;stream=true&amp;show_border=false&amp;appId=474003719367144\"\n" +
    "            scrolling=\"no\" frameborder=\"0\" style=\"background: white !important; border-radius: 5px !important;\n" +
    "            border: none; overflow: hidden; width: 590px; height: 480px;\"\n" +
    "            allowtransparency=\"true\" class=\"fb-like-box\"></iframe>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"example-popup2\" class=\"popup\">\n" +
    "    <div class=\"popup-body\"><span class=\"popup-exit\"></span>\n" +
    "        <div class=\"popup-content\">\n" +
    "           <h2 class=\"popup-title\">Twitter</h2>\n" +
    "           <div id=\"hreftwitter\" style=\"padding: 0; margin: 0; overflow: hidden;\" >\n" +
    "            <iframe id=\"twitter\" src=\"http://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2Fcsscorp\"\n" +
    "            scrolling=\"no\" frameborder=\"0\" style=\"background: white !important; border-radius: 5px !important;\n" +
    "            border: none; overflow: hidden; width: 590px; height: 480px;\"\n" +
    "            allowtransparency=\"true\" ></iframe>\n" +
    "               \n" +
    "           </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- <div id=\"example-popup3\" class=\"popup\">\n" +
    "    <div class=\"popup-body\"><span class=\"popup-exit\"></span>\n" +
    "        <div class=\"popup-content\">\n" +
    "            <h2 class=\"popup-title\">Google+</h2>\n" +
    "            <div id=\"hrefgplus\" >\n" +
    "                <iframe id=\"Iframe1\" src=\"https://plus.google.com/107087502395383715305/\"\n" +
    "            scrolling=\"no\" frameborder=\"0\" style=\"background: white !important; border-radius: 5px !important;\n" +
    "            border: none; overflow: hidden; width: 590px; height: 480px;\"\n" +
    "            allowtransparency=\"true\" ></iframe>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div> -->\n" +
    "<div class=\"popup-overlay\"></div>\n" +
    "</div>");
}]);

angular.module("support/chat/chatright.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/chat/chatright.tpl.html",
    "  <div class=\"right_bg_cont\">\n" +
    " <div class=\"data_cont\">\n" +
    "        <div class=\"cont_title\">\n" +
    "            Chat\n" +
    "        </div>\n" +
    "        <div class=\"container_mid\">  \n" +
    "	 <iframe id=\"frame\" src=\"\" width=\"100%\" style=\"overflow-y: hidden; padding: 0; margin: 0;\n" +
    "	 overflow: hidden;height:31vw;border-radius: 0 0 15px 15px;\" frameborder=\"0\"></iframe>\n" +
    "	 </div>\n" +
    "	 </div>\n" +
    " </div> \n" +
    "\n" +
    " \n" +
    "");
}]);

angular.module("support/knowledgebase/knowledgeBaseRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/knowledgebase/knowledgeBaseRight.tpl.html",
    "<div class=\"right_bg_cont noselect\" ng-init=\"bindrecContentDetails();indexSet();\">\n" +
    "    <div class=\"data_cont\">\n" +
    "        <div class=\"cont_title\">\n" +
    "            Knowledge Base\n" +
    "        </div>\n" +
    "        <div class=\"container_mid\">\n" +
    "        <div class=\" kbform\">\n" +
    "            <div class=\"\">\n" +
    "                <span class=\"\">\n" +
    "                    <input type=\"text\" class=\" txtinput\" style=\"height:115%;font-size:1.5vw;\" id=\"txtSearch\" ng-model=\"txtSearch\" />\n" +
    "                    <button class=\"netgearbtncolor searchbtn login_but\" id=\"btnSearch\" ng-click=\"searchContent();\">\n" +
    "                        Go</button>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- - `rn-carousel-index` two way binding integer to control the carousel position (0-indexed)\n" +
    " - `rn-carousel-buffered` add this attribute to enable the carousel buffering, good to minimize the DOM (5 slides)\n" +
    " - `rn-carousel-controls` add this attribute to enable builtin prev/next buttons (you can override by CSS)\n" +
    " - `rn-carousel-auto-slide` add this attribute to make the carousel slide automatically after given seconds (default=3)\n" +
    " - `rn-carousel-transition` : transition type, can be one of `slide, zoom, hexagon, fadeAndSlide, none`. (default=slide)\n" +
    " - `rn-carousel-locked`: two way binding boolean that lock/unlock the carousel\n" +
    " - `rn-carousel-deep-watch`: Deep watch the collection which enable to dynamically add slides at beginning without corrupting position -->\n" +
    "      \n" +
    "        <div class=\"imageRow\">\n" +
    "            <div class=\"photo-container\" data-carousel data-carousel-class=\"photo-carousel\" data-on-page-upcoming=\"loadPage(page, tmplCb)\"\n" +
    "                data-give-carousel-to=\"onCarouselAvailable(carousel)\">\n" +
    "                <div class=\"photo-grid span12\">\n" +
    "                    <span data-ng-repeat=\"photo in photos\" class=\"productImg\">\n" +
    "                        <img class=\"kb_carosel\" ng-src=\"{{getPhotoUrl(photo)}}\" data-ng-click=\"productPopup(getSearchPro(photo));\">\n" +
    "                         <span class=\"carouseltext\"><strong>{{getProText(photo)}}</strong></span>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <a class=\"previous_kb icon-prev\" data-ng-show=\"hasPrevious()\" data-ng-click=\"previous()\">\n" +
    "                </a> <span class=\"previous_kb icon-prev\" data-ng-hide=\"hasPrevious()\"></span>\n" +
    "            <a class=\"next_kb icon-next\" data-ng-show=\"hasNext()\" data-ng-click=\"next()\"> </a>\n" +
    "            <span class=\"next_kb icon-next\" data-ng-hide=\"hasNext()\"> </span>\n" +
    "        </div>\n" +
    "        <div class=\"contHeader\" ng-show=\"showRecomend\">\n" +
    "            <span>{{rec_content}}</span><a class=\"seemore\" ng-click=\"accordionFun('recommend');\">See more&nbsp;&nbsp;</a></div>\n" +
    "        <div class=\"recommend_cont\" ng-show=\"showRecomendCont\">\n" +
    "            <div ng-repeat=\"contDet in recomContent\" class=\"\">\n" +
    "                <a style=\"cursor:pointer\" ng-click=\"redirectToKBContentView(contDet.ID,contDet.ContentOriginID,contDet.ContentOriginName)\">\n" +
    "                    <h5>{{contDet.Title}}</h5>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "         <div class=\"norecords\" ng-show=\"norecordsShowRecomnd\">\n" +
    "                <span class=\"noRecSpan\">No Records Found</span>\n" +
    "            </div>\n" +
    "\n" +
    "        <div class=\"contHeader\" ng-show=\"showPopular\">\n" +
    "            <span>{{ pop_content}}</span><a class=\"seemore\" ng-click=\"accordionFun('popular');\">See more&nbsp;&nbsp;</a></div>\n" +
    "        <div class=\"popular_cont\" ng-show=\"showPopularCont\">\n" +
    "            <div ng-repeat=\"contDets in popularContent\" class=\"\">\n" +
    "                <a style=\"cursor:pointer\" ng-click=\"redirectToKBContentView(contDets.ID,contDets.ContentOriginID,contDets.ContentOriginName);\">\n" +
    "                    <h5>\n" +
    "                        {{contDets.Title}}</h5>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"contHeader\" ng-show=\"showsearch\">\n" +
    "                <span>{{searc_content}}</span><a class=\"seemore\"  ng-click=\"accordionFun('search');\">See more&nbsp;&nbsp;</a>\n" +
    "        </div>\n" +
    "            <div class=\"sea_cont\" ng-show=\"showSearchCont\">\n" +
    "                <div ng-repeat=\"seaDet in seaContent\" class=\"\">\n" +
    "                    <a style=\"cursor:pointer\"  ng-click=\"redirectToKBContentView(seaDet.ID,seaDet.ContentOriginID,seaDet.ContentOriginName);\">\n" +
    "                        <h5>{{seaDet.Title}}</h5>\n" +
    "                    </a>  \n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"norecords\" ng-show=\"norecordsShow\">\n" +
    "                <span class=\"noRecSpan\">No Records Found</span>\n" +
    "            </div>\n" +
    "            <div class=\"nextPrev\" ng-show=\"nextPrevShow\"> \n" +
    "                 <a class=\"previousPage disableText\"  ng-click=\"showPreviousContent();\">&lt;&lt;Prev&nbsp;&nbsp;</a>\n" +
    "                 <a class=\"nextPage\"  ng-click=\"showNextContent();\">Next &gt;&gt;&nbsp;&nbsp;</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <script type=\"text/ng-template\" id=\"searchDialog\">\n" +
    "            <div ng-include=\"'support/knowledgebase/productSearch.tpl.html'\"></div>\n" +
    "        </script>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<script type=\"text/javascript\">\n" +
    "    $(document).keypress(function(event){\n" +
    "    var keycode = (event.keyCode ? event.keyCode : event.which);\n" +
    "    if(keycode == '13'){ \n" +
    "        angular.element(document.getElementById(\"rightCont\")).scope().searchContent();\n" +
    "    }\n" +
    "});\n" +
    "</script>");
}]);

angular.module("support/knowledgebase/productSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/knowledgebase/productSearch.tpl.html",
    "<div class=\"heading_popup\">\n" +
    "    <h3> Browse Your Product </h3>\n" +
    "    <a onclick=\"javascript:modelSearch();\">How to find your model number?</a>\n" +
    "    <span class=\"close_search\"><img src=\"assets/Content/img/close.png\" class=\"clz\" ng-click=\"closeThisDialog('Cancel')\"></span>\n" +
    "</div>\n" +
    "<div class=\"clearfiz\"></div>\n" +
    "<div id=\"Popup\" class=\"choose_product\" ng-init=\"initProLoad();\">\n" +
    "    <div class=\"pro_category\">\n" +
    "     <h2>1.Choose a Product Category </h2>\n" +
    "        <select size=\"4\" class=\"select_size\" id=\"productCategory\" ng-model=\"productCategory\" ng-change=\"loadproductfamilyonchange();\">\n" +
    "         <option value=\"tcm:122-58378-1024\">Access Points &amp; Wireless Extenders</option>\n" +
    "            <option value=\"tcm:122-42208-1024\">Adapters</option> \n" +
    "            <option value=\"tcm:122-42209-1024\">Entertainment</option>\n" +
    "            <option value=\"tcm:122-74268-1024\">Mobile Broadband</option>\n" +
    "            <option value=\"tcm:122-42210-1024\">Phoneline</option>\n" +
    "            <option value=\"tcm:122-42211-1024\">Powerline &amp; Coax</option>\n" +
    "            <option value=\"tcm:122-42212-1024\">Print Servers</option>\n" +
    "            <option selected=\"selected\" value=\"tcm:122-42215-1024\">Routers, Modems &amp; Gateways</option>\n" +
    "            <option value=\"tcm:122-58380-1024\">Storage</option>\n" +
    "            <option value=\"tcm:122-58381-1024\">Unmanaged Switches</option>\n" +
    "            <option value=\"tcm:122-59529-1024\">Video Monitoring</option>\n" +
    "            <option value=\"tcm:122-42218-1024\">VOIP,Skype</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <div class=\"pro_category\">\n" +
    "    <h2> 2. Choose a Product Family</h2>\n" +
    "         <select size=\"4\" id=\"profamily\" class=\"select_size\" ng-model=\"profamily\" ng-change=\"loadproducttype();\">\n" +
    "       <!--  <option selected=\"selected\"> Cable Modems </option> -->\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"pro_category\">\n" +
    "     <h2> 3.Choose a Product Type </h2>\n" +
    "\n" +
    " <select id=\"productType\" name=\"proCategory\" size=\"4\" class=\"select_size\" ng-model=\"proCategory\" ng-change=\"showproducttypedetails();\" required>\n" +
    "<!--  <option selected=\"selected\" value=\"\">Select</option> -->\n" +
    "            </select> \n" +
    "    </div>\n" +
    "    <div class=\"pro_category\" id=\"proDetailsshow\" ng-show=\"proDetailsshow\">\n" +
    "        <img src=\"\"  id=\"productImage\" class=\"prod_img\">\n" +
    "        <span id=\"proId\" style=\"color:#FFF;\"></span>\n" +
    "        <button class=\"login_but\" ng-click=\"confirm('Save')\">Select</button>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("support/remote/remotesupportRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/remote/remotesupportRight.tpl.html",
    "<div class=\"right_bg_cont\" ng-show=\"isRemotesupportShow\">\n" +
    "\n" +
    "	<div class=\"data_cont\">\n" +
    "	<div class=\"cont_title\"> Remote Support </div>\n" +
    "	 <div class=\"container_mid\">\n" +
    "	<iframe id=\"frame\" scrolling=\"yes\" src=\"\"  \n" +
    "    style=\" border: 0 none;   height: 38vw;  margin-left: -5.32vw; margin-top: -3.2vw;  transform: scale(0.79);-webkit-transform: scale(0.79); -moz-transform: scale(0.79); -o-transform: scale(0.79); width: 54vw; \"></iframe>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("support/scheduleacall/newschedule.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/scheduleacall/newschedule.tpl.html",
    "<form name=\"NewScheduleForm\"> \n" +
    "<div class=\"right_bg_cont\" ng-init=\"dateTimeControls();loadProduct();getallTimeZoneDetails();\">\n" +
    "<div class=\"data_cont\">\n" +
    "<div class=\"cont_title\"> <span>New Schedule</span> </div>\n" +
    " <div class=\"container_mid\">\n" +
    "<div class=\"\">\n" +
    " <p>\n" +
    "    <span class=\"mandtry pull-right\"><em>\n" +
    "            * </em>Mandatory Fields</span>\n" +
    "    </p>\n" +
    "        <p class=\"clearfix\">\n" +
    "    </p>\n" +
    "      \n" +
    "    <div class=\"\">\n" +
    "        <label class=\"col-sm-3 control-label\">\n" +
    "            <em>*</em> CallBack Number\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input tabindex=\"1\" type=\"text\" maxlength=\"10\" id=\"txtPhoneNumber\" ng-model=\"callBackNumber\" placeholder=\"Please enter CallBack Number\"\n" +
    "                    name=\"callBackNumber\" class=\"form-control input_tag\" required onkeypress=\"javascript:return isNumber(event)\" onpaste=\"return false;\" onselect=\"return false;\" oncontextmenu=\"return false;\"  />\n" +
    "                <p class=\"help-block\">\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "   <div class=\"\">\n" +
    "        <label class=\"col-sm-3 control-label\">\n" +
    "            <em>*</em> Date\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input type=\"text\" id=\"txtDate\" tabindex=\"2\" name=\"Date\" class=\"form-control validate[required] text-input input_tag\" onKeyDown=\"preventBackspace();\"\n" +
    "                  readonly=\"true\"/>\n" +
    "                <p class=\"help-block\">\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"\">\n" +
    "        <label class=\"col-sm-3 control-label\">\n" +
    "            <em>*</em> Time\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"control-group\">\n" +
    "                <div class=\"controls\">\n" +
    "                    <input type=\"text\" tabindex=\"3\" type=\"text\" id=\"txtTime\" name=\"Time\" class=\"form-control validate[required] text-input input_tag txttimepicker\" onKeyDown=\"preventBackspace();\"\n" +
    "                         readonly=\"true\"/>\n" +
    "                    <p class=\"help-block\">\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"\">\n" +
    "        <label class=\"col-sm-3 control-label\">\n" +
    "            <em>*</em> Time Zone\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <select tabindex=\"4\" name=\"scheduleTimeZone\" ng-model=\"scheduleTimeZone\" id=\"DropDownTimezone\" class=\"form-control select_tag\" ng-options=\"timezonedet.TimeZone for timezonedet in TimeZoneDetails\" required>\n" +
    "                    <option value=\"\">Select</option>\n" +
    "                    <!-- <option value=\"(GMT -8:00) Pacific Time (US &amp; Canada)\">(GMT -8:00) Pacific Time\n" +
    "                        (US &amp; Canada) </option>\n" +
    "                    <option value=\"(GMT -7:00) Mountain Time (US &amp; Canada)\">(GMT -7:00) Mountain Time\n" +
    "                        (US &amp; Canada) </option>\n" +
    "                    <option value=\"(GMT -6:00) Central Time (US &amp; Canada), Mexico City\">(GMT -6:00)\n" +
    "                        Central Time (US &amp; Canada), Mexico City </option>\n" +
    "                    <option value=\"(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima\">(GMT -5:00)\n" +
    "                        Eastern Time (US &amp; Canada), Bogota, Lima </option>\n" +
    "                    <option value=\"(GMT +00:00) Western Europe Time, London, Lisbon, Casablanca\">(GMT +00:00)\n" +
    "                        Western Europe Time, London, Lisbon, Casablanca </option>\n" +
    "                    <option value=\"(GMT +07:00 Christmas Island Time \">(GMT +07:00) Christmas Island Time\n" +
    "                    </option>\n" +
    "                    <option value=\"(GMT +08:00 Australian Western Standard Time \">(GMT +08:00) Australian\n" +
    "                        Western Standard Time </option>\n" +
    "                    <option value=\"(GMT +08:45 Australian Central Western Standard Time\">(GMT +08:45) Australian\n" +
    "                        Central Western Standard Time </option>\n" +
    "                    <option value=\"(GMT +09:00 Australian Western Daylight Time \">(GMT +09:00) Australian\n" +
    "                        Western Daylight Time </option>\n" +
    "                    <option value=\"(GMT +09:30 Australian Central Standard Time\">(GMT +09:30) Australian\n" +
    "                        Central Standard Time </option>\n" +
    "                    <option value=\"(GMT +10:00 Australian Eastern Standard Time\">(GMT +10:00) Australian\n" +
    "                        Eastern Standard Time </option>\n" +
    "                    <option value=\"(GMT +10:30 Australian Central Daylight Time\">(GMT +10:30) Australian\n" +
    "                        Central Daylight Time </option>\n" +
    "                    <option value=\"(GMT +10:30 Lord Howe Standard Time \">(GMT +10:30) Lord Howe Standard\n" +
    "                        Time </option>\n" +
    "                    <option value=\"(GMT +11:00 Australian Eastern Daylight Time\">(GMT +11:00) Australian\n" +
    "                        Eastern Daylight Time </option>\n" +
    "                    <option value=\"(GMT +11:00 Lord Howe Daylight Time \">(GMT +11:00) Lord Howe Daylight\n" +
    "                        Time </option>\n" +
    "                    <option value=\"(GMT +11:30 Norfolk Time  \">(GMT +11:30) Norfolk Time </option>\n" +
    "                    <option value=\"(UTC  +05:00 Mawson Station Time Zone  \">(UTC  +05:00) Mawson Station Time\n" +
    "                        Zone </option>\n" +
    "                    <option value=\"(UTC  +05:00 Heard and McDonald Islands Time Zone \">(UTC  +05:00) Heard and\n" +
    "                        McDonald Islands Time Zone </option>\n" +
    "                    <option value=\"(UTC  +06:30 Cocos Islands Time Zone \">(UTC  +06:30) Cocos Islands Time Zone\n" +
    "                    </option>\n" +
    "                    <option value=\"(UTC  +07:00 Davis Time Zone \">(UTC  +07:00) Davis Time Zone </option>\n" +
    "                    <option value=\"(UTC  +08:00 Casey Time Zone \">(UTC  +08:00) Casey Time Zone </option> -->\n" +
    "\n" +
    "                    <!-- <option value=\"(GMT -8:00) Pacific Time (US &amp; Canada)\">(GMT -8:00) Pacific Time\n" +
    "                        (US &amp; Canada) </option>\n" +
    "                    <option value=\"(GMT -7:00) Mountain Time (US &amp; Canada)\">(GMT -7:00) Mountain Time\n" +
    "                        (US &amp; Canada) </option>\n" +
    "                    <option value=\"(GMT -6:00) Central Time (US &amp; Canada), Mexico City\">(GMT -6:00)\n" +
    "                        Central Time (US &amp; Canada), Mexico City </option>\n" +
    "                    <option value=\"(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima\">(GMT -5:00)\n" +
    "                        Eastern Time (US &amp; Canada), Bogota, Lima </option> -->\n" +
    "                    \n" +
    "                </select>\n" +
    "                <p class=\"help-block\">\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    " \n" +
    "    <div class=\"\">\n" +
    "        <label class=\"col-sm-3 control-label\">\n" +
    "            <em>*</em> Problem Title\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <input tabindex=\"5\" type=\"text\" id=\"txt_Problem\" ng-model=\"scheduleProblemTitle\" placeholder=\"Please enter Problem Title\" maxlength=\"200\" name=\"scheduleProblemTitle\"\n" +
    "                    class=\"form-control input_tag\" required />\n" +
    "                <p class=\"help-block\">\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <p class=\"clearfix\">\n" +
    "    </p>\n" +
    "    <div class=\"\">\n" +
    "        <label class=\"col-sm-3 control-label\">\n" +
    "            <em>*</em> Product\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <!--<span id=\"spanProduct\" class=\"form-control\"></span>-->\n" +
    "            <select tabindex=\"6\" id=\"ddlProduct\" name=\"selectedproduct\" class=\"form-control select_tag\" ng-model=\"selectedproduct\" ng-options=\"procuctdetail.ProductName for procuctdetail in procuctdetails\" required>\n" +
    "            <option value=\"\">Select</option>\n" +
    "            </select>            \n" +
    "        </div>\n" +
    "    </div>\n" +
    "   <p class=\"clearfix\">\n" +
    "    </p>\n" +
    "    <div class=\"\">\n" +
    "        <label class=\"col-sm-3 control-label\">\n" +
    "            <em>*</em> Problem Description\n" +
    "        </label>\n" +
    "        <div class=\"col-sm-9\">\n" +
    "            <div class=\"controls\">\n" +
    "                <textarea tabindex=\"7\" rows=\"5\" id=\"txt_ProblemNotes\" ng-model=\"scheduleProblemDescription\" class=\"form-control input_tag\" required\n" +
    "                    name=\"scheduleProblemDescription\" placeholder=\"Please enter Problem Description\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>     \n" +
    "    <div class=\"btnrenewal_position\">\n" +
    "     \n" +
    "        <input type=\"submit\" tabindex=\"8\" class=\"btn btn-primary login_but padd_new\" id=\"btnAddSched\" ng-click=\"saveNewSchedule(NewScheduleForm.$valid);\" value=\"Submit\" />\n" +
    "    </div>\n" +
    "   \n" +
    "   </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</form>\n" +
    "\n" +
    "<script type=\"text/javascript\"> \n" +
    "$(document).ready(function(){\n" +
    "    // $(\"#txt_Problem\").keyup(removeextra).blur(removeextra);\n" +
    "    // $(\"#txt_ProblemNotes\").keyup(removeextra).blur(removeextra);\n" +
    "});\n" +
    "function removeextra() {\n" +
    "    var initVal = $('#txt_Problem').val();\n" +
    "    outputVal = initVal.replace(/[^0-9a-zA-Z&,!' ']/g,\"\");       \n" +
    "    if (initVal != outputVal) {\n" +
    "        $(this).val(outputVal);\n" +
    "    }\n" +
    "    var initdesc = $('#txt_ProblemNotes').val();\n" +
    "    outputValdesc = initdesc.replace(/[^0-9a-zA-Z&,!' ']/g,\"\");       \n" +
    "    if (initdesc != outputValdesc) {\n" +
    "        $(this).val(outputValdesc);\n" +
    "    }\n" +
    "};\n" +
    "</script>");
}]);

angular.module("support/scheduleacall/scheduleacallRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/scheduleacall/scheduleacallRight.tpl.html",
    "<div class=\"right_bg_cont\" ng-init=\"scheduledcase();\">\n" +
    "\n" +
    "<div class=\"data_cont\">\n" +
    "<div class=\"cont_title\"> Schedule a Call </div>\n" +
    " <div class=\"container_mid_schedule\">\n" +
    "<div class=\"widget-table scheduledCalendar\" id=\"divWidget\">\n" +
    "        <!--Content section start-->\n" +
    "        <div style=\"\">\n" +
    "            <div class=\"bg_calender_opacity\">\n" +
    "            </div>\n" +
    "            <div id=\"calendar\">\n" +
    "            </div>\n" +
    "            <div id=\"btnsec\" class=\"btnposition schedulebtn_position\" ng-show=\"isShowbutton\">\n" +
    "                <input type=\"button\" class=\"btn btn-primary login_but\" ng-click=\"redirectToNewSchedule();\" value=\"New Schedule\"\n" +
    "                    id=\"btnSdle\" />\n" +
    "                <input type=\"button\" class=\"btn btn-primary login_but padd_sch\" id=\"btnRefresh\" value=\"Refresh\" ng-click=\"refreshScheduleacall();\"/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- end of cont sect-->\n" +
    "    </div> \n" +
    "    </div> \n" +
    "</div> \n" +
    "<div id=\"fullCalModal\" class=\"modal fade\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header\"> \n" +
    "                <h4 id=\"modalTitle\" class=\"modal-titlee\"></h4>\n" +
    "            </div>\n" +
    "            <!-- <div id=\"modalBody\" class=\"modal-bodyy\"><pre></pre></div> -->\n" +
    "            <label id=\"lblSchedule\" class=\"modal-bodyy\"></label>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <button type=\"button\" class=\"large red button\" data-dismiss=\"modal\">Close</button>  \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    " ");
}]);

angular.module("support/webticket/newticket.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/webticket/newticket.tpl.html",
    "<form name=\"frmNewCase\">\n" +
    "    <div class=\"right_bg_cont\" ng-init=\"getProductDet()\">\n" +
    "        <div class=\"data_cont rightdivHeight\">\n" +
    "            <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>New Ticket</span>\n" +
    "                </div>\n" +
    "                <div class=\"container_mid\">\n" +
    "                <div class=\"\">\n" +
    "                    <span class=\"mandtry pull-right\"><em>* </em>Mandatory Fields</span>\n" +
    "                    <p class=\"clearfix\">\n" +
    "                    </p>\n" +
    "                    <div class=\"\">\n" +
    "                        <label class=\"col-sm-3 control-label\">\n" +
    "                            <em>*</em>Product\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <div class=\"controls\">\n" +
    "                                <select id=\"ddlProduct\" name=\"selectedproductdet\" class=\"form-control select_tag\" ng-model=\"selectedproductdet\"\n" +
    "                                    ng-options=\"productdet.ProductName for productdet in productdetail\" required>\n" +
    "                                    <option value=\"\">Select</option>\n" +
    "                                </select>\n" +
    "                                <p class=\"help-block\">\n" +
    "                                </p>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"\">\n" +
    "                        <label class=\"col-sm-3 control-label\">\n" +
    "                            <em>*</em>Problem Title\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <div class=\"controls\">\n" +
    "                                <input type=\"text\" maxlength=\"200\" id=\"txtSummary\" name=\"Summary\" class=\"form-control input_tag\"\n" +
    "                                    required />\n" +
    "                                <p class=\"help-block\">\n" +
    "                                </p>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"\">\n" +
    "                        <label class=\"col-sm-3 control-label\">\n" +
    "                            <em>*</em>Problem Description\n" +
    "                        </label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <div class=\"controls\">\n" +
    "                                <textarea rows=\"10\" id=\"txtProblem\" ng-model=\"newticketProblemDescription\" class=\"form-control input_tag\"\n" +
    "                                    name=\"Problem\" placeholder=\"Describe your question / issue you are having in detail\"\n" +
    "                                    required></textarea>\n" +
    "                                <p class=\"help-block\">\n" +
    "                                </p>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"\">\n" +
    "                    <div class=\"col-sm-9\" style=\"display: none;\">\n" +
    "                        <div class=\"controls\">\n" +
    "                            <div id=\"divRegistrationId\" style=\"display: none\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "                <div class=\"btnrenewal_position\"> \n" +
    "                        <input type=\"submit\" class=\"btn btn-primary login_but padd_new\"  ng-click=\"createNewTicket(frmNewCase.$valid);\" id=\"btnnewTicket\" value=\"Submit\"/> \n" +
    "                </div>\n" +
    "            </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<script type=\"text/javascript\"> \n" +
    "$(document).ready(function(){\n" +
    "    // $(\"#txtSummary\").keyup(removeextra).blur(removeextra);\n" +
    "    // $(\"#txtProblem\").keyup(removeextra).blur(removeextra);\n" +
    "});\n" +
    "function removeextra() {\n" +
    "    var initVal = $('#txtSummary').val();\n" +
    "    outputVal = initVal.replace(/[^0-9a-zA-Z&,!' ']/g,\"\");\n" +
    "    if (initVal != outputVal) {\n" +
    "        $(this).val(outputVal);\n" +
    "    }\n" +
    "    var initdesc = $('#txtProblem').val();\n" +
    "    outputValdesc = initdesc.replace(/[^0-9a-zA-Z&,!' ']/g,\"\");\n" +
    "    if (initdesc != outputValdesc) {\n" +
    "        $(this).val(outputValdesc);\n" +
    "    }\n" +
    "};\n" +
    "</script>");
}]);

angular.module("support/webticket/webticketRight.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("support/webticket/webticketRight.tpl.html",
    "\n" +
    "<div class=\"right_bg_cont\" ng-init=\"bindCaseDetails();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"cont_title\"> Web Ticket </div>\n" +
    "        <div class=\"container_mid\">\n" +
    "                 <div class=\"table-responsive\" style=\"height:27vw;\">\n" +
    "                     <table class=\"table-striped table-bordered \" style=\"width:100%;font-family:Calibri !important;font-size:1vw !important;\">\n" +
    "                         <thead>\n" +
    "                             <tr style=\"height:2vw;\">\n" +
    "                             <th>Case Id</th>\n" +
    "                             <th>Case Summary</th>\n" +
    "                             <th>Case Status</th>\n" +
    "                             </tr>\n" +
    "                         </thead>\n" +
    "                         <tbody>\n" +
    "                             <tr ng-repeat=\"caseDet in caseDetails\" class=\"table-row table-row-group \">\n" +
    "                                 <td class=\"table-column table-column-group\" style=\"padding:1%;width:15%;\">{{caseDet.CaseId}}</td>\n" +
    "                                 <td class=\"table-column table-column-group breakword\" style=\"padding:1%;\">\n" +
    "                                 {{encodeSummary(caseDet.CaseSummary)}}\n" +
    "                                  </td>\n" +
    "                                 <td class=\"table-column table-column-group\" style=\"padding:1%;width:15%;\">{{caseDet.CaseStatus}}</td>\n" +
    "                             </tr>\n" +
    "                         </tbody>\n" +
    "                     </table>\n" +
    "                 </div>\n" +
    "         <div class=\" orange\" >\n" +
    "              \n" +
    "                <input type=\"button\" class=\"btn btn-primary login_but new-ticket pull-right padd_new\"  ng-click=\"refreshwebticket();\" id=\"btnRefresh\" value=\"Refresh\"/>\n" +
    "                  <input type=\"button\" class=\"btn btn-primary login_but new-ticket pull-right  \"  ng-click=\"redirectToNewTicket();\" id=\"btnCN\" value=\"New Ticket\"/> \n" +
    "            </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/networktools/networkmap/networkmap.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/networktools/networkmap/networkmap.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont rightdivHeight\" ng-init=\"loadDevices();\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "            <div class=\"cont_title\">\n" +
    "                <span>Network Map</span>\n" +
    "            </div>\n" +
    "            <div class=\"container_mid\" id=\"dv1\">\n" +
    "                <div class=\"btnrenewal_position\">\n" +
    "                    <!--<input type=\"submit\" class=\"netgearbtncolor login_but padd_new\" ng-model=\"btnAddDev\"\n" +
    "                        ng-click=\"adddevicesList();\" value=\"Add Devices\" />-->\n" +
    "                    <input type=\"submit\" class=\"netgearbtncolor login_but padd_new\" ng-model=\"btnRemDev\"\n" +
    "                        ng-click=\"removedevicesList();\" value=\"Remove this Machine\" />\n" +
    "                </div>\n" +
    "                <div class=\"networkmap\">\n" +
    "                    <fieldset>\n" +
    "                        <legend>USB</legend>\n" +
    "                        <ul class=\"usblist\">\n" +
    "                        </ul>\n" +
    "                    </fieldset>\n" +
    "                    <fieldset>\n" +
    "                        <legend>LAN Machine</legend>\n" +
    "                        <ul class=\"lanlist\">\n" +
    "                        </ul>\n" +
    "                    </fieldset>\n" +
    "                    <fieldset>\n" +
    "                        <legend>Printers & Fax</legend>\n" +
    "                        <ul class=\"printerlist\">\n" +
    "                        </ul>\n" +
    "                    </fieldset>\n" +
    "                    <fieldset>\n" +
    "                        <legend>Network Adapters</legend>\n" +
    "                        <ul class=\"networklist\">\n" +
    "                        </ul>\n" +
    "                    </fieldset>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("systemtools/networktools/networkspeed/networkspeed.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/networktools/networkspeed/networkspeed.tpl.html",
    "<div class=\"right_bg_cont\" ng-init=\"initNetworkSpeed()\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "              <div class=\"cont_title\">\n" +
    "                  <span>Network Speed</span>\n" +
    "              </div>\n" +
    "               <div class=\"container_mid\" id=\"dv1\">\n" +
    "              <p style=\"background:#d7d7d7;margin:0.2vw;\">Download Speed :&nbsp;<span>{{downloadspeed}}</span>&nbsp;mbps&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Upload Speed :&nbsp;<span>{{uploadspeed}}</span>&nbsp;mbps&nbsp;</p>\n" +
    "                    <div class=\"networkSpeed\">\n" +
    "                       \n" +
    "                    </div>\n" +
    "              </div>        \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/networktools/networkusage/networkusage.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/networktools/networkusage/networkusage.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont rightdivHeight\" ng-init=\"initBWLoaoded();\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "              <div class=\"cont_title\">\n" +
    "                  <span>Network Usage</span>\n" +
    "              </div>\n" +
    "               <div class=\"container_mid\" id=\"dv1\">\n" +
    "                    <div class=\"networkUsage\">\n" +
    "                        \n" +
    "                    </div>\n" +
    "              </div>        \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/optimizationsuite/antivirus/antivirus.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/optimizationsuite/antivirus/antivirus.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\" ng-init=\"loadDriver();\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>AntiVirus</span>\n" +
    "                </div>\n" +
    "                <div class=\"container_mid\" id=\"dvantivirus\" style=\"display: none\">\n" +
    "                <div class=\"container-sec\"> \n" +
    "                     <div class=\"cdrive2 cdrive-border\">\n" +
    "                        <span class=\"cdrive_radio\"><input type=\"radio\" checked onclick=\"deepscan(1);\" value=\"1\" name=\"chkJunkFile\"  id=\"chkJunkFile\"></span> <span class=\"cdrive_text\">Quick Scan </span>\n" +
    "                        <span class=\"cdrive_radio\"><input type=\"radio\" value=\"2\" name=\"chkJunkFile\" id=\"chkJunkInternetOptimizer\" onclick=\"deepscan(2);\" ></span> <span class=\"cdrive_text\">Deep Scan</span>\n" +
    "                         <span class=\"cdrive_radio\"><input type=\"radio\" value=\"3\" onclick=\"deepscan(3);\" name=\"chkJunkFile\" id=\"chkDiskPerformance\" ></span> <span class=\"cdrive_text\">Customize scan</span>\n" +
    "                    </div>\n" +
    "                </div> \n" +
    "\n" +
    "\n" +
    "                    <div class=\"pcoptimize_cont\">\n" +
    "                        <div class=\"tuner_cont2\">\n" +
    "                            <div id=\"junkimg\" class=\"tuner_space junk_cont \">\n" +
    "                                <i class=\"icon-junkfiles junk_icon\"></i>\n" +
    "                            </div>  \n" +
    "                            <div class=\"junk_checkbox\"></div>\n" +
    "                        </div> \n" +
    "                    </div>   \n" +
    "                </div> \n" +
    "\n" +
    "\n" +
    "                <div id=\"dv2\" class=\"container_mid\"  style=\"display: none\">\n" +
    "                <div class=\"defrag-sec\">\n" +
    "                     \n" +
    "                     <div class=\"defrag_cont\">\n" +
    "                        <span class=\"defrag_toptext\">Select the drive that you wish to Scan :</span>\n" +
    "                       \n" +
    "                        <div class=\"defragment_table\">\n" +
    "                    <table class=\"pcoptimize_fix\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\">\n" +
    "                        <tbody>\n" +
    "                            <tr>\n" +
    "                                <th>\n" +
    "                                    Drive Name\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    Drive Label\n" +
    "                                </th>\n" +
    "                                \n" +
    "                            </tr>\n" +
    "                            <tr ng-repeat=\"driveDetails in driversListDetails\" class=\"table-row table-row-group\">\n" +
    "                               \n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"driveDetails.IsSelected\">\n" +
    "                                    {{driveDetails.DriveName}}\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{driveDetails.DriveLabel}}\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div> \n" +
    "                    </div> \n" +
    "                </div> \n" +
    "                 \n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <div id=\"dvScannnedDetails\" class=\"container_mid\" style=\"display:none;\">\n" +
    "                 <div class=\"scan_virus\">\n" +
    "                    <table class=\"pcoptimize_fix\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\">\n" +
    "                        <tbody>\n" +
    "                            <tr>\n" +
    "                                <th>\n" +
    "                                                                    \n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    Virus Status\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                   Virus Name\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                   File Path\n" +
    "                                </th>\n" +
    "                            </tr>\n" +
    "                            <tr ng-repeat=\"scanfiles in scannedAntivirusFiles\" class=\"table-row table-row-group\">\n" +
    "                               <td ng-switch=\"scanfiles.Virusstatus\"> \n" +
    "\n" +
    "                               <span ng-switch-when=\"Found\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"scanfiles.Check\" checked> \n" +
    "                                </span>\n" +
    "                                <span ng-switch-when=\"Deleted\"> \n" +
    "                                <span class=\"idle_bg chtlbl\" style=\"cursor:Pointer;\">Deleted</span> \n" +
    "                                </span>\n" +
    "                                <span ng-switch-when=\"Warning\"> \n" +
    "                                <span class=\"idle_bg chtlbl\" style=\"cursor:Pointer;\">Warning</span> \n" +
    "                                </span> \n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{scanfiles.IsVirus}}\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{scanfiles.VirusName}}\n" +
    "                                </td>\n" +
    "                                 <td class=\"table-column table-column-group\">\n" +
    "                                    {{scanfiles.Path}}\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    " \n" +
    "                <div class=\"pgm_path browse_antivirus\" id=\"dv3\" style=\"display: none\">\n" +
    "                    <span>\n" +
    "                       <input type=\"text\" id=\"txtbro\" class=\"txtBrowse\" ng-model=\"filepath\" readonly=\"true\" ng-click=\"openBrowse();\">\n" +
    "                    </span>\n" +
    "                   <span>\n" +
    "                        <input type=\"button\" class=\"orange_color login_but align_but\" value=\" Browse \" ng-click=\"openBrowse();\">\n" +
    "                   </span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"foot-button\" id=\"dvfooter\"> \n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoantiviruspath();\" id=\"btnscan\">Scan Now</button>\n" +
    "                    <button type=\"button\" id=\"btnshowdetails\" class=\"orange_color align_but\" ng-click=\"showScandetails();\" id=\"btnshowdetails\">Show Details</button>\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"fixVirusClean();\" id=\"btnfix\">Fix</button>\n" +
    "                </div> \n" +
    "\n" +
    "                 <div style=\"clear:both;display:none;position:relative; top:15px;word-wrap:break-word;\" id=\"dvshowresults\">       \n" +
    "                            <div id=\"dvshowwarning\" class=\"alertwarning alert-warning_color fade in\"> \n" +
    "                                <span id=\"scanresult\"></span><br>\n" +
    "                                <span id=\"scanresultcount\"></span>  \n" +
    "                            </div> \n" +
    "                </div>\n" +
    "</div>");
}]);

angular.module("systemtools/optimizationsuite/databackup/databackup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/optimizationsuite/databackup/databackup.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>DataBack up</span>\n" +
    "                </div>\n" +
    "                 <div class=\"container_mid\">\n" +
    "                 \n" +
    "                <div class=\"container-sec\">\n" +
    "					<p> <strong>Files to Backup:</strong>\n" +
    "                    <input type=\"file\" class=\"browse\" name=\"file\" id=\"file\"  multiple onchange=\"bindFileList()\"/>&nbsp;<input type=\"button\" id=\"btnbrowse\" class=\"orange_color login_but align_but\" value=\" Browse \" onclick=\"opendatabackup();\">\n" +
    "					</p> \n" +
    "				</div> \n" +
    "                </div>\n" +
    "                <br />\n" +
    "                <div class=\"clsdatabkup\">\n" +
    "                    <div class=\"fileListTable\">\n" +
    "                        <table class=\"diskBackupTable\" border=\"1\" cellspacing=\"0\" cellpadding=\"1\">\n" +
    "                            <tbody class=\"diskbkpBody\">\n" +
    "                                <tr class=\"filesHeader\">\n" +
    "                                    <td>File Name</td>\n" +
    "                                    <td>File Size</td>\n" +
    "                                    <td>Sync Status</td>\n" +
    "                                </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>    \n" +
    "                </div>\n" +
    "                <div class=\"uploadbtndiv\">\n" +
    "                    <div id=\"szlider\" style=\"width:23vw;\" >\n" +
    "                        <div id=\"szliderbar\">\n" +
    "                        </div>\n" +
    "                        <div id=\"szazalek\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <span class=\"btnupload\"><input id=\"btnfileUpload\" type=\"button\" class=\"btn btn-primary login_but\" ng-model=\"btnupload\" value=\"Upload\" ng-click=\"uploadstart()\" /></span>\n" +
    "                </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/optimizationsuite/defragmentation/defragmentation.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/optimizationsuite/defragmentation/defragmentation.tpl.html",
    "<div class=\"right_bg_cont\" ng-init=\"startDefragment();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>Defragmentation</span>\n" +
    "                </div>\n" +
    "                <div id=\"dvDefragmentOptions\" class=\"container_mid\" style=\"display: none\">\n" +
    "                <div class=\"defrag-sec\">\n" +
    "					 \n" +
    "                     <div class=\"defrag_cont\">\n" +
    "                        <span class=\"defrag_toptext\">Select the drive that you wish to defragment :</span>\n" +
    "                       \n" +
    "                        <div class=\"defragment_table\">\n" +
    "                    <table class=\"pcoptimize_fix\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\">\n" +
    "                        <tbody>\n" +
    "                            <tr>\n" +
    "                                <th>\n" +
    "                                    Drive Name\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    Drive Label\n" +
    "                                </th>\n" +
    "                                \n" +
    "                            </tr>\n" +
    "                            <tr ng-repeat=\"driveDetails in driversListDetails\" class=\"table-row table-row-group\">\n" +
    "                               \n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"driveDetails.IsSelected\">\n" +
    "                                    <i class=\"icon-drawer2\"></i> {{driveDetails.DriveName}}\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{driveDetails.DriveLabel}}\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "\n" +
    "                        <div class=\"blankpage\">\n" +
    "                            <center><img src=\"assets/Content/img/progressbar.gif\" style=\"width: 11vw;\" ng-model=\"loaderdisplay\" ng-show=\"loaderdisplay\"></center>\n" +
    "                        </div>\n" +
    "                         <span class=\"stripline\"></span>\n" +
    "                        <div class=\"cdrive\">\n" +
    "                        <span class=\"cdrive_radio\"><input type=\"radio\" name=\"rdbdefraganalyse\" value=\"0\" checked onclick=\"setForceDefragControl();\"></span> <span class=\"cdrive_text\">Analyze Only </span>\n" +
    "                        <span class=\"cdrive_radio\"><input type=\"radio\" value=\"1\" name=\"rdbdefraganalyse\" onclick=\"setForceDefragControl();\"></span> <span class=\"cdrive_text\">Defragmentation</span>\n" +
    "                        </div>\n" +
    "                         <div class=\"cdrive\"><span class=\"cdrive_radio\"><input id=\"chkForceDefragment\" type=\"checkbox\" name=\"chkForceDefragment\" ></span> <span class=\"cdrive_text\">Force defragmentation even if free space is low </span> </div> \n" +
    "                    </div>\n" +
    "   \n" +
    "                </div> \n" +
    "                <div class=\"foot-button\">\n" +
    "                        <button type=\"button\" id=\"btnStart\" class=\"btn btn-primary login_but new-ticket pull-right padd_new\" ng-click=\"initDefragmentation();\">Start</button> \n" +
    "                            <button type=\"button\" id=\"btnStop\" class=\"btn btn-primary login_but new-ticket pull-right padd_new\" ng-click=\"stopProcess();\" style=\"display:none\">Stop</button>\n" +
    "                         <button type=\"button\" id=\"btnViewReport\" class=\"orange_color align_but\" ng-click=\"showReport();\" style=\"display:none\">View Report</button>\n" +
    "                        </div>\n" +
    "				</div> \n" +
    "                 <div id=\"dvDefragmentationDetails\" class=\"container_mid\" style=\"display: none\">\n" +
    "                <div class=\"diskAnalHeader\">\n" +
    "                    <span id=\"spnanalyse\"><b>Disk Analysis Report</b></span>\n" +
    "                    <span id=\"spndefragment\"><b>Disk Defragmentation Report</b></span></div>\n" +
    "                <div class=\"diskAnalysis\" style=\"height: 23.5vw; width: 100%;\">\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <span class=\"diskBack\">\n" +
    "                        <input type=\"button\" class=\"btn btn-primary login_but new-ticket pull-right padd_new\" value=\"Finish\" ng-click=\"closeAnalysisDetails();\"><span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div> \n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/optimizationsuite/firewall/firewall.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/optimizationsuite/firewall/firewall.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>Firewall</span>\n" +
    "                </div>\n" +
    "                 <div class=\"container_mid\" id=\"dv1\"> \n" +
    "                    <div class=\"container-sec\">\n" +
    "\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"radio\" name=\"rdbinOutBound\" checked value=\"inBound\"></span>\n" +
    "                    <span class=\"anti_inputtext\">Inbound Rule </span> \n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"radio\" name=\"rdbinOutBound\" value=\"outBound\"></span>\n" +
    "                    <span class=\"anti_inputtext\"> Outbound Rule</span> \n" +
    "                    </div> \n" +
    "                    </div>\n" +
    "                  <!--   <p class=\"rule_type\">Rule Type </p><br /><p> Select the type of Firewall Rute to create</p> -->\n" +
    "                   <div class=\"container_path\" style=\"margin-top:2vw;\">\n" +
    "                    Rule Type\n" +
    "                    </div>\n" +
    "                     <div class=\"pgm_path\">\n" +
    "                     &nbsp;&nbsp;Select the type of Firewall Rute to create.\n" +
    "                     </div>\n" +
    "                    <div class=\"container-sec\">\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"radio\" name=\"rdbappPort\" checked value=\"application\"></span>\n" +
    "                    <span class=\"anti_inputtext\">Application Rule that controls connections for a program </span> \n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"radio\" name=\"rdbappPort\" value=\"port\"></span>\n" +
    "                    <span class=\"anti_inputtext\"> Port Rule that controls connections for a TCP or a UDP Port</span>\n" +
    "                    </div> \n" +
    "                    </div>\n" +
    "                \n" +
    "                    <div class=\"foot-button\"> \n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv2');\">Next</button>\n" +
    "                    <button type=\"button\" ng-click=\"cancelFirwallrule()\" id=\"btncancel\" class=\"orange_color align_but\">Cancel</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                 <div class=\"container_mid\" id=\"dv2\"> \n" +
    "                    \n" +
    "                    <div class=\"container_path\">\n" +
    "                      Program Path \n" +
    "                    </div>\n" +
    "                     <div class=\"pgm_path\">\n" +
    "                     &nbsp;&nbsp;Specify the full program path and Executable name of the program that this rule matches.\n" +
    "                     </div>\n" +
    "                    <div class=\"pgm_path browse_firewall\">\n" +
    "                    <span>\n" +
    "                       <input type=\"text\" id=\"txtbro\" class=\"txtBrowse\" ng-model=\"filepath\" readonly=\"true\" ng-click=\"openBrowse();\">\n" +
    "                    </span>\n" +
    "                   <span>\n" +
    "                        <input type=\"button\" class=\"orange_color login_but align_but\" value=\" Browse \" ng-click=\"openBrowse();\">\n" +
    "                   </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"foot-button\">\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv1');\">Back</button>\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv3');\">Next</button>\n" +
    "                    <button type=\"button\" ng-click=\"cancelFirwallrule()\" id=\"btnpgmpathcancel\" class=\"orange_color align_but\">Cancel</button>\n" +
    "                    </div>\n" +
    "                  </div> \n" +
    "\n" +
    "\n" +
    "                  <div class=\"container_mid\" id=\"dv6\"> \n" +
    "                    \n" +
    "                    <div class=\"container_path\">\n" +
    "                      Remote Ports\n" +
    "                    </div>\n" +
    "                     <div class=\"pgm_path\">\n" +
    "                     &nbsp;&nbsp;Does this rule apply to TCP or UDP?\n" +
    "                     </div>\n" +
    "                    <div class=\"container-sec \">\n" +
    "                        <div class=\"fixed_cont portborder\">\n" +
    "                        <span class=\"anti_input\"><input type=\"radio\" name=\"rdbPorts\" checked value=\"TCP\"></span>\n" +
    "                        <span class=\"anti_inputtext\">TCP </span>&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "                        <span class=\"portType\"><input type=\"radio\" name=\"rdbPorts\" value=\"UDP\"></span>\n" +
    "                        <span class=\"anti_inputtext\">&nbsp;&nbsp;UDP</span> \n" +
    "                        </div></br>\n" +
    "                          <div class=\"remote_path\">Specify remote ports</div>\n" +
    "                         <div>\n" +
    "                          <input type=\"text\" id=\"portnumbers\" class=\"txtBrowse\" ng-model=\"portnumbers\"></br>\n" +
    "                          <p>Example : 80 , 443 , 5000 - 5010</p>\n" +
    "                          </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"foot-button\">\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv1');\">Back</button>\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv3');\">Next</button>\n" +
    "                    <button type=\"button\" ng-click=\"cancelFirwallrule()\" id=\"btnremotecancel\" class=\"orange_color align_but\">Cancel</button>\n" +
    "                    </div>\n" +
    "                  </div> \n" +
    "\n" +
    "                 <div class=\"container_mid\" id=\"dv3\"> \n" +
    "\n" +
    "                    <div class=\"container_path\">\n" +
    "                    Action Type\n" +
    "                    </div>\n" +
    "                     <div class=\"pgm_path\">\n" +
    "                     &nbsp;&nbsp;Specify the Action.\n" +
    "                     </div>\n" +
    "                    <div class=\"container-sec\">\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"radio\" checked name=\"rdballwConct\" value=\"allow\"></span>\n" +
    "                    <span class=\"anti_inputtext\">Allow Connection </span> \n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"radio\" name=\"rdballwConct\" value=\"block\"></span>\n" +
    "                    <span class=\"anti_inputtext\">Block Connection</span>\n" +
    "                    </div> \n" +
    "                    </div>\n" +
    "                    <div class=\"foot-button\">\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv2');\">Back</button>\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv4');\">Next</button>\n" +
    "                    <button type=\"button\" ng-click=\"cancelFirwallrule()\" id=\"btnaction\" class=\"orange_color align_but\">Cancel</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"container_mid\" id=\"dv4\">\n" +
    "                    <div class=\"container_path\">\n" +
    "                    Profile Type\n" +
    "                    </div>\n" +
    "                     <div class=\"pgm_path\">\n" +
    "                     &nbsp;&nbsp;Specify the Profiles for which the rules applies.\n" +
    "                     </div>\n" +
    "                    <div class=\"container-sec\">\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" id=\"chkDomain\"   value=\"domain\" checked></span>\n" +
    "                    <span class=\"anti_inputtext\">Domain </span></br>\n" +
    "                    <p class=\"rule_profiles\"> Applies when a computer is connected to its corporate domain</p> \n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" id=\"chkPrivate\"   value=\"private\" checked></span>\n" +
    "                    <span class=\"anti_inputtext\"> Private</span></br>\n" +
    "                    <p class=\"rule_profiles\"> Applies when a computer is connected to a Private Network</p>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" id=\"chkPublic\"   value=\"public\" checked></span>\n" +
    "                    <span class=\"anti_inputtext\"> Public</span></br>\n" +
    "                    <p class=\"rule_profiles\">Applies when a computer is connected to a Public Network</p>\n" +
    "                    </div> \n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"foot-button\">\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv3');\">Back</button>\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv5');\">Next</button>\n" +
    "                    <button type=\"button\" ng-click=\"cancelFirwallrule()\" id=\"btnprofile\" class=\"orange_color align_but\">Cancel</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"container_mid\" id=\"dv5\">\n" +
    "                    <div class=\"container_path\">\n" +
    "                    Rule Detail\n" +
    "                    </div>\n" +
    "                     <div class=\"pgm_path\">\n" +
    "                     &nbsp;&nbsp;Specify the Name and Description of this rule.\n" +
    "                     </div>\n" +
    "                    <div class=\"container-sec\">\n" +
    "                     <div class=\"fixed_cont\">\n" +
    "                     <span class=\"anti_inputtext\">Name</span>\n" +
    "                    </div> \n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <input type=\"text\" ng-model=\"ruleName\" id=\"ruleName\" value=\"\" class=\"input_tag_firewall\">                    \n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont description_top\">\n" +
    "                     <span class=\"anti_inputtext\">Description(Optional):</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <textarea type=\"text\" ng-model=\"ruleDescription\" id=\"ruleDescription\" class=\"input_tag_firewall\">  </textarea>\n" +
    "                    </div> \n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"foot-button\">\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"redirecttoProgrampath('dv4');\">Back</button>\n" +
    "                    <button type=\"button\" class=\"orange_color align_but\" ng-click=\"createFirwallrule()\">Finish</button>\n" +
    "                    <button type=\"button\" id=\"btnrulecancel\" class=\"orange_color align_but\" ng-click=\"cancelFirwallrule()\">Cancel</button>\n" +
    "                    </div>\n" +
    "                </div> \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/optimizationsuite/parentalcontrol/parentalcontrol.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/optimizationsuite/parentalcontrol/parentalcontrol.tpl.html",
    "<div class=\"right_bg_cont\" ng-init=\"bindblockDetails();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>Parental Control</span>\n" +
    "                </div>\n" +
    "               \n" +
    "                <div class=\"container_mid\">\n" +
    "                 <form name=\"frmparentalcontrol\">\n" +
    "                <div class=\"container-parental\">\n" +
    "					              <div class=\"dv_url\" >\n" +
    "                        <label>Enter URL To Block</label>\n" +
    "                        </div>\n" +
    "                        <div class=\"dv_parent\" >\n" +
    "                         <span class=\"blockUrl\"><input type=\"text\" id=\"txturl\" class=\"form-control input_tag_parent\" ng-model=\"frmdata.txturl\" name=\"url\"></span>\n" +
    "                         <span><input type=\"submit\" class=\"orange_color btnBlock\" ng-click=\"blockWebsite();\" value=\"Block Site\" /></span>\n" +
    "                        \n" +
    "                         <span class=\"exmParent\">Eg:www.example.com</span> \n" +
    "                        </div>\n" +
    "                        <div>\n" +
    "                        \n" +
    "                        </div> \n" +
    "				        </div>\n" +
    "                        </form>\n" +
    "                <!-- <div style=\"clear:both\"> -->\n" +
    "                <form name=\"frmunblockparentalcontrol\">\n" +
    "                      <div class=\"parental_display\" style=\"display:none\">\n" +
    "                      <div class=\"table-responsive\" style=\"height:27vw;\">\n" +
    "                                <table id=\"blockedTable\" cellspacing=\"0\" cellpadding=\"0\" border=\"1\" class=\"pcoptimize_fix\" style=\"width:96%;margin-left:2%;margin-top:2%;\">\n" +
    "                                 <thead>\n" +
    "                                                <tr>\n" +
    "                                                    <th>\n" +
    "                                                        Blocked Site\n" +
    "                                                    </th>\n" +
    "                                                    <th>\n" +
    "                                                        Blocked Type\n" +
    "                                                    </th>\n" +
    "                                                    <th>\n" +
    "                                                        Blocked Date\n" +
    "                                                    </th>\n" +
    "                                                    <th>\n" +
    "                                                        Unblock\n" +
    "                                                    </th>\n" +
    "                                                </tr>\n" +
    "                                            </thead>\n" +
    "                                <tbody > \n" +
    "                                  <tr ng-repeat=\"productDet in productDetailsNew\"> \n" +
    "                                    <td>{{productDet.Blocked}}</td>\n" +
    "                                      <td>{{productDet.Type}}</td> \n" +
    "                                    <td>{{convertDate(productDet.BlockedOn)}}</td>\n" +
    "                                  <td>\n" +
    "                                  <input type=\"checkbox\" id=\"chksno\" name=\"chksno\" ng-model=\"frmdata.Slno[$index]\" class=\"chkparentalurl\"  ng-true-value=\"{{productDet.Slno}}\" ng-false-value=\"false\" /></td>\n" +
    "                                  </tr> \n" +
    "                                  <tr align=\"center\" ng-if=\"productDetailsNew.length == 0\"> \n" +
    "                                    <td align=\"center\" colspan=\"4\">No Records Found</td>\n" +
    "                                  </td>\n" +
    "                                  </tr>\n" +
    "                                </tbody>\n" +
    "                                </table> \n" +
    "                                </div>\n" +
    "                        <div id=\"blockedTableFoot\" class=\"foot-button\"> \n" +
    "                        <input type=\"submit\" value=\"Unblock\" ng-click=\"UnblockWebsite();\" id=\"btnCN\" class=\"btnUnblock\">\n" +
    "                        </div>\n" +
    "                </div>\n" +
    "                </form>\n" +
    "                </div>\n" +
    "                \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/optimizationsuite/pcoptimization/pcoptimization.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/optimizationsuite/pcoptimization/pcoptimization.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "            <div class=\"cont_title\">\n" +
    "                <span>PC Optimization</span>\n" +
    "            </div>\n" +
    "            <div id=\"dvpcOptimizatoinScan\" class=\"container_mid\" style=\"display: none\">\n" +
    "                <div class=\"pcoptimize_cont\">\n" +
    "                    <!-- <div>\n" +
    "                        <span id=\"spnRecordCount\" style=\"display: none;\"></span></br></div> -->\n" +
    "                    <div class=\"tuner_cont\">\n" +
    "                        <div id=\"junkimg\" class=\"tuner_space\">\n" +
    "                            <i class=\"icon-junkfiles junk_icon\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"junk_checkbox\">\n" +
    "                            <span class=\"junk_input\">\n" +
    "                                <input type=\"checkbox\" id=\"chkJunkFiles\" ng-model=\"chkJunkFile\" checked></span><span\n" +
    "                                    class=\"file_folder\">Junk Files &amp; Folders</span></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"tuner_cont\">\n" +
    "                        <div id=\"internetimg\" class=\"tuner_space\">\n" +
    "                            <i class=\" icon-internet junk_icon\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"junk_checkbox\">\n" +
    "                            <span class=\"junk_input\">\n" +
    "                                <input type=\"checkbox\" id=\"chkJunkInternetOptimizer\" checked ng-model=\"chkInternetOptimizer\"></span><span\n" +
    "                                    class=\"file_folder\">Internet Optimizer</span></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"tuner_cont\">\n" +
    "                        <div id=\"diskimg\" class=\" tuner_space\">\n" +
    "                            <i class=\"icon-discperformance junk_icon\"></i>\n" +
    "                        </div>\n" +
    "                        <!-- <div>\n" +
    "                            <a id=\"diskperofromanceReport\" ng-click=\"showDisperfomanceDetails();\" style=\"display: none;\">\n" +
    "                                Show Report</a>\n" +
    "                        </div> -->\n" +
    "                        <div class=\"junk_checkbox\">\n" +
    "                            <span class=\"junk_input\">\n" +
    "                                <input type=\"checkbox\" id=\"chkDiskPerformance\" ng-model=\"chkDiskPerformance\"></span><span\n" +
    "                                    class=\"file_folder\">Disk Performance &amp;\n" +
    "                                    <br>\n" +
    "                                    Space Scan </span>\n" +
    "                        </div>\n" +
    "                    </div> \n" +
    "                    \n" +
    "                </div>\n" +
    "\n" +
    "        <div style=\"clear:both;display:none;\" id=\"dvshowresults\">       \n" +
    "                            <div id=\"dvshowwarning\" class=\"alertwarning alert-warning_color fade in\">\n" +
    "                                <span id=\"spnRecordCount\">&nbsp;</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"alertwarning alert-success_color fade in\" id=\"dvRecordCountsuccess\">\n" +
    "                                <span id=\"spnRecordCountsuccess\"></span><span id=\"spanresult\" class=\"resultlink\"><a id=\"diskperofromanceReport\" ng-click=\"showDisperfomanceDetails();\">\n" +
    "                                Show Report</a></span>\n" +
    "                            </div>\n" +
    "        </div>\n" +
    "                <!-- <div class=\"blankpage\">\n" +
    "                            <center><img src=\"assets/Content/img/progressbar.gif\" style=\"width: 11vw;\" ng-model=\"loaderdisplay\" ng-show=\"loaderdisplay\"></center>\n" +
    "                    </div> -->\n" +
    "                        <div class=\"bottom_button\">\n" +
    "                        <input type=\"button\" value=\"Show Details\" id=\"btnShowDetails\" ng-click=\"showJunkFileDetails();\"\n" +
    "                            class=\"orange_color align_but optimizescan optimizescan_pcopt\" style=\"display: none;\">\n" +
    "                              <input type=\"button\" value=\"Fix\" id=\"btnFixAll\" ng-click=\"deleteJunkFiles();\" class=\"orange_color align_but optimizescan optimizescan_pcopt\"\n" +
    "                            style=\"display: none;\">\n" +
    "                        <input type=\"button\" value=\"Scan Now\" id=\"btnScanNow\" ng-click=\"scanJunkFiles();\"\n" +
    "                            class=\"orange_color align_but optimizescan optimizescan_pcopt\">\n" +
    "\n" +
    "                        <input type=\"button\" value=\"Stop Scan\" id=\"btnStopScan\" ng-click=\"stopDiskScan();\"\n" +
    "                            class=\"orange_color align_but optimizescan optimizescan_pcopt\" style=\"display: none;\">\n" +
    "                    </div>\n" +
    "\n" +
    "            </div>\n" +
    "            <div id=\"dvdiscPerformanceDetails\" class=\"container_mid\" style=\"display: none\">\n" +
    "                <div class=\"diskAnalHeader\">\n" +
    "                    <span><b>Disk Analysis Report</b></span></div>\n" +
    "                <div class=\"diskAnalysis\" style=\"height: 23.5vw; width: 100%;\">\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <span class=\"diskBack\">\n" +
    "                        <input type=\"button\" class=\"btndiskback orange_color align_but\" value=\"Back\" ng-click=\"hideDisperfomanceDetails();\"><span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div id=\"dvpcOptimizatoinShowDetails\" class=\"container_mid\" style=\"display: none\">\n" +
    "                <div class=\"scan_table\">\n" +
    "                    <table class=\"pcoptimize_fix\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\">\n" +
    "                        <tbody>\n" +
    "                            <tr>\n" +
    "                                <th>\n" +
    "                                   <!--  <input id=\"chkAllFiles\" type=\"checkbox\" onchange=\"chkAllJunkFiles()\" /> -->\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    File Name\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    File Path\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    Size\n" +
    "                                </th>\n" +
    "                            </tr>\n" +
    "                            <tr ng-repeat=\"junkDet in junkDetails\" class=\"table-row table-row-group\">\n" +
    "                                <td>\n" +
    "                                    <input type=\"checkbox\" ng-model=\"junkDet.IsSelected\" name=\"chkJunkData\">\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{junkDet.FileName}}\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{junkDet.FilePath}}\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{junkDet.FileSize}}\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "                <div class=\"bottom_button\">\n" +
    "                    <input type=\"button\" value=\"Fix\" id=\"btnFix\" ng-click=\"deleteSelctedJunkFiles();\"\n" +
    "                        class=\"orange_color align_but\">\n" +
    "                    <input type=\"button\" value=\"Cancel\" id=\"btnCancel\" ng-click=\"redirectToPCOptimization();\"\n" +
    "                        class=\"orange_color align_but\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("systemtools/optimizationsuite/registrycleaner/registrycleaner.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/optimizationsuite/registrycleaner/registrycleaner.tpl.html",
    "<style type=\"text/css\">\n" +
    "    .regwidth{word-wrap: break-word;max-width:150px;}\n" +
    "</style>\n" +
    "<div class=\"right_bg_cont\" ng-init=\"showRegistryCleaner();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "            <div class=\"cont_title\">\n" +
    "                <span>Registry Cleaner</span>\n" +
    "            </div>\n" +
    "            <div id=\"dvregScanOptions\" class=\"container_mid\" style=\"display:none;\">\n" +
    "                <div class=\"container-sec\">\n" +
    "                    <section>\n" +
    "                    <div class=\"subheader_regcleaner\">\n" +
    "                    Scan Options\n" +
    "                    </div>\n" +
    "                    <div class=\"left_control\">\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkControlScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-spinner10\"></i> Control Scan</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkUserScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-user\"></i> User Scan</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkSysSoftwareScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-optimizationsuite\"></i> System Softwares</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"isSysFontScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-font\"></i> System Fonts</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischksysHelipFilesScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-file-text2\"></i> System Help Files</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkSharedLibScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-cogs\"></i> Shared Library</span>\n" +
    "                    </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"left_control\" >\n" +
    "\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkStartUpScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-file-text\"></i> Startup Entries</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkInstallationstrScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-upload3\"></i> Installation Strings</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkVirtualDevScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-display\"></i> Virtual Devices</span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkHistoryScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-history\"></i> History and Start Menu</span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkDeepScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-podcast\"></i> Deep System Scans</span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"fixed_cont\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" class=\"chkregistryscan\" ng-model=\"ischkMRUlstScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\"><i class=\"icon-file-text\"></i> MRU List</span>\n" +
    "                    </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"fixed_cont\" style=\"display:none;\">\n" +
    "                    <span class=\"anti_input\"><input type=\"checkbox\" ng-model=\"ischkSysRestoreScan\"  /></span>\n" +
    "                    <span class=\"anti_inputtext\">Create a System Restore Point (recommended)</span>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    </section>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div id=\"dvregScanningFileDetails\" class=\"container_mid\" style=\"display:none;\">\n" +
    "                    <div class=\"container-sec\">\n" +
    "                    <section>\n" +
    "                    <div class=\"subheader_regcleaner\">\n" +
    "                    Scanning\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                    <table  id=\"scanDet\" class=\"regcleanscanDet\" border=\"1px\">\n" +
    "                        <tbody>\n" +
    "                        <tr>\n" +
    "                            <td>Scan Name :</td>\n" +
    "                            <td class=\"regwidth\"><span id=\"scanName\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Scan Description :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"scanDescription\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Match Count :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"matchCount\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Last Match :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"lastMatch\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Scan Hive :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"scanHive\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Sub Key :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"subKey\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Key Count :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"keyCount\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Segments Scanned :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"segmentsScanned \"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Segments Remaining :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"segmentsRemaining\"></span></td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>Time Elapsed :</td>\n" +
    "                            <td class=\"regwidth\"> <span id=\"timeElapsed\"></span></td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                    </section>\n" +
    "                    </div>\n" +
    "                    \n" +
    "            \n" +
    "            </div>\n" +
    "            <div id=\"dvregScannnedDetails\" class=\"container_mid\" style=\"display:none;\">\n" +
    "                 <div class=\"scan_table\">\n" +
    "                    <table class=\"pcoptimize_fix\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\">\n" +
    "                        <tbody>\n" +
    "                            <tr>\n" +
    "                                <th>\n" +
    "                                   <!--  <input id=\"chkAllFiles\" ng-model=\"chkAllconfirmed\" type=\"checkbox\" /> -->\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    Root\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    Name\n" +
    "                                </th>\n" +
    "                                <th>\n" +
    "                                    Key\n" +
    "                                </th>\n" +
    "                            </tr>\n" +
    "                            <tr ng-repeat=\"scanfiles in scannedRegistryFiles\" class=\"table-row table-row-group\">\n" +
    "                                <td>\n" +
    "                                    <input type=\"checkbox\" ng-model=\"scanfiles.Check\" checked>\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{scanfiles.Root}}\n" +
    "                                </td>\n" +
    "                                <td class=\"table-column table-column-group\">\n" +
    "                                    {{scanfiles.Name}}\n" +
    "                                </td>\n" +
    "                                 <td class=\"table-column table-column-group\">\n" +
    "                                    {{scanfiles.Key}}\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "             <div class=\"foot-button\">\n" +
    "                        <input id=\"btnRestoreRegistry\" type=\"button\" value=\"Restore Registry\" ng-click=\"restoreRegistry();\"  class=\"orange_color align_but\">\n" +
    "                        <input id=\"btnStartScan\" type=\"button\" value=\"Start\" ng-click=\"startRegistryScanning();\" class=\"orange_color align_but\">\n" +
    "                        <input id=\"btnStopScan\" type=\"button\" value=\"Stop Scan\" style=\"display:none;\" ng-click=\"stopRegistryScan();\" class=\"orange_color align_but\">\n" +
    "                        <input id=\"btnViewDetails\" type=\"button\" value=\"View Details\" ng-click=\"viewRegistryFiles();\" class=\"orange_color align_but\">\n" +
    "\n" +
    "                        <input id=\"btnFix\" type=\"button\" value=\"Fix\" ng-click=\"fixRegistryClean();\" class=\"orange_color align_but\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "       \n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("systemtools/scheduledactivities/scheduledactivities.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/scheduledactivities/scheduledactivities.tpl.html",
    "<form class=\"form-horizontal\" name=\"ScheduledForm\">\n" +
    "<div class=\"right_bg_cont\" ng-init=\"dateTimeControls();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>Scheduled Activities</span>\n" +
    "                </div>\n" +
    "                 <div class=\"container_mid\" id=\"dv1\"> \n" +
    "                \n" +
    "  <div class=\"tuner_cont_schedule-activ\">\n" +
    "        <div class=\" internetoptimize_cont \">\n" +
    "            <i class=\"icon-junkfiles junk_icon_schedule\"></i>\n" +
    "        </div>  \n" +
    "        <span class=\"file_folder_schedule\">Junk Files &amp; Folders</span>\n" +
    "    </div>\n" +
    "    <div class=\"tuner_cont_schedule-activ\">\n" +
    "        <div class=\" internetoptimize_cont\">\n" +
    "            <i class=\" icon-internet junk_icon_schedule\"></i>\n" +
    "        </div>\n" +
    "    <span class=\"file_folder_schedule\">Internet Optimizer</span>\n" +
    "    </div>\n" +
    "    <div class=\"tuner_cont_schedule-activ\">\n" +
    "        <div class=\" internetoptimize_cont\">\n" +
    "            <i class=\"icon-discperformance junk_icon_schedule\"></i>\n" +
    "        </div>\n" +
    "      <span class=\"file_folder_schedule\">Disk Performance &amp; <br> Space Scan     </span>\n" +
    "      \n" +
    "    </div>\n" +
    "      <div class=\"tuner_cont_schedule-activ\">\n" +
    "        <div class=\" internetoptimize_cont\">\n" +
    "       <i class=\" icon-antivirus junk_icon_schedule\"></i>\n" +
    "        </div>\n" +
    "     <span class=\"file_folder_schedule\">Disk Antivirus     </span>\n" +
    "        \n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"cdrive2\">\n" +
    "      <fieldset class=\"trigger_field\">\n" +
    "      <legend>Trigger:</legend>   \n" +
    "    <span class=\"cdrive_radio\">\n" +
    "    <input type=\"radio\" onclick=\"rdbChangeEvent();\" checked  name=\"rdodaily\" value=\"daily\">\n" +
    "    </span>\n" +
    "    <span class=\"cdrive_text\">Daily </span>\n" +
    "    <span class=\"cdrive_radio\">\n" +
    "    <input type=\"radio\" name=\"rdodaily\" onclick=\"rdbChangeEvent();\" value=\"weekly\">\n" +
    "    </span>\n" +
    "    <span class=\"cdrive_text\">Weekly</span>\n" +
    "    <span class=\"cdrive_radio\">\n" +
    "    <input type=\"radio\" name=\"rdodaily\" onclick=\"rdbChangeEvent();\" value=\"monthly\">\n" +
    "    </span>\n" +
    "    <span class=\"cdrive_text\">Monthly</span>\n" +
    "    <span class=\"cdrive_radio\">\n" +
    "    <input type=\"radio\" name=\"rdodaily\" onclick=\"rdbChangeEvent();\" value=\"onetime\">\n" +
    "    </span>\n" +
    "    <span class=\"cdrive_text\">One Time</span>\n" +
    "    </fieldset>\n" +
    "\n" +
    "<div id=\"daily\" class=\"dvscheduler\" style=\"display:block;\">\n" +
    "<div class=\"date-time-field\">\n" +
    "<label class=\"date-time-lab\">Start: </label>\n" +
    " <input id=\"txtDate\" tabindex=\"1\" readonly=\"readonly\" name=\"Date\" />\n" +
    "\n" +
    "&nbsp; <input type=\"text\" tabindex=\"2\" class=\"txttimepicker\" id=\"txtTime\" readonly=\"readonly\" ng-model=\"frmData.txtTime\" name=\"Time\"/>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-field\">\n" +
    "<label class=\"date-time-lab\">Recur every:</label>\n" +
    "<input type=\"text\" maxlength=\"3\" tabindex=\"3\" onkeypress=\"javascript:return isNumber(event)\" id=\"txtdays\" ng-model=\"frmData.txtdays\" name=\"days\">days\n" +
    "</div> \n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div id=\"weekly\" class=\"dvscheduler\">\n" +
    "    <div class=\"date-time-field\">\n" +
    "    <label class=\"date-time-lab\">Start: </label>\n" +
    "     <input id=\"txtweekDate\" readonly=\"readonly\"  name=\"Date\" />\n" +
    "\n" +
    "    &nbsp; <input type=\"text\" class=\"txttimepicker\" id=\"txtweekTime\" readonly=\"readonly\" ng-model=\"frmData.txtweekTime\" name=\"Time\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"date-time-field\">\n" +
    "    <label class=\"date-time-lab\">Days:</label> \n" +
    "    <div class=\"date-time-days\">\n" +
    "    <div class=\"pad_bot22\">\n" +
    "    <input type=\"checkbox\" value=\"Sunday\" name=\"weekdays\"><span class=\"pad_bot2-tex\">Sunday</span>\n" +
    "    </div>\n" +
    "    <div class=\"pad_bot22\">\n" +
    "    <input type=\"checkbox\" value=\"Monday\" name=\"weekdays\"><span class=\"pad_bot2-tex\">Monday</span>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"date-time-days\">\n" +
    "    <div class=\"pad_bot22\">\n" +
    "    <input type=\"checkbox\" value=\"Tuesday\" name=\"weekdays\"><span class=\"pad_bot2-tex\">Tuesday</span>\n" +
    "    </div>\n" +
    "    <div class=\"pad_bot22\">\n" +
    "    <input type=\"checkbox\" value=\"Wednesday\" name=\"weekdays\"><span class=\"pad_bot2-tex\">Wednesday</span>\n" +
    "    </div>\n" +
    "    </div> \n" +
    "    <div class=\"date-time-days\">\n" +
    "    <div class=\"pad_bot22\">\n" +
    "    <input type=\"checkbox\" value=\"Thursday\" name=\"weekdays\"><span class=\"pad_bot2-tex\">Thursday</span>\n" +
    "    </div>\n" +
    "    <div class=\"pad_bot22\">\n" +
    "    <input type=\"checkbox\" value=\"Friday\" name=\"weekdays\"><span class=\"pad_bot2-tex\">Friday</span>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"date-time-days\">\n" +
    "    <div class=\"pad_bot22\">\n" +
    "    <input type=\"checkbox\" value=\"Saturday\" name=\"weekdays\"><span class=\"pad_bot2-tex\">Saturday</span>\n" +
    "    </div>\n" +
    "     \n" +
    "    </div> \n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"date-time-field\">\n" +
    "    <label class=\"date-time-lab\">Recur every:</label> \n" +
    "    <input type=\"text\" maxlength=\"2\" id=\"txtweekdays\"  ng-model=\"frmData.txtweekdays\" onkeypress=\"javascript:return isNumber(event)\" name=\"days\">Weeks\n" +
    "    </div> \n" +
    "</div>\n" +
    "\n" +
    "<div id=\"monthly\" class=\"dvscheduler\">\n" +
    "<div class=\"date-time-field\">\n" +
    "<label class=\"date-time-lab\">Start: </label>\n" +
    " <input id=\"txtmonthlyDate\" readonly=\"readonly\"  name=\"Date\" />\n" +
    "\n" +
    "&nbsp; <input type=\"text\" class=\"txttimepicker\" readonly=\"readonly\"  id=\"txtmonthlyTime\" ng-model=\"frmData.txtmonthlyTime\"  name=\"Time\"/>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-field_scroll\">\n" +
    "<label class=\"date-time-lab\">Days:</label>\n" +
    "\n" +
    "\n" +
    "<div class=\"month_scroll\">\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"01\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">01</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"02\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">02</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"03\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">03</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"04\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">04</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"05\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">05</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"06\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">06</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"07\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">07</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"08\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">08</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"09\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">09</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"10\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">10</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"11\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">11</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"12\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">12</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"13\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">13</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"14\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">14</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"15\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">15</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"16\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">16</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"17\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">17</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"18\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">18</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"19\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">19</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"20\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">20</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"21\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">21</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"22\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">22</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"23\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">23</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"24\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">24</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"25\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">25</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"26\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">26</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"27\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">27</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"28\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">28</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"29\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">29</span>\n" +
    "</div>\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"30\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">30</span>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-days\">\n" +
    "<div class=\"pad_bot22\">\n" +
    "<input type=\"checkbox\" value=\"31\" name=\"monthlydays\"><span class=\"pad_bot2-tex\">31</span>\n" +
    "</div> \n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"date-time-field\" style=\"display:none;\">\n" +
    "<label class=\"date-time-lab\">Recur Eevery:</label>\n" +
    "<input type=\"text\" maxlength=\"3\" id=\"txtmonthlydays\"  ng-model=\"frmData.txtmonthlydays\" onkeypress=\"javascript:return isNumber(event)\" name=\"days\">days\n" +
    "</div> \n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"onetime\" class=\"dvscheduler\">\n" +
    "<div class=\"date-time-field\">\n" +
    "<label class=\"date-time-lab\">Start: </label>\n" +
    " <input id=\"txtonetimeDate\" readonly=\"readonly\"   name=\"Date\" />\n" +
    "\n" +
    "&nbsp; <input type=\"text\" id=\"txtoneTime\" onkeypress=\"javascript:return isNumber(event)\" class=\"txttimepicker\" readonly=\"readonly\"  ng-model=\"frmData.txtoneTime\" name=\"Time\"/>\n" +
    "</div>\n" +
    " \n" +
    "</div> \n" +
    "\n" +
    "</div>\n" +
    "\n" +
    " <div class=\"foot-button\"> \n" +
    "                    <input type=\"submit\" id=\"btnSched\" ng-click=\"schedulerActivities();\" class=\"orange_color align_but btn_scheduled\" value=\"Schedule\">\n" +
    "                     \n" +
    " </div> \n" +
    "                </div> \n" +
    "\n" +
    "                </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</form>");
}]);

angular.module("systemtools/wifitools/channelinterface/channelinterface.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/wifitools/channelinterface/channelinterface.tpl.html",
    "<div class=\"right_bg_cont\">\n" +
    "    <div class=\"data_cont rightdivHeight\" ng-init=\"loadWifiChannelDetails();\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "             <div class=\"cont_title\">\n" +
    "                 <span>Channel Interface</span>\n" +
    "             </div>  \n" +
    "             <div class=\"container_mid\">\n" +
    "                 <div id=\"wifiChannel\" style=\"color:#000 !important\"></div>\n" +
    "             </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/wifitools/dbmgraph/dbmgraph.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/wifitools/dbmgraph/dbmgraph.tpl.html",
    "<div class=\"right_bg_cont\" ng-init=\"initializeGuage();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "              <div class=\"cont_title\">\n" +
    "                  <span>dBm Graph</span>\n" +
    "              </div>\n" +
    "               <div class=\"container_mid\" id=\"dv1\">\n" +
    "                 <div id=\"dbmdisplay\">\n" +
    "                   <div class=\"dbmgraph\" id=\"connwifiname\">\n" +
    "                       <p><span>Connected To : </span><span id=\"wifiname\"></span></p></br>\n" +
    "                        <P><span>Signal Quality :</span> <span id=\"signalquality\"></span></P>\n" +
    "                   </div>\n" +
    "                   <div class=\"dbmgraph\" id=\"dbmgraph\" >\n" +
    "                      <span id=\"networkGaugeContainer\">\n" +
    "                      </span>\n" +
    "                   </div>\n" +
    "                </div>\n" +
    "                <span id=\"dbmhide\" style=\"display:none;\">No Wi-Fi access points found.</span>\n" +
    "              </div>        \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/wifitools/networkdetails/networkdetails.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/wifitools/networkdetails/networkdetails.tpl.html",
    "<div class=\"right_bg_cont\" ng-init=\"wifidetailsLoad();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "                <div class=\"cont_title\">\n" +
    "                    <span>Network Details</span>\n" +
    "                </div>  \n" +
    "                <div class=\"container_mid\">\n" +
    "                    <div id=\"wifidetails\">\n" +
    "                    </div>\n" +
    "                </div> \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("systemtools/wifitools/signalstrength/signalstrength.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("systemtools/wifitools/signalstrength/signalstrength.tpl.html",
    "<div class=\"right_bg_cont\" ng-init=\"drawChart();\">\n" +
    "    <div class=\"data_cont rightdivHeight\">\n" +
    "        <div class=\"rightdivnewTick\">\n" +
    "              <div class=\"cont_title\">\n" +
    "                  <span>Signal Strength</span>\n" +
    "              </div>\n" +
    "            <div class=\"container_mid\" id=\"dv1\">\n" +
    "                <div class=\"container-sec\">\n" +
    "                    <div class=\"dvwifi cdrive-border\" id=\"wifidiv\" style=\"display:none;\">\n" +
    "                        <span class=\"cdrive_radio\">\n" +
    "                            <input name=\"wifianalyse\" type=\"radio\" id=\"sbar\" checked class=\"rdowifi\"></span> <span class=\"cdrive_text\">\n" +
    "                                Bar</span> <span class=\"cdrive_radio\">\n" +
    "                                    <input name=\"wifianalyse\" type=\"radio\" id=\"line\" class=\"rdowifi\"></span>\n" +
    "                        <span class=\"cdrive_text\">Line</span> <span class=\"cdrive_radio\">\n" +
    "                            <input name=\"wifianalyse\" type=\"radio\" id=\"area\" class=\"rdowifi\"></span> <span class=\"cdrive_text\">\n" +
    "                                Area</span>\n" +
    "                    </div>\n" +
    "                    <div id=\"wifiAnalytics\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

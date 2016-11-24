using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using NetFwTypeLib;
using Activei.Tracker;

namespace Activei
{
    public partial class MainWindow
    {
        static readonly Regex Validator = new Regex(@"^[0-9,-]+$");
        public string fwapplicationRule(string rdbinOutBound, string rdballwConct, bool chkDomain, bool chkPrivate, bool chkPublic, string rdbappPort, string filepathval, string rdbPorts, string portnumbersVal, string ruleDescriptionVal, string ruleNameVal)
        {
            try
            {
                INetFwRule firewallRule = (INetFwRule)Activator.CreateInstance(Type.GetTypeFromProgID("HNetCfg.FWRule"));
                INetFwPolicy2 firewallPolicy = (INetFwPolicy2)Activator.CreateInstance(Type.GetTypeFromProgID("HNetCfg.FwPolicy2"));
                firewallRule.Enabled = true; // Rule will be Enabled
                int profile = 0;
                string action = "";
                if (rdbinOutBound == "inBound")
                {
                    firewallRule.Direction = NET_FW_RULE_DIRECTION_.NET_FW_RULE_DIR_IN;
                }
                else if (rdbinOutBound == "outBound")
                {
                    firewallRule.Direction = NET_FW_RULE_DIRECTION_.NET_FW_RULE_DIR_OUT;
                }
                string Block = "";
                if (rdballwConct == "block")
                {
                    firewallRule.Action = NET_FW_ACTION_.NET_FW_ACTION_BLOCK;
                    action = "1";
                    Block = "Blocked";
                }
                else if (rdballwConct == "allow")
                {
                    firewallRule.Action = NET_FW_ACTION_.NET_FW_ACTION_ALLOW;
                    action = "0";
                    Block = "Allowed";
                }


                /*
                 * Profile
                 ----------
                 Domain - 1
                 Private - 2
                 Domain,Private -3 
                 Public -4
                 Domain,Public - 5
                 Private,Public - 6
                 All - 7
                 */
                if (chkDomain == true)
                {
                    profile += 1;
                }
                if (chkPrivate == true)
                {
                    profile += 2;
                }
                if (chkPublic == true)
                {
                    profile += 4;
                }
                string RuleType = "";
                if (rdbappPort == "application")
                {
                    firewallRule.ApplicationName = filepathval;
                    RuleType = "Application";
                }
                else
                {
                    if (rdbPorts == "TCP")
                    {
                        firewallRule.Protocol = 6;
                    }
                    else
                    {
                        firewallRule.Protocol = 17;
                    }
                    RuleType = "Port";
                    firewallRule.RemotePorts = portnumbersVal;
                }
                firewallRule.Description = ruleDescriptionVal;
                firewallRule.Name = ruleNameVal;
                firewallRule.Profiles = profile;
                firewallPolicy.Rules.Add(firewallRule);
                return "Your  " + RuleType + " " + Block + " successfully !!";
                //GearHeadMessageBox.Instance.Show("Your  " + RuleType + " " + Block + " successfully !!", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("Firewall.cs", "fwapplicationRule", "", ex.Message, ex.StackTrace, "ERROR");
                return "Failed";
            }
        }
        public static bool IsValid(string str)
        {
            return Validator.IsMatch(str);
        }

        public bool portValidation(string portNo)
        {
            
            //if (txtPortNos.Text == string.Empty)
            //{
            //    GearHeadMessageBox.Instance.Show("Please Enter port nos to Allow/Block", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Error);
            //}
            //else
            bool valid = true;
            if (portNo != string.Empty)
            {
                string[] PortArray = new string[portNo.Length];

                valid = IsValid(Convert.ToString(portNo));
                if (valid == true)
                {
                    PortArray = (portNo).Split(',');
                    foreach (string port in PortArray)
                    {
                        if (port.IndexOf('-') > -1)
                        {
                            string[] Ports = new string[50];
                            Ports = port.Split('-');
                            if (Ports[0] != "" && Ports[1] != "")
                            {
                                int n, m;
                                bool isNumeric = int.TryParse(Ports[0], out n);
                                bool isNumeric1 = int.TryParse(Ports[1], out m);
                                if (!isNumeric || !isNumeric1 || (Convert.ToInt32(Ports[0]) > 65535) || (Convert.ToInt32(Ports[1]) > 65535))
                                {
                                    valid = false;
                                }
                                if (Convert.ToInt32(Ports[0]) > Convert.ToInt32(Ports[1]) || Ports.Length > 2)
                                {
                                    valid = false;
                                }
                            }
                            else
                            {
                                valid = false;
                            }
                        }
                        else
                        {
                            int n;
                            bool isNumeric = int.TryParse(port, out n);
                            if (!isNumeric || (Convert.ToInt32(port) > 65535))
                            {
                                valid = false;
                            }
                        }
                    }
                }

            }
            return valid;
        }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NativeWifi;
using System.Drawing;
using System.Windows.Forms;
using System.Net.NetworkInformation;

namespace Activei
{
    public partial class MainWindow : Form
    {
        WlanClient client;
        public string wifiname = "", sigquality = "";
        public void wifi_dBm()
        {
            try { client = new NativeWifi.WlanClient(); }
            catch (Exception) { }
            //Load Wifi dBm Details            
            //getWiFiName();
            //getWiFiSignalQuality();
            dbmTimmer.Start();
        }
        public string getsigquality()
        {
            return sigquality;
        }
        public string getWifiname()
        {
            return wifiname;
        }
        #region GetWiFiName
        /// <summary>
        /// Getting Wifi Name       
        /// </summary>
        /// <returns>Wifi Dbm Value</returns>
        private string getWiFiName()
        {
            string returnValue = "No Wi-fi is connected";
            try
            {
                string wifidetails = string.Empty;
                foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
                {
                    NativeWifi.Wlan.WlanBssEntry[] wlanBssEntries = wlanIface.GetNetworkBssList();
                    foreach (NativeWifi.Wlan.WlanBssEntry network in wlanBssEntries)
                    {
                        if (chkConnected(client, GetStringForSSID(network.dot11Ssid)))
                        {
                            returnValue = GetStringForSSID(network.dot11Ssid);
                            break;
                        }
                    }
                }
            }
            catch (Exception)
            {// returnValue = "No Wi-fi is connected";
            }
            return returnValue;
        }
        #endregion
        #region GetWiFiSignalQuality
        /// <summary>
        /// Getting Wifi Signal Quality       
        /// </summary>
        /// <returns>Wifi Dbm Value</returns>
        private string getWiFiSignalQuality()
        {
            string returnValue = "";
            try
            {
                string wifidetails = string.Empty;
                foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
                {
                    NativeWifi.Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                    foreach (NativeWifi.Wlan.WlanAvailableNetwork network in networks)
                    {
                        if (chkConnected(client, GetStringForSSID(network.dot11Ssid)))
                        {
                            returnValue = signalQualityText(network.wlanSignalQuality);
                            break;
                        }
                    }
                }
            }
            catch (Exception) { returnValue = ""; }

            return returnValue;
        }
        #endregion

        #region Signal Quality With Float
        /// <summary>
        /// Load Signal Quality
        /// </summary>
        /// <param name="quality">Quality</param>
        /// <returns>Signal Quality</returns>
        private string signalQualityText(uint quality)
        {
            string SignalQuality = "";
            if (quality <= 40)
            {
                //lblSignalQuality.ForeColor = Color.Red;
                SignalQuality = "POOR";

            }
            else if (quality <= 60)
            {
                //lblSignalQuality.ForeColor = Color.Yellow;
                SignalQuality = "GOOD";

            }
            else if (quality <= 100)
            {
                // lblSignalQuality.ForeColor = Color.Green;
                SignalQuality = "GREAT";

            }
            return SignalQuality;

        }
        #endregion

        //private System.Windows.Forms.MainWindow label;
        private void dbmTimmer_Tick(object sender, EventArgs e)
        {
            
            string datavalue = "";
            if (getWiFiDbm() != "false")
            {
                wifiname   = getWiFiName();
                sigquality = getWiFiSignalQuality();
               // label = wifidBmGuage.GaugeLabels.FindByName("axisValue");
                datavalue = getWiFiDbm();
                //Important
               // wifidBmGuage.Value = Convert.ToInt32(getWiFiDbm());
            }
            //else
            //{
            //    connectedPannel.Visible = false;
            //    notConnectedPannel.Visible = true;
            //}

            //Need to stop timer,while leaving from page
            //dbmTimmer.Stop();
            chromiumBrowser.ExecuteScript("javascript:updateGauges(" + datavalue + ");");
            chromiumBrowser.ExecuteScript("javascript:updateLables();");
        }

        #region GetWiFiDbm
        /// <summary>
        /// Getting Wifi Dbm Details        
        /// </summary>
        /// <returns>Wifi Dbm Value</returns>
        private string getWiFiDbm()
        {
            string returnValue = "false";
            try
            {
                string wifidetails = string.Empty;
                foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
                {
                    NativeWifi.Wlan.WlanBssEntry[] wlanBssEntries = wlanIface.GetNetworkBssList();
                    foreach (NativeWifi.Wlan.WlanBssEntry network in wlanBssEntries)
                    {
                        if (chkConnected(client, GetStringForSSID(network.dot11Ssid)))
                        {
                            returnValue = network.rssi.ToString();
                            break;
                        }
                    }
                }
            }
            catch (Exception) { returnValue = "false"; }
            return returnValue;
        }
        #endregion
        #region ChkWifiConnected
        /// <summary>
        /// Check Network Connected
        /// </summary>
        /// <param name="client">Native Wifi Client object</param>
        /// <param name="connectionName">Wifi Connection Name</param>
        /// <returns>True/False Bool Value</returns>
        private bool chkConnected(NativeWifi.WlanClient client, string connectionName)
        {
            bool connectDisConnect = false;
            foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
            {
                NativeWifi.Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                foreach (NativeWifi.Wlan.WlanAvailableNetwork network in networks)
                {
                    if (connectionName == GetStringForSSID(network.dot11Ssid))
                    {
                        connectDisConnect = (network.flags.ToString().Contains("Connected")) ? true : false;
                        break;
                    }
                }
            }
            return connectDisConnect;
        }
        #endregion

        #region GetStringForSSID
        /// <summary>
        /// Converting Byte value to ASCII for Wifi Name
        /// </summary>
        /// <param name="ssid">SSID</param>
        /// <returns>Wifi Name as String</returns>
        private string GetStringForSSID(NativeWifi.Wlan.Dot11Ssid ssid)
        {
            return Encoding.ASCII.GetString(ssid.SSID, 0, (int)ssid.SSIDLength);
        }
        #endregion
    }

}

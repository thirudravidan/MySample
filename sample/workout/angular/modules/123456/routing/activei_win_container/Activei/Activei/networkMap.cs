using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using Newtonsoft.Json;
using Network_Mapping;
using System.Windows.Forms;
using Activei.Tracker;
namespace Activei
{
    public partial class MainWindow
    {
       public string loaddevices(){
           string connectedDevicestring = "";
           try
           {
               NetworkInfo connectedDevices = new NetworkInfo();
               NetworkMap connectedDev = new NetworkMap();
               connectedDevices = connectedDev.getNetworkMappingInfo();
               connectedDevicestring = JsonConvert.SerializeObject(connectedDevices);
           }
           catch (Exception ex)
           {
               ErrorTracker.WriteErrorLog("networkmap.cs", "loaddevices", "", ex.Message, ex.StackTrace, "ERROR");
           }
           return connectedDevicestring;
       }

       public string getMyMachineInfo() {
           string myInfo = "";
           try
           {
               NetworkMap connectedDev = new NetworkMap();
               LAN mymachine = new LAN();
              mymachine = connectedDev.getMyMachineInfo();
               myInfo = JsonConvert.SerializeObject(mymachine);
           }
           catch (Exception ex)
           {
               ErrorTracker.WriteErrorLog("networkmap.cs", "getMyMachineInfo", "", ex.Message, ex.StackTrace, "ERROR");
           }
           return myInfo;
       }
    }
}

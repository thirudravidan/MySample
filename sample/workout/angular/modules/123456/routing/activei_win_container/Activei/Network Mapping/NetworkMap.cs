using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections;
using System.Security;
using System.Net;
using System.Net.NetworkInformation;
using System.DirectoryServices;
using System.Management;
using System.IO.Ports;

namespace Network_Mapping
{
    public class NetworkMap
    {
        public NetworkInfo getNetworkMappingInfo()
        {
            IPAddress routerIP = GetRouterIP();
            NetworkInfo objNetworkInfo = new NetworkInfo();
            //var localmachine = NetworkBrowser.getMachineInfo();
            //objNetworkInfo.HostName = localmachine.HostName;
            //objNetworkInfo.IPAddress = localmachine.IPAddress;
            //objNetworkInfo.MACAddress = localmachine.MACAddress;
            //objNetworkInfo.MachineName = localmachine.MachineName;
            //objNetworkInfo.AddressFamily = localmachine.AddressFamily;
            objNetworkInfo.IPAddress = routerIP.ToString();
            objNetworkInfo.MACAddress = NetworkBrowser.GetMacAddress((IPAddress)routerIP).ToString();
            objNetworkInfo.Status = "Online";
            objNetworkInfo.DeviceList = getNetworkMapping();
            return objNetworkInfo;
        }

        public NetworkObject getNetworkMapping()
        {
            NetworkObject objNetworkObject = new NetworkObject();
            objNetworkObject.Genie = NetworkBrowser.getMachineInfo();
            objNetworkObject.LANList = new List<LAN>();
            objNetworkObject.LANList = getLAN();
            objNetworkObject.USBList = new List<USB>();
            objNetworkObject.USBList = getUSB();
            objNetworkObject.ParallelPortList = new List<ParallelPorts>();
            objNetworkObject.ParallelPortList = GetParallelPort();
            objNetworkObject.SerialPortList = new List<SerialPorts>();
            objNetworkObject.SerialPortList = GetSerialPort();
            objNetworkObject.PrinterList = new List<Printer>();
            objNetworkObject.PrinterList = GetPrinters();
            objNetworkObject.NetworkAdapterList = GetNetAdapters();

            return objNetworkObject;
        }


        /// <summary>
        /// Functionality get the router Ip address
        /// </summary>
        /// <returns></returns>
        public IPAddress GetRouterIP()
        {
            IPAddress ip = null;
            try
            {
                foreach (NetworkInterface f in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (f.OperationalStatus == OperationalStatus.Up)
                    {
                        foreach (GatewayIPAddressInformation d in f.GetIPProperties().GatewayAddresses)
                        {
                            ip = d.Address;
                        }
                    }
                }

                return ip;
            }
            catch (Exception ex)
            {
                return ip;
            }
        }

        public List<LAN> getLAN()
        {
            List<LAN> objLAN = new List<LAN>();
            objLAN = NetworkBrowser.getLAN();
            return objLAN;
        }

        public List<USB> getUSB()
        {
            List<USB> usblist = new List<USB>();

            ManagementClass USBClass = new ManagementClass("Win32_USBDevice");
            ManagementObjectCollection USBCollection = USBClass.GetInstances();

            foreach (ManagementObject usb in USBCollection)
            {
                string deviceId = usb["deviceid"].ToString();

                int vidIndex = deviceId.IndexOf("VID_");
                string startingAtVid = deviceId.Substring(vidIndex + 4); // + 4 to remove "VID_"                    
                string vid = startingAtVid.Substring(0, 4); // vid is four characters long

                int pidIndex = deviceId.IndexOf("PID_");
                string startingAtPid = deviceId.Substring(pidIndex + 4); // + 4 to remove "PID_"                    
                string pid = startingAtPid.Substring(0, 4); // pid is four characters long
                if (vidIndex != -1 && pidIndex != -1 && checkDuplicate(vid, pid, usblist))
                {
                    USB objusb = new USB();
                    objusb.DeviceId = deviceId;
                    objusb.VendorId = vid;
                    objusb.ProductID = pid;
                    objusb.Status = usb["Status"].ToString();
                    objusb.DeviceList = getUSBDevice(vid, pid);

                    usblist.Add(objusb);
                }
            }
            return usblist;
        }

        public bool checkDuplicate(string VendorId, string ProductID, List<USB> usblist) { bool status = true; foreach (USB usb in usblist) { if (usb.VendorId == VendorId && usb.ProductID == ProductID) { status = false; break; } } return status; }

        public List<SerialPorts> GetSerialPort()
        {
            List<SerialPorts> objSerialPortList = new List<SerialPorts>();

            //ManagementObjectCollection ManObjReturn;
            //ManagementObjectSearcher ManObjSearch;
            //ManObjSearch = new ManagementObjectSearcher("Select * from Win32_SerialPort");
            //ManObjReturn = ManObjSearch.Get();

            //foreach (ManagementObject ManObj in ManObjReturn)
            //{
            //    string comPort = ManObj["DeviceID"].ToString();
            //    SerialPort serialPort = new SerialPort(comPort, 9600, Parity.None, 8, StopBits.One);
            //    serialPort.NewLine = ">";
            //    serialPort.ReadTimeout = 1000;
            //    serialPort.RtsEnable = true;
            //    serialPort.DtrEnable = true;
            //    serialPort.Open();
            //    var str = serialPort.ReadExisting();

            //    //Console.WriteLine(ManObj["DeviceID"].ToString());
            //    //Console.WriteLine(ManObj["PNPDeviceID"].ToString());
            //    //Console.WriteLine(ManObj["Name"].ToString());
            //    //Console.WriteLine(ManObj["Caption"].ToString());
            //    //Console.WriteLine(ManObj["Description"].ToString());
            //    //Console.WriteLine(ManObj["ProviderType"].ToString());
            //    //Console.WriteLine(ManObj["Status"].ToString());
            //}

            return objSerialPortList;
        }

        public List<ParallelPorts> GetParallelPort()
        {
            List<ParallelPorts> objParallelPortList = new List<ParallelPorts>();

            //ManagementObjectCollection ManObjReturn;
            //ManagementObjectSearcher ManObjSearch;
            //ManObjSearch = new ManagementObjectSearcher("Select * from Win32_ParallelPort");
            //ManObjReturn = ManObjSearch.Get();

            //foreach (ManagementObject ManObj in ManObjReturn)
            //{
            //    //Console.WriteLine(ManObj["DeviceID"].ToString());
            //    //Console.WriteLine(ManObj["PNPDeviceID"].ToString());
            //    //Console.WriteLine(ManObj["Name"].ToString());
            //    //Console.WriteLine(ManObj["Caption"].ToString());
            //    //Console.WriteLine(ManObj["Description"].ToString());
            //    //Console.WriteLine(ManObj["ProviderType"].ToString());
            //    //Console.WriteLine(ManObj["Status"].ToString());
            //}

            return objParallelPortList;
        }

        public List<DeviceProperties> getUSBDevice(string VID, string PID)
        {
            List<DeviceProperties> objUSBDevice = new List<DeviceProperties>();

            Nullable<UInt32> MI = 0;

            if ("" != String.Empty)
            {
                MI = uint.Parse("", System.Globalization.NumberStyles.AllowHexSpecifier);
            }
            else
            {
                MI = null;
            }

            List<USBClass.DeviceProperties> ListOfUSBDeviceProperties = new List<USBClass.DeviceProperties>();
            if (USBClass.GetUSBDevice(uint.Parse(VID, System.Globalization.NumberStyles.AllowHexSpecifier), uint.Parse(PID, System.Globalization.NumberStyles.AllowHexSpecifier), ref ListOfUSBDeviceProperties, true, MI))
            {
                for (int i = 0; i < ListOfUSBDeviceProperties.Count; i++)
                {
                    DeviceProperties device = new DeviceProperties();

                    device.COMPort = ListOfUSBDeviceProperties[i].COMPort;
                    device.DeviceClass = ListOfUSBDeviceProperties[i].DeviceClass;
                    device.DeviceDescription = ListOfUSBDeviceProperties[i].DeviceDescription;
                    device.DeviceLocation = ListOfUSBDeviceProperties[i].DeviceLocation;
                    device.DeviceManufacturer = ListOfUSBDeviceProperties[i].DeviceManufacturer;
                    device.DevicePath = ListOfUSBDeviceProperties[i].DevicePath;
                    device.DevicePhysicalObjectName = ListOfUSBDeviceProperties[i].DevicePhysicalObjectName;
                    device.DeviceType = ListOfUSBDeviceProperties[i].DeviceType;
                    device.FriendlyName = ListOfUSBDeviceProperties[i].FriendlyName;
                    objUSBDevice.Add(device);
                }
            }

            return objUSBDevice;
        }

        public LAN getMyMachineInfo()
        {
            return NetworkBrowser.getMachineInfo();
        }

        public static List<Printer> GetPrinters()
        {
            List<Printer> objlist = new List<Printer>();

            var printerQuery = new ManagementObjectSearcher("SELECT * from Win32_Printer");

            string[] PrinterStatuses = { "Other", "Unknown", "Idle", "Printing", "WarmUp", "Stopped Printing", "Offline" };
            string[] PrinterStates = { "Paused", "Error", "Pending Deletion", "Paper Jam", "Paper Out", "Manual Feed", "Paper Problem", "Offline", "IO Active", "Busy", 
                                         "Printing", "Output Bin Full", "Not Available", "Waiting", "Processing", "Initialization", "Warming Up", "Toner Low", "No Toner",
                                         "Page Punt", "User Intervention Required", "Out of Memory", "Door Open", "Server_Unknown", "Power Save" };

            foreach (var printer in printerQuery.Get())
            {
                var name = printer.GetPropertyValue("Name");
                var status = printer.GetPropertyValue("Status");
                var isDefault = printer.GetPropertyValue("Default");
                var isNetworkPrinter = printer.GetPropertyValue("Network");
                var serverName = printer.GetPropertyValue("ServerName"); ;
                UInt16 printerstatus = (UInt16)printer.GetPropertyValue("PrinterStatus");
                var PrinterStatus = PrinterStatuses[printerstatus - 1];
                UInt16 printerstate = Convert.ToUInt16(printer.GetPropertyValue("PrinterState"));
                var PrinterState = PrinterStates[printerstatus - 1];

                UInt16 Extprinterstatus = Convert.ToUInt16(printer["ExtendedPrinterStatus"]);
                var extPrinterStatus = PrinterStatuses[Extprinterstatus - 1];
                //UInt16 connstate = (UInt16)printer.AddPrinterConnection(name);
                var ipaddr = "-";
                string portName = printer["PortName"].ToString();
                if (portName.StartsWith("IP_"))
                {
                    ipaddr = portName.Substring(3);
                }

                Printer print = new Printer();
                print.Name = Convert.ToString(name);
                print.IsDefault = Convert.ToString(isDefault);
                print.isNetworkPrinter = Convert.ToString(isNetworkPrinter);
                print.IPAddress = ipaddr;
                print.DeviceID = Convert.ToString(printer["DeviceId"]);
                print.FriendlyName = string.Empty;
                print.Status = "Ok";

                objlist.Add(print);
            }

            return objlist;
        }

        public static List<NetworkAdapter> GetNetAdapters()
        {
            List<NetworkAdapter> objNetworkAdapterlist = new List<NetworkAdapter>();

            string value = string.Empty;
            foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
            {
                NetworkAdapter objNetworkAdapter = new NetworkAdapter();

                objNetworkAdapter.Id = nic.Id;
                objNetworkAdapter.Name = nic.Name;
                objNetworkAdapter.NetworkInterfaceType = Convert.ToString(nic.NetworkInterfaceType);
                objNetworkAdapter.OperationalStatus = Convert.ToString(nic.OperationalStatus);
                objNetworkAdapter.Speed = Convert.ToString(nic.Speed);
                objNetworkAdapter.SupportsMultiCast = Convert.ToString(nic.SupportsMulticast);
                objNetworkAdapter.Description = nic.Description;
                objNetworkAdapter.FriendlyName = string.Empty;
                objNetworkAdapterlist.Add(objNetworkAdapter);
            }

            return objNetworkAdapterlist;
        }
    }
}

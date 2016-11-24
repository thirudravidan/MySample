using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Network_Mapping
{
    public class NetworkInfo
    {
        //public string MachineName { get; set; }
        public string IPAddress { get; set; }
        public string MACAddress { get; set; }
        //public string HostName { get; set; }
        public string Status { get; set; }
        //public string AddressFamily { get; set; }
        public NetworkObject DeviceList { get; set; }
    }

    public class NetworkObject
    {
        public LAN Genie { get; set; }
        public List<LAN> LANList { get; set; }
        public List<USB> USBList { get; set; }
        public List<SerialPorts> SerialPortList { get; set; }
        public List<ParallelPorts> ParallelPortList { get; set; }
        public List<Printer> PrinterList { get; set; }
        public List<NetworkAdapter> NetworkAdapterList { get; set; }
    }

    public class LAN
    {
        public string MachineName { get; set; }
        public string IPAddress { get; set; }
        public string MACAddress { get; set; }
        public string HostName { get; set; }
        public string Status { get; set; }
        public string AddressFamily { get; set; }
        public string FriendlyName { get; set; }
    }

    public class USB
    {
        public string DeviceName { get; set; }
        public string DeviceId { get; set; }
        public string VendorId { get; set; }
        public string ProductID { get; set; }
        //public string IPAddress { get; set; }
        //public string MACAddress { get; set; }
        public string Status { get; set; }

        public List<DeviceProperties> DeviceList { get; set; }
    }

    public class DeviceProperties
    {
        public string FriendlyName;
        public string DeviceDescription;
        public string DeviceType;
        public string DeviceManufacturer;
        public string DeviceClass;
        public string DeviceLocation;
        public string DevicePath;
        public string DevicePhysicalObjectName;
        public string COMPort;
    }

    public class SerialPorts
    {
        public string DeviceName { get; set; }
        public string DeviceId { get; set; }
        public string VendorId { get; set; }
        public string ProductID { get; set; }
        public string Status { get; set; }
        public string FriendlyName { get; set; }

    }

    public class ParallelPorts
    {
        public string DeviceName { get; set; }
        public string DeviceId { get; set; }
        public string VendorId { get; set; }
        public string ProductID { get; set; }
        public string Status { get; set; }
        public string FriendlyName { get; set; }
    }

    public class Printer
    {
        public string Name { get; set; }
        public string DeviceID { get; set; }
        public string IsDefault { get; set; }
        public string isNetworkPrinter { get; set; }
        public string IPAddress { get; set; }
        public string Status { get; set; }
        public string FriendlyName { get; set; }
    }

    public class NetworkAdapter
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string NetworkInterfaceType { get; set; }
        public string Description { get; set; }
        public string OperationalStatus { get; set; }
        public string Speed { get; set; }
        public string SupportsMultiCast { get; set; }
        public string FriendlyName { get; set; }
    }
}

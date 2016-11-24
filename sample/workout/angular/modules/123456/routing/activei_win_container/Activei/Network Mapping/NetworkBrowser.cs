using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security;
using System.Runtime.InteropServices;
using System.Collections;
using System.Net;
using System.Net.NetworkInformation;
using System.Management;

namespace Network_Mapping
{
    #region Network Machine
    class NetworkBrowser
    {
        #region Dll Imports

        //declare the Netapi32 : NetServerEnum method import
        [DllImport("Netapi32", CharSet = CharSet.Auto,
        SetLastError = true),
        SuppressUnmanagedCodeSecurityAttribute]

        /// <summary>
        /// Netapi32.dll : The NetServerEnum function lists all servers
        /// of the specified type that are
        /// visible in a domain. For example, an 
        /// application can call NetServerEnum
        /// to list all domain controllers only
        /// or all SQL servers only.
        /// You can combine bit masks to list
        /// several types. For example, a value 
        /// of 0x00000003  combines the bit
        /// masks for SV_TYPE_WORKSTATION 
        /// (0x00000001) and SV_TYPE_SERVER (0x00000002)
        /// </summary>
        public static extern int NetServerEnum(
            string ServerNane, // must be null
            int dwLevel,
            ref IntPtr pBuf,
            int dwPrefMaxLen,
            out int dwEntriesRead,
            out int dwTotalEntries,
            int dwServerType,
            string domain, // null for login domain
            out int dwResumeHandle
            );

        //declare the Netapi32 : NetApiBufferFree method import
        [DllImport("Netapi32", SetLastError = true),
        SuppressUnmanagedCodeSecurityAttribute]

        /// <summary>
        /// Netapi32.dll : The NetApiBufferFree function frees 
        /// the memory that the NetApiBufferAllocate function allocates. 
        /// Call NetApiBufferFree to free
        /// the memory that other network 
        /// management functions return.
        /// </summary>
        public static extern int NetApiBufferFree(IntPtr pBuf);

        //create a _SERVER_INFO_100 STRUCTURE
        [StructLayout(LayoutKind.Sequential)]
        public struct _SERVER_INFO_100
        {
            internal int sv100_platform_id;
            [MarshalAs(UnmanagedType.LPWStr)]
            internal string sv100_name;
        }
        #endregion
        #region Public Constructor
        /// <SUMMARY>
        /// Constructor, simply creates a new NetworkBrowser object
        /// </SUMMARY>
        public NetworkBrowser()
        {

        }
        #endregion
        #region Public Methods
        /// <summary>
        /// Uses the DllImport : NetServerEnum
        /// with all its required parameters
        /// retrieve a list of domain SV_TYPE_WORKSTATION
        /// and SV_TYPE_SERVER PC's
        /// </summary>
        /// <returns>Arraylist that represents
        /// all the SV_TYPE_WORKSTATION and SV_TYPE_SERVER
        /// PC's in the Domain</returns>
        public ArrayList getNetworkComputers()
        {
            //local fields
            ArrayList networkComputers = new ArrayList();
            const int MAX_PREFERRED_LENGTH = -1;
            int SV_TYPE_WORKSTATION = 1;
            int SV_TYPE_SERVER = 2;
            IntPtr buffer = IntPtr.Zero;
            IntPtr tmpBuffer = IntPtr.Zero;
            int entriesRead = 0;
            int totalEntries = 0;
            int resHandle = 0;
            int sizeofINFO = Marshal.SizeOf(typeof(_SERVER_INFO_100));


            try
            {
                int ret = NetServerEnum(null, 100, ref buffer,
                    MAX_PREFERRED_LENGTH,
                    out entriesRead,
                    out totalEntries, SV_TYPE_WORKSTATION |
                    SV_TYPE_SERVER, null, out 
                    resHandle);
                //if the returned with a NERR_Success 
                //(C++ term), =0 for C#
                if (ret == 0)
                {
                    //loop through all SV_TYPE_WORKSTATION 
                    //and SV_TYPE_SERVER PC's
                    for (int i = 0; i < totalEntries; i++)
                    {
                        //get pointer to, Pointer to the 
                        //buffer that received the data from
                        //the call to NetServerEnum. 
                        //Must ensure to use correct size of 
                        //STRUCTURE to ensure correct 
                        //location in memory is pointed to
                        tmpBuffer = new IntPtr((int)buffer +
                                   (i * sizeofINFO));
                        //Have now got a pointer to the list 
                        //of SV_TYPE_WORKSTATION and 
                        //SV_TYPE_SERVER PC's, which is unmanaged memory
                        //Needs to Marshal data from an 
                        //unmanaged block of memory to a 
                        //managed object, again using 
                        //STRUCTURE to ensure the correct data
                        //is marshalled 
                        _SERVER_INFO_100 svrInfo = (_SERVER_INFO_100)
                            Marshal.PtrToStructure(tmpBuffer,
                                    typeof(_SERVER_INFO_100));

                        //add the PC names to the ArrayList
                        networkComputers.Add(svrInfo.sv100_name);
                    }
                }
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Problem with acessing " +
                //    "network computers in NetworkBrowser " +
                //    "\r\n\r\n\r\n" + ex.Message,
                //    "Error", MessageBoxButtons.OK,
                //    MessageBoxIcon.Error);
                return null;
            }
            finally
            {
                //The NetApiBufferFree function frees 
                //the memory that the 
                //NetApiBufferAllocate function allocates
                NetApiBufferFree(buffer);
            }
            //return entries found
            return networkComputers;

        }

        public static List<LAN> getLAN()
        {
            //local fields
            List<LAN> networkComputers = new List<LAN>();
            const int MAX_PREFERRED_LENGTH = -1;
            int SV_TYPE_WORKSTATION = 1;
            int SV_TYPE_SERVER = 2;
            IntPtr buffer = IntPtr.Zero;
            IntPtr tmpBuffer = IntPtr.Zero;
            int entriesRead = 0;
            int totalEntries = 0;
            int resHandle = 0;
            int sizeofINFO = Marshal.SizeOf(typeof(_SERVER_INFO_100));

            try
            {
                int ret = NetServerEnum(null, 100, ref buffer, MAX_PREFERRED_LENGTH, out entriesRead, out totalEntries, SV_TYPE_WORKSTATION | SV_TYPE_SERVER, null, out resHandle);
                if (ret == 0)
                {
                    for (int i = 0; i < totalEntries; i++)
                    {
                        tmpBuffer = new IntPtr((int)buffer + (i * sizeofINFO));

                        _SERVER_INFO_100 svrInfo = (_SERVER_INFO_100)Marshal.PtrToStructure(tmpBuffer, typeof(_SERVER_INFO_100));

                        //add the PC names to the ArrayList
                        
                        LAN lan = new LAN();
                        IPHostEntry iphostentry = Dns.GetHostByName(svrInfo.sv100_name);

                        


                        lan.HostName = iphostentry.HostName;
                        lan.MachineName = svrInfo.sv100_name;

                        foreach (IPAddress ipaddress in iphostentry.AddressList)
                        {

                            ////
                            //string strRoot = @"\\\\" + Convert.ToString(ipaddress) + "\\root\\cimv2";

                            //ManagementScope scope = new ManagementScope(strRoot);
                            //scope.Connect();

                            //// Use this code if you are connecting with a 
                            //// different user name and password:
                            ////
                            //// ManagementScope scope = 
                            ////    new ManagementScope(
                            ////        "\\\\FullComputerName\\root\\cimv2", options);
                            //// scope.Connect();

                            ////Query system for Operating System information
                            //ObjectQuery query = new ObjectQuery(
                            //    "SELECT * FROM Win32_OperatingSystem");
                            //ManagementObjectSearcher searcher =
                            //    new ManagementObjectSearcher(scope, query);

                            //ManagementObjectCollection queryCollection = searcher.Get();
                            //foreach (ManagementObject m in queryCollection)
                            //{
                            //    // Display the remote computer information
                            //    //Console.WriteLine("Computer Name : {0}", 
                            //    //    m["csname"]);
                            //    //Console.WriteLine("Windows Directory : {0}", 
                            //    //    m["WindowsDirectory"]);
                            //    //Console.WriteLine("Operating System: {0}",  
                            //    //    m["Caption"]);
                            //    //Console.WriteLine("Version: {0}", m["Version"]);
                            //    //Console.WriteLine("Manufacturer : {0}", 
                            //    //    m["Manufacturer"]);
                            //}
                            
                            lan.IPAddress = Convert.ToString(ipaddress);
                            lan.MACAddress = Convert.ToString(GetMacAddress(ipaddress));
                            lan.AddressFamily = Convert.ToString(ipaddress.AddressFamily);

                        }
                        lan.FriendlyName = string.Empty;
                        lan.Status = "Active";
                        if (getMachineInfo().IPAddress != lan.IPAddress && lan.MACAddress != "000000000000")
                        {
                            networkComputers.Add(lan);    
                        }
                        
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                NetApiBufferFree(buffer);
            }
            //return entries found
            return networkComputers;

        }

        [System.Runtime.InteropServices.DllImport("iphlpapi.dll", ExactSpelling = true)]
        static extern int SendARP(int DestIP, int SrcIP, byte[] pMacAddr, ref int PhyAddrLen);

        public static PhysicalAddress GetMacAddress(IPAddress ipAddress)
        {
            const int MacAddressLength = 6;
            int length = MacAddressLength;
            var macBytes = new byte[MacAddressLength];
            SendARP(BitConverter.ToInt32(ipAddress.GetAddressBytes(), 0), 0, macBytes, ref length);
            return new PhysicalAddress(macBytes);
        }

        public static LAN getMachineInfo()
        {
            LAN objlan = new LAN();

            IPHostEntry iphostentry = Dns.GetHostByName(Dns.GetHostName());

            objlan.HostName = iphostentry.HostName;
            objlan.MachineName = Dns.GetHostName();

            foreach (IPAddress ipaddress in iphostentry.AddressList)
            {
                objlan.IPAddress = Convert.ToString(ipaddress);
                objlan.MACAddress = Convert.ToString(GetMacAddress(ipaddress));
                objlan.AddressFamily = Convert.ToString(ipaddress.AddressFamily);
            }

            objlan.Status = "Active";

            return objlan;
        }
        #endregion
    }
    #endregion
}

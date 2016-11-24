using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Security.AccessControl;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;
using Microsoft.Win32;
using System.Net.NetworkInformation;
using System.Configuration;
using System.Security.Permissions;
using System.Net;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Reflection;
using Echevil;
using System.Threading.Tasks;
using System.ComponentModel.Design;
using networkmonitor;

namespace Activei
{
    public partial class MainWindow
    {
            static string logmessage = string.Empty;
            static long bytesReceivedPrev = 0;

            private static CsvRow CheckBandwidthUsage(DateTime now)
            {
                CsvRow row = new CsvRow();
                try
                {
                    NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
                    long bytesReceived = 0;
                    foreach (NetworkInterface inf in interfaces)
                    {
                        if (inf.OperationalStatus == OperationalStatus.Up &&
                            inf.NetworkInterfaceType != NetworkInterfaceType.Loopback &&
                            inf.NetworkInterfaceType != NetworkInterfaceType.Tunnel &&
                            inf.NetworkInterfaceType != NetworkInterfaceType.Unknown && !inf.IsReceiveOnly)
                        {
                            bytesReceived += inf.GetIPv4Statistics().BytesReceived;
                            if (row.Count == 0)
                            {
                                PhysicalAddress address = inf.GetPhysicalAddress();
                                byte[] macAddr = address.GetAddressBytes();
                                string tMac = "";
                                foreach (byte part in address.GetAddressBytes())
                                {
                                    tMac += (tMac.Length > 0 ? "-" : "") + (part < 16 ? "0" : "") + part.ToString("X", CultureInfo.InvariantCulture);
                                }
                                row.Add(inf.Description);
                                row.Add(tMac);
                            }
                        }
                    }
                    if (bytesReceivedPrev == 0)
                    {
                        bytesReceivedPrev = bytesReceived;
                    }
                    long bytesUsed = bytesReceived - bytesReceivedPrev;
                    double kBytesUsed = bytesUsed / 1024;
                    double mBytesUsed = kBytesUsed / 1024;
                    bytesReceivedPrev = bytesReceived;
                    row.Add(mBytesUsed.ToString());
                    row.Add(now.ToString());
                    row = (mBytesUsed.ToString() == "0") ? null : row;

                }
                catch (Exception Ex)
                {
                    WriteLog("Log Path :: " + Ex);
                }
                return row;
            }
            public static void WriteLog(string message)
            {
                try
                {
                    string fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                    fileName = fileName + "\\BandwidthMonitorLog";
                    Directory.CreateDirectory(fileName);
                    string logpath = fileName + (@"\ErrorLog_" + System.DateTime.Now.ToString("dd_MM_yyyy") + ".csv");
                    StreamWriter mFWriter = default(StreamWriter);
                    logmessage = message;
                    mFWriter = (File.Exists(logpath)) ? File.AppendText(logpath) : File.CreateText(logpath);
                    mFWriter.WriteLine(logmessage, FileShare.ReadWrite);
                    mFWriter.Flush();
                    mFWriter.Close();
                }
                catch (Exception)
                {

                }

            }
        
    }
}

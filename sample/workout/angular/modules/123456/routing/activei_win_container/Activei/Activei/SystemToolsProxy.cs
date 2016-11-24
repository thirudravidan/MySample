using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Runtime.InteropServices;
using Microsoft.Win32;
//using IWshRuntimeLibrary;

namespace Activei
{
    public class SystemToolsProxy
    {
        public enum MessageType
        {
            Error,
            Warning,
            Asterisk,
            Question,
            Information,
            None
        }

        const long GBDENOMINATOR = 1073741824;
        public const string CLEANUPMANAGER = "cleanmgr.exe";
        public const string DEFRAG = "defrag.exe";
        public const string DEFRAGMENTATION = "Defragmentation";
        public const string DISKCLEANUP = "Disk Cleanup";

        public static List<string> GetSystemDrives()
        {
            List<string> drives = new List<string>();
            try
            {

                DriveInfo[] driveInfo = DriveInfo.GetDrives();
                foreach (DriveInfo info in driveInfo)
                {
                    try
                    {
                        //Get only the fixed drives... We cannot do system maintenance on network drives..
                        if (info.DriveType == DriveType.Fixed && Directory.Exists(info.Name)) drives.Add(info.Name);
                    }
                    catch (Exception)
                    {
                        ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs :: GetSystemDrives() : " + ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs :: GetSystemDrives() : " + ex.Message);
                //ErrorTracker.WriteErrorLog("SystemToolsProxy.cs", "GetSystemDrives()", "", ex.Message, ex.StackTrace, "Error");
            }
            return drives;
        }

        public static string GetSystemDriveFreeSpace(string driveName)
        {
            string strSize = string.Empty;
            try
            {
                if (Directory.Exists(driveName))
                {
                    DriveInfo _driveInfo = new DriveInfo(driveName);
                    double size = (double)_driveInfo.TotalFreeSpace / GBDENOMINATOR;
                    strSize = size.ToString();
                    strSize = strSize.Substring(0, strSize.IndexOf(".") + 3);
                    return strSize;
                }
                throw new Exception(driveName + " Drive could not be found or it is not formatted");
            }
            catch (Exception ex)
            {
                ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs :: GetSystemDriveFreeSpace() : " + ex.Message);
                //ErrorTracker.WriteErrorLog("SystemToolsProxy.cs", "GetSystemDriveFreeSpace()", "", ex.Message, ex.StackTrace, "Error");
            }
            return strSize;
        }

        public static string GetSystemDriveSpace(string driveName)
        {
            string strSize = string.Empty;
            try
            {
                if (Directory.Exists(driveName))
                {
                    DriveInfo _driveInfo = new DriveInfo(driveName);
                    double size = (double)_driveInfo.TotalSize / GBDENOMINATOR;
                    strSize = size.ToString();
                    strSize = strSize.Substring(0, strSize.IndexOf(".") + 3);
                    return strSize;
                }
                throw new Exception(driveName + " Drive could not be found or it is not formatted");
            }
            catch (Exception ex)
            {
                ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs :: GetSystemDriveSpace() : " + ex.Message);
                //ErrorTracker.WriteErrorLog("SystemToolsProxy.cs", "GetSystemDriveSpace()", "", ex.Message, ex.StackTrace, "Error");
            }
            return strSize;
        }

        #region InternetConnectivityCheck

        [DllImport("wininet.dll")]
        private extern static bool InternetGetConnectedState(out int Description, int ReservedValue);

        public static bool IsConnectedToInternet()
        {
            bool isConnected = true;
            try
            {
                int description;
                isConnected = InternetGetConnectedState(out description, 0);
            }
            catch (Exception ex)
            {
                ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs : IsConnectedToInternet() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("SystemToolsProxy.cs", "IsConnectedToInternet()", "", ex.Message, ex.StackTrace, "Error");
            }
            return isConnected;
        }
        #endregion

        /// <summary>
        /// To get the default browser
        /// </summary>
        /// <returns></returns>
        public static string GetDefaultBrowser()
        {
            string browser = string.Empty;

            try
            {
                RegistryKey key = null; try
                {
                    key = Registry.ClassesRoot.OpenSubKey(@"HTTP\shell\open\command", false);
                    //trim off quotes 
                    string val = key.GetValue(null).ToString().ToLower();
                    browser = val.Contains("\"") ? val.Replace("\"", "") : val;
                    if (!browser.EndsWith("exe"))
                    {
                        //get rid of everything after the ".exe" 
                        browser = browser.Substring(0, browser.LastIndexOf(".exe") + 4);
                    }
                }
                finally
                {
                    if (key != null)
                        key.Close();
                }
            }
            catch (Exception)
            {
                ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs : GetDefaultBrowser() :: " + ex.Message);
            }

            return browser;

        }

        public static void CreateDirectories(string destinationPath)
        {
            try
            {
                if (String.IsNullOrEmpty(Path.GetExtension(destinationPath)))
                {
                    string[] splittedPath = destinationPath.Split(new char[] { '\\' });

                    string folder = string.Empty;
                    folder = splittedPath[0] + @"\";

                    for (int i = 1; i < splittedPath.Length; i++)
                    {
                        folder += splittedPath[i] + @"\";

                        if (!Directory.Exists(folder))
                            Directory.CreateDirectory(folder);
                    }
                }
            }
            catch (Exception ex)
            {
                ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs : CreateDirectories() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("SystemToolsProxy.cs", "CreateDirectories()", "", ex.Message, ex.StackTrace, "Error");
            }
        }
    }
}

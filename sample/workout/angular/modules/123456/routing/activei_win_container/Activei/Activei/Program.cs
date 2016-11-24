using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using System.Diagnostics;
using CustomizedClickOnce.Common;
using System.Reflection;
using System.Security.Principal;
using Microsoft.Win32;
using System.IO;
using System.Security.AccessControl;
using System.Configuration;
using System.Text;
using System.Deployment.Application;
using Activei.NetgearClientService;
using System.Net;
using System.Xml;
using Activei.Tracker;


namespace Activei
{
    static class Program
    {
        public static string strVersion = string.Empty;
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            //string resource1 = "MyApp.System.Windows.Forms.Ribbon35.dll";
            //string resource2 = "MyApp.System.Data.SQLite.dll";
            //EmbeddedAssembly.Load(resource1, "System.Windows.Forms.Ribbon35.dll");
            //EmbeddedAssembly.Load(resource2, "System.Data.SQLite.dll");

            
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            try
            {

                var clickOnceHelper = new ClickOnceHelper(Globals.PublisherName, Globals.ProductName);
                clickOnceHelper.UpdateUninstallParameters();
                clickOnceHelper.AddShortcutToStartup();
                UpdateDownloadCount();                
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }

            //To Run the application as administrator
            
            if (!IsRunAsAdministrator())
            {
                
                // It is not possible to launch a ClickOnce app as administrator directly, so instead we launch the
                // app as administrator in a new process.
                var processInfo = new ProcessStartInfo(Assembly.GetExecutingAssembly().CodeBase);

                // The following properties run the new process as administrator
                processInfo.UseShellExecute = true;
                processInfo.Verb = "runas";

                // Start the new process
                try
                {
                    Process.Start(processInfo);
                }
                catch (Exception)
                {
                    // The user did not allow the application to run as administrator
                    GearHeadMessageBox.Instance.Show("Sorry, this application must be run as Administrator.", ConfigSettings.ClientName, MessageBoxButtons.OK, MessageBoxIcon.Information);
                }

                // Shut down the current process
                Environment.Exit(0);
            }
            else
            {
                //Starting Up Bandwidth Monitor
                startMonitor();
                Application.Run(new MainWindow(strVersion));
            }

            //Application.Run(new MainWindow());
        }

        private static bool IsRunAsAdministrator()
        {
            var wi = WindowsIdentity.GetCurrent();
            var wp = new WindowsPrincipal(wi);

            return wp.IsInRole(WindowsBuiltInRole.Administrator);
        }

        private static void startMonitor()
        {
            try
            {
                var parent = Process.GetProcessesByName("BandwidthMonitor").Single();
                parent.Kill();
            }
            catch (Exception) { }

            //RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName("Activei");
            RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName(ConfigSettings.ClientName);
            if (UninstallRegistryKey != null)
            {
                try
                {
                    String uninstallPath = UninstallRegistryKey.GetValue("UninstallString").ToString();
                    String bandwidthMonitorPath = Path.Combine(uninstallPath.Replace("\"", "").Substring(0, uninstallPath.LastIndexOf("\\")), ConfigurationManager.AppSettings["BandwidthMonitor"]);
                    var processInfo = new ProcessStartInfo(bandwidthMonitorPath);
                    // The following properties run the new process as administrator
                    processInfo.UseShellExecute = false;
                    processInfo.CreateNoWindow = true;
                    Process.Start(processInfo);
                }
                catch (Exception ex) { throw ex; }
            }
        }
       

        private const string DisplayNameKey = "DisplayName";
        
        private static RegistryKey GetUninstallRegistryKeyByProductName(string productName)
        {
            var subKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Uninstall");
            if (subKey == null)
                return null;
            foreach (var name in subKey.GetSubKeyNames())
            {
                var application = subKey.OpenSubKey(name, RegistryKeyPermissionCheck.ReadWriteSubTree, RegistryRights.QueryValues | RegistryRights.ReadKey | RegistryRights.SetValue);
                if (application == null)
                    continue;
                foreach (var appKey in application.GetValueNames())
                {
                    if (appKey.Equals(DisplayNameKey))
                    {
                        if (application.GetValue(appKey).Equals(productName))
                            return application;
                        break;
                    }
                }
            }
            return null;
        }

       

        private static void UpdateDownloadCount()
        {
            NetgearClientServiceSoapClient ngToolTrackingService = null;
            //ErrorTracker errorTrace = new ErrorTracker();
            try
            {
                ngToolTrackingService = new NetgearClientServiceSoapClient();
                ErrorTracker.WriteLog("UpdateDownloadCount() method is invoked.....");

                String uniqueID = string.Empty;

                uniqueID = ClickOnceHelper.GetUserUniqueID();

                ErrorTracker.WriteLog("UpdateDownloadCount() :: uniqueID : " + uniqueID);

                if (string.IsNullOrEmpty(uniqueID))
                {
                    ErrorTracker.WriteLog("UpdateDownloadCount() :: uniqueID not exists.");
                    uniqueID = ngToolTrackingService.GetNetgearToolUniqueID();
                    ErrorTracker.WriteLog("UpdateDownloadCount() :: uniqueID generated : " + uniqueID);

                    UpdateUserUniqueID(uniqueID);
                }
                ApplicationDeployment deployment = ApplicationDeployment.CurrentDeployment;

                //UpdateCheckInfo info = null;
                //info = deployment.CheckForDetailedUpdate();
                //MessageBox.Show(info.UpdateAvailable.ToString());
                //if (info.UpdateAvailable)
                //{
                //    MessageBox.Show("Application Resatrted");
                //    MessageBox.Show("Application Resatrted");
                //    deployment.Update();
                //}
                //versioninfo = deployment.CurrentVersion.ToString();

                //MessageBox.Show(versioninfo);
                strVersion = deployment.CurrentVersion.ToString();
                Settings.Default.VersionInfo = deployment.CurrentVersion.ToString();
                Settings.Default.Save();

                //ngToolTrackingService.NetgearToolInstallationDetails("fa251d54-ab22-488a-ab2c-966a37458178", "jack.reacher3@gmail.com", "2.0.0.2", DateTime.Now);

                if (deployment.IsFirstRun)
                {
                    ErrorTracker.WriteLog("UpdateDownloadCount() :: Application is Running First Time : CurrentVersion :" + deployment.CurrentVersion.ToString());
                    ngToolTrackingService.NetgearToolInstallationDetails(uniqueID, String.Empty, deployment.CurrentVersion.ToString(), DateTime.Now);
                }
                else
                {
                    ErrorTracker.WriteLog("UpdateDownloadCount() :: Application having updates : CurrentVersion :" + deployment.CurrentVersion.ToString() + " UpdatedVersion : " + deployment.UpdatedVersion.ToString());
                    ngToolTrackingService.NetgearToolCurrentVersionDetails(uniqueID, String.Empty, deployment.CurrentVersion.ToString(), deployment.UpdatedVersion.ToString(), DateTime.Now);
                }

                //if (CheckForUpdateAvailable())
                //{
                //    MessageBox.Show("Update Available");
                //    String gearheadFolder = string.Empty;
                //    gearheadFolder = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                //    gearheadFolder = Path.Combine(gearheadFolder, ConfigSettings.ClientName);

                //    if (Directory.Exists(gearheadFolder))
                //    {
                //        Directory.Delete(gearheadFolder, true);
                //        Directory.CreateDirectory(gearheadFolder);
                //    }
                //    else
                //    {
                //        Directory.CreateDirectory(gearheadFolder);
                //    }
                //}

                
                ////ErrorTracker.WriteLog("UpdateDownloadCount() method is invocation was completed.....");
                //if (deployment.UpdatedVersion > deployment.CurrentVersion)
                //{
                //    //MessageBox.Show("Entered");
                //    String gearheadFolder = string.Empty;
                //    gearheadFolder = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                //    gearheadFolder = Path.Combine(gearheadFolder, ConfigSettings.ClientName);

                //    if (Directory.Exists(gearheadFolder))
                //    {
                //        Directory.Delete(gearheadFolder, true);
                //        Directory.CreateDirectory(gearheadFolder);
                //    }
                //    else
                //    {
                //        Directory.CreateDirectory(gearheadFolder);
                //    }
                //}

                ngToolTrackingService = null;
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("Activei :Program.cs", "UpdateDownloadCount()", "", ex.Message, ex.StackTrace, "Error");
            }
            finally
            {
                ngToolTrackingService = null;
                //errorTrace = null;
            }

        }

        private static void UpdateUserUniqueID(string uniqueID)
        {
            //ErrorTracker errorTrace = new ErrorTracker();
            try
            {
                string publisherFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), Globals.PublisherName);
                bool isDirExists = Directory.Exists(publisherFolder);
                string fileName = "usersettings.xml";
                string filePath = Path.Combine(publisherFolder, fileName);
                string encryptedUniqueID = Cryption.Encrypt(uniqueID, Cryption.SecurityKey);
                StringBuilder userdata = new StringBuilder();
                userdata.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
                userdata.Append("<configuration><usersettings><add key=\"NetgearToolUniqueID\" value=\"" + encryptedUniqueID + "\"/></usersettings></configuration>");

                File.WriteAllText(filePath, userdata.ToString(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                //ErrorTracker.WriteErrorLog("App.xaml.cs", "UpdateUserUniqueID()", "", ex.Message, ex.StackTrace, "Error");
            }
            finally
            {
                //errorTrace = null;
            }
        }

    }
}

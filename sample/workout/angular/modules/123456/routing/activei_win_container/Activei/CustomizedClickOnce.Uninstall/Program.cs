using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;
using CustomizedClickOnce.Common;
using CustomizedClickOnce.Uninstall.Properties;
using Microsoft.Win32;
using System.Security.AccessControl;
using System.ServiceProcess;
using System.Security.Principal;
using CustomizedClickOnce.Uninstall.NetgearClientService;

namespace CustomizedClickOnce.Uninstall
{
    static class Program
    {
        private static Mutex instanceMutex;
        private const string DisplayNameKey = "DisplayName";

        [STAThread]
        static void Main()
        {
            try
            {
                bool createdNew;
                instanceMutex = new Mutex(true, @"Local\" + Assembly.GetExecutingAssembly().GetType().GUID, out createdNew);
                if (!createdNew)
                {
                    instanceMutex = null;
                    return;
                }

                if (GearHeadMessageBox.Instance.Show(Resources.Uninstall_Question, Resources.Uninstall + Globals.ProductName,
                                        MessageBoxButtons.YesNo, MessageBoxIcon.Warning, GearHeadMessageBox.ModuleEnum.Uninstall) == DialogResult.Yes)
                {
                    UpdateUnistallStatus();
                    stopClamVirusService();
                    var clickOnceHelper = new ClickOnceHelper(Globals.PublisherName, Globals.ProductName);
                    clickOnceHelper.Uninstall();
                    //Delete all files from publisher folder and folder itself on uninstall
                    var publisherFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), Globals.PublisherName);
                    if (Directory.Exists(publisherFolder))
                        Directory.Delete(publisherFolder, true);
                    
                    if (Directory.Exists(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), Globals.ProductName)))
                    {
                        try
                        {
                            Directory.Delete(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), Globals.ProductName), true);
                        }
                        catch (Exception) { }
                    }

                    if (Directory.Exists(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "ErrorLog")))
                    {
                        try
                        {
                            Directory.Delete((Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "ErrorLog")), true);
                        }
                        catch (Exception) { }
                    }
                }

                ReleaseMutex();

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }
        }

        private static void ReleaseMutex()
        {
            if (instanceMutex == null)
                return;
            instanceMutex.ReleaseMutex();
            instanceMutex.Close();
            instanceMutex = null;
        }

        /// <summary>
        /// Functionality to delete the freshclam and clamD service
        /// </summary>
        private static void stopClamVirusService()
        {
            try
            {
                if (IsRunAsAdministrator())
                {
                    string DirpathRoot = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), Globals.ProductName);
                    //string DirpathRoot = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Active-I");
                    string UnInsBatPath = string.Empty;
                    RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName(Globals.ProductName);
                    if (UninstallRegistryKey != null)
                    {
                        string uninstallPath = UninstallRegistryKey.GetValue("UninstallString").ToString();
                        UnInsBatPath = Path.Combine(uninstallPath.Replace("\"", "").Substring(0, uninstallPath.LastIndexOf("\\")), ConfigurationManager.AppSettings["UnInstallBatPath"]);
                    }

                    //UnInsBatPath = @"D:\Git\activei_win_container\Activei\Activei\UnInstall.bat";
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();

                    try
                    {

                        if (Directory.Exists(DirpathRoot + "\\clamav\\"))
                        {
                            
                            foreach (Process getproc in Process.GetProcesses())
                            {
                                if (getproc.ProcessName == "clamd" || getproc.ProcessName == "freshclam")
                                {
                                    getproc.Kill();
                                }
                            }
                            // Create the ProcessInfo object

                            System.Diagnostics.ProcessStartInfo psi = new System.Diagnostics.ProcessStartInfo("cmd.exe");
                            psi.CreateNoWindow = true;
                            psi.UseShellExecute = false;
                            psi.RedirectStandardOutput = true;
                            psi.RedirectStandardInput = true;
                            psi.RedirectStandardError = true;
                            psi.WorkingDirectory = Environment.GetFolderPath(Environment.SpecialFolder.System);
                            // Start the process
                            System.Diagnostics.Process proc = System.Diagnostics.Process.Start(psi);
                            //UnInsBatPath = @"D:\Git\activei_win_container\Activei\Activei\UnInstall.bat";
                            // Open the batch file for reading
                            System.IO.StreamReader strm = System.IO.File.OpenText(UnInsBatPath);
                            // Attach the output for reading
                            System.IO.StreamReader sOut = proc.StandardOutput;
                            // Attach the in for writing
                            System.IO.StreamWriter sIn = proc.StandardInput;
                            // Write each line of the batch file to standard input
                            while (strm.Peek() != -1)
                            {
                                //string str = strm.ReadLine();
                                //str = str.Replace("%2", Dirpath);
                                sIn.WriteLine(strm.ReadLine());
                            }
                            strm.Close();
                            // Exit CMD.EXE
                            string stEchoFmt = "# {0} run successfully. Exiting";
                            sIn.WriteLine(String.Format(stEchoFmt, UnInsBatPath));
                            sIn.WriteLine("EXIT");
                            // Close the process
                            proc.Close();
                            // Read the sOut to a string.
                            string results = sOut.ReadToEnd().Trim();
                            // Close the io Streams;
                            sIn.Close();
                            sOut.Close();

                            Directory.Delete(DirpathRoot + "\\clamav", true);


                            //string command = String.Format("\"{0}\"", UnInsBatPath);
                            //startInfo.FileName = UnInsBatPath;
                            //startInfo.CreateNoWindow = false;
                            //startInfo.UseShellExecute = false;
                            //startInfo.Arguments = UnInsBatPath;
                            //process.StartInfo = startInfo;
                            //process.Start();
                            //process.WaitForExit();
                            //Thread.Sleep(10000);
                            //ServiceController sc = new ServiceController("FreshClam");
                            //if (Convert.ToString(sc.Status) == "Started" || Convert.ToString(sc.Status) == "Running")
                            //{
                            //    sc.Stop();
                            //}
                            //ServiceController clam = new ServiceController("ClamD");
                            //if (Convert.ToString(clam.Status) == "Started" || Convert.ToString(clam.Status) == "Running")
                            //{
                            //    clam.Stop();
                            //}
                            
                        }
                    }
                    catch (Exception)
                    {

                    }
                }
            }
            catch (Exception)
            {
            }
        }

        private static void UpdateUnistallStatus()
        {
            //ErrorTracker errorTracker = new ErrorTracker();
            try
            {

                foreach (Process proc in Process.GetProcessesByName("BandwidthMonitor"))
                {
                    proc.Kill();
                }

                String uniqueID = ClickOnceHelper.GetUserUniqueID();//String.Empty;


                NetgearClientServiceSoapClient NGDownloadStatusService = new NetgearClientServiceSoapClient();

                //errorTracker.WriteLog("UpdateUnistallStatus() :: Calling Netgear Service NetgearToolUninstallationDetails() method :: " + uniqueID);
                NGDownloadStatusService.NetgearToolUninstallationDetails(uniqueID, String.Empty, DateTime.Now);

                NGDownloadStatusService = null;
                
            }
            catch (Exception ex)
            {
                //errorTracker.WriteErrorLog("Program.cs", "UpdateUnistallStatus()","", ex.Message, ex.StackTrace,"ERROR");
                //errorTracker = null;
            }
        }

        private static bool IsRunAsAdministrator()
        {
            var wi = WindowsIdentity.GetCurrent();
            var wp = new WindowsPrincipal(wi);
            return wp.IsInRole(WindowsBuiltInRole.Administrator);
        }

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
    }
}

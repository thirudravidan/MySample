using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;
using System.Configuration;
using System.Security.Permissions;
using System.Runtime.InteropServices;
using System.Net.NetworkInformation;
using Newtonsoft.Json;
using System.IO;
using System.Diagnostics;
using networkmonitor;
using Activei.Defragmentation;
using CustomizedClickOnce.Common;
using System.Net;
using System.Globalization;
using Microsoft.Win32;
using System.Security.Principal;
using System.ServiceProcess;
using System.Text;
using nClam;
using System.Deployment.Application;
using System.Collections;
using System.Security.AccessControl;
using Activei.NetgearClientService;
using Activei.Tracker;
using System.Xml;
using System.Text.RegularExpressions;
using WIA;

namespace Activei
{
    [PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
    [ComVisibleAttribute(true)]
    public partial class MainWindow : Form, IDefragmentation
    {
        #region "-----Declarations---"

        public static WebView chromiumBrowser;
        public static bool isNetworkAvailable = true;
        public string returnValue = "false";
        string strAddress = string.Empty;
        static BackgroundWorker networkUsageWorker = new BackgroundWorker();

        string[] FileNames;
        string filename = "";
        long dirSize = 0, byteval = 0;
        string hostname = ConfigurationManager.AppSettings["hostname"];
        int portno = Convert.ToInt32(ConfigurationManager.AppSettings["portno"]);
        public const string clientName = "ACTIVEI";
        public static string strCurrentVersion = string.Empty;
        static StringBuilder sbRouter = new StringBuilder();


        #endregion
        public MainWindow(string strVersion)
        {
            try
            {
                CheckForSingleInstance();
                this.uxInternetOptimizerBackgroundWorker = new System.ComponentModel.BackgroundWorker();
                this.uxInternetOptimizerBackgroundWorker.DoWork += new DoWorkEventHandler(uxInternetOptimizerBackgroundWorker_DoWork);
                this.uxInternetOptimizerBackgroundWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(uxInternetOptimizerBackgroundWorker_RunWorkerCompleted);
                //
                this.pcoptBackgroundWorker = new System.ComponentModel.BackgroundWorker();
                this.pcoptBackgroundWorker.WorkerReportsProgress = true;
                this.pcoptBackgroundWorker.WorkerSupportsCancellation = true;
                this.pcoptBackgroundWorker.DoWork += new System.ComponentModel.DoWorkEventHandler(this.pcoptBackgroundWorker_DoWork);
                this.pcoptBackgroundWorker.ProgressChanged += new System.ComponentModel.ProgressChangedEventHandler(this.pcoptBackgroundWorker_ProgressChanged);
                this.pcoptBackgroundWorker.RunWorkerCompleted += new System.ComponentModel.RunWorkerCompletedEventHandler(this.pcoptBackgroundWorker_RunWorkerCompleted);
                this.components = new System.ComponentModel.Container();
                this.regScanTimer = new System.Windows.Forms.Timer(this.components);
                this.restoreTimer = new System.Windows.Forms.Timer(this.components);
                this.regScanTimer.Interval = 1000;
                this.restoreTimer.Interval = 1000;


                InitializeComponent();

                bw.DoWork += new DoWorkEventHandler(bw_DoWork);
                //MessageBox.Show(strVersion);
                ////ApplicationDeployment deployment = ApplicationDeployment.CurrentDeployment;
                //strCurrentVersion = strVersion;
                //MessageBox.Show("Current version" + strVersion);



                //if (ApplicationDeployment.IsNetworkDeployed)
                //{
                //    ApplicationDeployment deployment = ApplicationDeployment.CurrentDeployment;
                //    strCurrentVersion = deployment.CurrentVersion.ToString();
                //    MessageBox.Show(strCurrentVersion);

                //}
                strCurrentVersion = ConfigurationManager.AppSettings["VersionInfo"];


                //if (!Directory.Exists(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), ConfigSettings.ClientName, ((Globals.ProductName == "GearHead Connect") ? "GearHeadConnectOffline" : (Globals.ProductName + "Offline")))))
                if (!Directory.Exists(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), ConfigSettings.ClientName, strCurrentVersion, ((Globals.ProductName == "GearHead Connect") ? "GearHeadConnectOffline" : (Globals.ProductName + "Offline")))))
                {
                    UnZipFiles();
                }

                if (!Directory.Exists(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), ConfigSettings.ClientName, "clamav")))
                {
                    System.ComponentModel.BackgroundWorker AntivirusBackgroundWorker = new System.ComponentModel.BackgroundWorker();
                    AntivirusBackgroundWorker.WorkerReportsProgress = true;
                    AntivirusBackgroundWorker.WorkerSupportsCancellation = true;
                    AntivirusBackgroundWorker.DoWork += new DoWorkEventHandler(AntivirusBackgroundWorker_DoWork);
                    AntivirusBackgroundWorker.RunWorkerAsync();
                }
                _defragPresenter = new DefragmentationPresenter(this);
                NotifyIcon();
                openFileDialogFirewall.Filter = "Applications (*.exe)|*.exe";
                openFileDialogFirewall.FileName = "";
                //getdevices();
                //networkMonitor();
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "MainWindow", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }
        /// <summary>
        /// //Loading the main window 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void MainWindow_Load(object sender, EventArgs e)
        {
            try
            {
                this.Text = (ConfigSettings.ClientName.ToUpper() == clientName) ? "Activei" : "GearHead Connect";
                this.Icon = (ConfigSettings.ClientName.ToUpper() == clientName) ? Properties.Resources.Activei : Properties.Resources.NG_Icon;
                picboxload.Image = (ConfigSettings.ClientName.ToUpper() == clientName) ? Activei.Properties.Resources.loader : Activei.Properties.Resources.gearhead_loader;
                this.Width = Screen.PrimaryScreen.WorkingArea.Width;
                this.Height = Screen.PrimaryScreen.WorkingArea.Height;
                pnlLoading.Width = this.Width;
                this.Location = new Point(0, 0);
                pnlLoading.Location = new Point(0, this.Height / 3);
                this.DoubleBuffered = true;
                //routerAuthenticated = routerAuthentication("admin", "password");

                NetworkChange.NetworkAvailabilityChanged += new NetworkAvailabilityChangedEventHandler(NetworkChange_NetworkAvailabilityChanged);
                NetworkChange.NetworkAddressChanged += new NetworkAddressChangedEventHandler(NetworkChange_NetworkAddressChanged);
                //MainWindow.ShowInterfaceSummary();
                isNetworkAvailable = System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable();

                SetURl();
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "MainWindow_Load", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        void NetworkChange_NetworkAddressChanged(object sender, EventArgs e)
        {
            //troubleshoot();
        }

        //public static void ShowInterfaceSummary()
        //{



        //    bool networkIsAvailable = false;
        //    NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
        //    foreach (NetworkInterface adapter in interfaces)
        //    {

        //        if (
        //        (adapter.NetworkInterfaceType != NetworkInterfaceType.Loopback && adapter.NetworkInterfaceType != NetworkInterfaceType.Tunnel) &&
        //        adapter.OperationalStatus == OperationalStatus.Up)
        //        {
        //            networkIsAvailable = true;
        //        }

        //        Console.WriteLine("Name: {0}", adapter.Name);
        //        Console.WriteLine(adapter.Description);
        //        Console.WriteLine(String.Empty.PadLeft(adapter.Description.Length, '='));
        //        Console.WriteLine("  Interface type .......................... : {0}", adapter.NetworkInterfaceType);
        //        Console.WriteLine("  Operational status ...................... : {0} -- {1}",
        //            adapter.OperationalStatus, networkIsAvailable);
        //        string versions = "";

        //        // Create a display string for the supported IP versions. 
        //        if (adapter.Supports(NetworkInterfaceComponent.IPv4))
        //        {
        //            versions = "IPv4";
        //        }
        //        if (adapter.Supports(NetworkInterfaceComponent.IPv6))
        //        {
        //            if (versions.Length > 0)
        //            {
        //                versions += " ";
        //            }
        //            versions += "IPv6";
        //        }
        //        Console.WriteLine("  IP version .............................. : {0}", versions);
        //        Console.WriteLine();
        //    }
        //    Console.WriteLine();
        //}

        private static void startAntivirusService()
        {
            try
            {
                if (IsRunAsAdministrator())
                {
                    string DirpathRoot = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), ConfigurationManager.AppSettings["ClientName"]);
                    string sourceFile = ConfigurationManager.AppSettings["ClamAvURL"];
                    string BatFilePath = string.Empty;
                    RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName(ConfigurationManager.AppSettings["ClientName"]);
                    if (UninstallRegistryKey != null)
                    {
                        string uninstallPath = UninstallRegistryKey.GetValue("UninstallString").ToString();
                        BatFilePath = Path.Combine(uninstallPath.Replace("\"", "").Substring(0, uninstallPath.LastIndexOf("\\")), ConfigurationManager.AppSettings["InstallBatPath"]);
                    }
                    string Dirpath = DirpathRoot + "\\clamav\\";
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();


                    if (!Directory.Exists(DirpathRoot + "\\clamav\\"))
                    {
                        Directory.CreateDirectory(Dirpath);
                        string zipFileName = Path.Combine(DirpathRoot, "clamav.zip");
                        System.Net.WebClient webClient = new System.Net.WebClient();
                        webClient.DownloadFile(sourceFile, zipFileName);
                        ArchiveManager.UnArchive(zipFileName, DirpathRoot);
                        File.Delete(zipFileName);
                    }
                    try
                    {
                        string clamdFile = Dirpath + "clamd.conf";
                        using (StreamWriter writer = new StreamWriter(clamdFile))
                        {
                            for (int currentLine = 1; currentLine <= 4; currentLine++)
                            {
                                if (currentLine == 1)
                                {
                                    writer.WriteLine("TCPSocket 3310");
                                }
                                else if (currentLine == 2)
                                {
                                    writer.WriteLine("MaxThreads 2");
                                }
                                else if (currentLine == 3)
                                {
                                    writer.WriteLine("LogFile " + Dirpath + "clamd.log");
                                }
                                else
                                {
                                    writer.WriteLine("DatabaseDirectory " + Dirpath + "db");
                                }
                            }
                        }



                        string command = String.Format("\"{0}\" \"{1}\"", BatFilePath, Dirpath);
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
                        // Open the batch file for reading
                        System.IO.StreamReader strm = System.IO.File.OpenText(BatFilePath);
                        // Attach the output for reading
                        System.IO.StreamReader sOut = proc.StandardOutput;
                        // Attach the in for writing
                        System.IO.StreamWriter sIn = proc.StandardInput;
                        // Write each line of the batch file to standard input
                        while (strm.Peek() != -1)
                        {
                            string str = strm.ReadLine();
                            str = str.Replace("%2", Dirpath);
                            sIn.WriteLine(str);
                        }
                        strm.Close();
                        // Exit CMD.EXE
                        string stEchoFmt = "# {0} run successfully. Exiting";
                        sIn.WriteLine(String.Format(stEchoFmt, BatFilePath));
                        sIn.WriteLine("EXIT");
                        // Close the process
                        proc.Close();
                        // Read the sOut to a string.
                        string results = sOut.ReadToEnd().Trim();
                        // Close the io Streams;
                        sIn.Close();
                        sOut.Close();
                        serviceStart("freshclam", "Automatic");
                        serviceStart("ClamD", "Automatic");
                    }
                    catch (Exception ex)
                    {
                        ErrorTracker.WriteErrorLog("MainWindow.cs", "startAntivirusService", "", ex.Message, ex.StackTrace, "ERROR");
                    }
                }

            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "startAntivirusService()", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        private static bool serviceStart(string name, string startupType)
        {
            try
            {
                // Determine statuptype
                string startupTypeConverted = string.Empty;
                switch (startupType)
                {
                    case "Automatic":
                        startupTypeConverted = "auto";
                        break;
                    case "Disabled":
                        startupTypeConverted = "disabled";
                        break;
                    case "Manual":
                        startupTypeConverted = "demand";
                        break;
                    default:
                        startupTypeConverted = "auto";
                        break;
                }

                StringBuilder builder = new StringBuilder();
                builder.AppendFormat("{0} {1} ", "Config", name);
                builder.AppendFormat("start= \"{0}\"", startupTypeConverted);
                // Execute sc.exe commando
                using (Process process = new Process())
                {
                    process.StartInfo.FileName = @"sc.exe";
                    process.StartInfo.Arguments = builder.ToString();
                    process.StartInfo.CreateNoWindow = true;
                    process.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
                    process.Start();
                }

                ServiceController sc = new ServiceController(name);
                sc.Start();
                return true;
            }
            catch (Exception e)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "serviceStart()", "", e.Message, e.StackTrace, "ERROR");
                return true;
            }
        }
        private static bool IsRunAsAdministrator()
        {
            var wi = WindowsIdentity.GetCurrent();
            var wp = new WindowsPrincipal(wi);
            return wp.IsInRole(WindowsBuiltInRole.Administrator);
        }

        public void AntivirusBackgroundWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            //startAntivirusService();
        }

        #region Check Single Instance
        //Checking the process already run or not
        private void CheckForSingleInstance()
        {
            //Process[] process = Process.GetProcessesByName("Activei");
            Process[] process = Process.GetProcessesByName(ConfigSettings.ClientName);
            if (process.Count() > 1)
            {
                GearHeadMessageBox.Instance.Show(ConfigSettings.ClientName + " is already open. Please check your system tray (notification area)", ConfigSettings.ClientName, MessageBoxButtons.OK);
                Environment.Exit(0);
            }
        }
        int routerAuthenticated = -1;
        #endregion
        /// <summary>
        /// //Download and unzip the files
        /// </summary>
        private static void UnZipFiles()
        {
            try
            {
                string sourceFile = ConfigurationManager.AppSettings["OfflinePageURL"];
                String offlineFolder = string.Empty;
                offlineFolder = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                offlineFolder = Path.Combine(offlineFolder, Globals.ProductName, strCurrentVersion);
                if (!Directory.Exists(offlineFolder))
                    Directory.CreateDirectory(offlineFolder);


                if (!File.Exists(Path.Combine(offlineFolder, ((Globals.ProductName == "GearHead Connect") ? "GearHeadConnect" : Globals.ProductName) + "Offline/index.html")))
                {
                    string zipFileName = Path.Combine(offlineFolder, ((Globals.ProductName == "GearHead Connect") ? "GearHeadConnect" : Globals.ProductName) + "Offline.zip");
                    System.Net.WebClient webClient = new System.Net.WebClient();
                    webClient.DownloadFile(sourceFile, zipFileName);
                    ArchiveManager.UnArchive(zipFileName, offlineFolder);
                    File.Delete(zipFileName);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// //Set Borwser Settings
        /// </summary>
        public void SetURl()
        {
            var settings = new CefSharp.Settings
            {
                PackLoadingDisabled = true,
            };


            Settings.Default.IsNetwork = isNetworkAvailable.ToString();
            Settings.Default.Save();
            if (ConfigurationManager.AppSettings["DeploymentType"] == "L")
            {
                strAddress = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), Globals.ProductName, strCurrentVersion, ((Globals.ProductName == "GearHead Connect") ? "GearHeadConnect" : Globals.ProductName) + "Offline\\index.html");
            }
            else
            {
                strAddress = ConfigurationManager.AppSettings["LocalUrl"];
            }
            BrowserSettings browserSettings = new BrowserSettings();
            browserSettings.FileAccessFromFileUrlsAllowed = true;
            browserSettings.UniversalAccessFromFileUrlsAllowed = true;
            browserSettings.TextAreaResizeDisabled = true;
            if (CEF.Initialize(settings))
            {
                chromiumBrowser = new WebView(strAddress, browserSettings);
            }

            //chromiumBrowser.Address = strAddress;
            chromiumBrowser.Dock = DockStyle.Fill;
            chromiumBrowser.RegisterJsObject("external", this);
            chromiumBrowser.LoadCompleted += new LoadCompletedEventHandler(onLoadCompleted);
            uxWebBrowserPannel.Controls.Add(chromiumBrowser);
            //renderChromiumBrowser(chromiumBrowser, strAddress);
        }

        public bool isLoaded = false;
        /// <summary>
        /// //On load Complete Event of the web view
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void onLoadCompleted(object sender, LoadCompletedEventArgs e)
        {
            try
            {
                this.Invoke(new MethodInvoker(delegate
                {
                    pnlLoading.Hide();
                }));
                if (!isLoaded)
                {
                    ChangeNetworkStatus(isNetworkAvailable, Settings.Default.IsNetworkChanged);
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "onLoadCompleted", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }
        /// <summary>
        /// //Save the setting value and change the network status
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void NetworkChange_NetworkAvailabilityChanged(object sender, NetworkAvailabilityEventArgs e)
        {
            try
            {
                isNetworkAvailable = e.IsAvailable;
                Settings.Default.IsNetwork = isNetworkAvailable.ToString();
                Settings.Default.IsNetworkChanged = "True";
                Settings.Default.Save();
                ChangeNetworkStatus(isNetworkAvailable, Settings.Default.IsNetworkChanged);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "NetworkChange_NetworkAvailabilityChanged", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }
        /// <summary>
        /// Functionality used to change the network status through javascript
        /// </summary>
        /// <param name="isnetwork"></param>
        private void ChangeNetworkStatus(bool isnetwork, string isNetworkChanged)
        {
            try
            {
                isLoaded = true;
                chromiumBrowser.ExecuteScript("javascript:changeNetworkActivity('" + isnetwork + "','" + isNetworkChanged + "')");
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "ChangeNetworkStatus", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }
        /// <summary>
        /// Functionaliy used to minimize the main window
        /// </summary>
        public void activeiMinimize()
        {
            try
            {

                this.Invoke(new MethodInvoker(delegate
                {
                    this.WindowState = FormWindowState.Minimized;
                }));
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "activeiMinimize", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }
        /// <summary>
        /// Functionaliy used to close the main window
        /// </summary>
        public void activeiClose()
        {
            try
            {
                this.Invoke(new MethodInvoker(delegate
                {
                    this.Hide();
                    uxNetgearNotifyIcon.ShowBalloonTip(1000);
                }));
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "activeiClose", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }
        /// <summary>
        /// //Functionality used to get the user loggin details from settings
        /// </summary>
        /// <returns></returns>
        public string[] savedPassword()
        {
            try
            {
                string[] UserDetails = new string[4];
                if (!string.IsNullOrEmpty(Settings.Default.UserName))
                {
                    UserDetails[0] = Settings.Default.UserName;
                    UserDetails[1] = Settings.Default.Password;
                    UserDetails[2] = Settings.Default.rememberPassword;
                    UserDetails[3] = Settings.Default.userlogout;

                }

                return UserDetails;
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "savedPassword()", "", ex.Message, ex.StackTrace, "ERROR");
                throw ex;
            }
        }
        /// <summary>
        /// retrive user loggin details from settings
        /// </summary>
        /// <returns></returns>
        public string getUserDetails()
        {
            try
            {
                var jsonJunkFiles = JsonConvert.SerializeObject(junkFileSpecificationsList);
                Dictionary<string, string> lstUserDetails = new Dictionary<string, string>();
                lstUserDetails.Add("UserFirstName", Settings.Default.FirstName);
                lstUserDetails.Add("RemainingDays", Settings.Default.RemainingDays);
                lstUserDetails.Add("IsNetwork", Settings.Default.IsNetwork);
                lstUserDetails.Add("ContractAvailability", Settings.Default.ContractAvailability);
                lstUserDetails.Add("IsNetworkChanged", Settings.Default.IsNetworkChanged);
                lstUserDetails.Add("RouterUserName", Settings.Default.RouterUserName);
                lstUserDetails.Add("RouterPassword", Settings.Default.RouterPassword);
                var userDetails = JsonConvert.SerializeObject(lstUserDetails);
                return userDetails;
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "getUserDetails()", "", ex.Message, ex.StackTrace, "ERROR");
                throw ex;
            }
        }

        #region "Router Log"
        /// <summary>
        /// Functionality to start router backup and restoration
        /// </summary>
        public void doAutomaticTroubleshoot()
        {
            try
            {
                sbRouter = new StringBuilder();
                //sbRouter.AppendLine("1. Check the Physical Connection between the PC and the router. ");
                //sbRouter.AppendLine("2. Check whether the modem is connected to the WAN(isolated) slot of the router.");
                //sbRouter.AppendLine("3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route.");
                //sbRouter.AppendLine("4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router.");
                //sbRouter.AppendLine("1. Check the Physical Connection between the PC and the router. ");
                //sbRouter.AppendLine("2. Check whether the modem is connected to the WAN(isolated) slot of the router.");
                //sbRouter.AppendLine("3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route.");
                //sbRouter.AppendLine("4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router.");
                //routerbackupBGWorker.RunWorkerAsync();
                troubleshoot();
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "doAutomaticTroubleshoot()", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        void troubleshoot()
        {
            try
            {


                //Trigger from here
                string logDetails = string.Empty;
                sbRouter.AppendLine("Trobleshoot step started...");
                sbRouter.AppendLine("-----------------------------");
                sbRouter.AppendLine("Checking for Router Authentication.");

                if (routerAuthenticated != 0) { routerAuthenticated = routerAuthentication("admin", "password"); }
                if (routerAuthenticated == 0)
                {
                    sbRouter.AppendLine("Router Authentication Success.");
                    isNetworkAvailable = isNetworkAvail();
                    if (isNetworkAvailable) return;
                    //
                    GetRouterCofigSettings();
                    sbRouter.AppendLine("Checking for Valid IP...");
                    if (IsValidIP())
                    {
                        sbRouter.AppendLine("Gateway IP is Valid.");
                        sbRouter.AppendLine("Checking for Private IP...");
                        if (!IsPrivateIp())
                        {
                            sbRouter.AppendLine("Invalid Private IP...");
                            sbRouter.AppendLine("Please check the below steps");
                            sbRouter.AppendLine("********************************");
                            sbRouter.AppendLine("1. Check the Physical Connection between the PC and the router. ");
                            sbRouter.AppendLine("2. Check whether the modem is connected to the WAN(isolated) slot of the router.");
                            sbRouter.AppendLine("3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route.");
                            sbRouter.AppendLine("4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router.");
                        }
                        else
                        {
                            sbRouter.AppendLine("Valid Private IP.");
                            if (GetPingSuccessCount())
                            {
                                sbRouter.AppendLine("Get log details for checking internet disconnected count");
                                logDetails = GetRouterLogDetails();
                                if (string.IsNullOrEmpty(logDetails))
                                {
                                    sbRouter.AppendLine("Log is Empty.");
                                    //call router backup process
                                    sbRouter.AppendLine("Router Restore starting...");
                                    //RestoreRouterBackup();
                                    //if (!IsWanIP())
                                    if (!((bool)IsWanIP()["IsWanIP"]))
                                    {
                                        //SendRouterStatus("POWERCYCLE");
                                        //GearHeadMessageBox.Instance.Show("Power cycle your network", Globals.ProductName, MessageBoxButtons.OK);
                                        //MessageBox.Show("1. Check the Physical Connection between the PC and the router. 2. Check whether the modem is connected to the WAN(isolated) slot of the router. 3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route. 4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router. ");
                                        //dbmTimmer.Enabled = true;
                                        sbRouter.AppendLine("Power cycle your network");
                                    }
                                    else
                                    {
                                        //MessageBox.Show("Your issue resolved...");
                                        //SendRouterStatus("PCONLINE");
                                        //GearHeadMessageBox.Instance.Show("Your issue resolved...", Globals.ProductName, MessageBoxButtons.OK);
                                        //dbmTimmer.Enabled = true;
                                        sbRouter.AppendLine("Your issue resolved...");
                                    }
                                }
                                else
                                {
                                    int logCount = LogDisconnectedCount(logDetails);
                                    if (logCount > 0)
                                    {
                                        if (logCount >= 25)
                                        {
                                            //sender log TokenAccessLevels product team
                                            //MessageBox.Show("Log has been sent to Engineering team.");
                                            //GearHeadMessageBox.Instance.Show("Log has been sent to Engineering team.",Globals.ProductName,MessageBoxButtons.OK);
                                            //dbmTimmer.Enabled = true;
                                            sbRouter.AppendLine("Log has been sent to Engineering team.");
                                        }
                                        else if (logCount != 1)
                                        {
                                            //call router backup process
                                            //RestoreRouterBackup();
                                            //if (!IsWanIP())
                                            if (!((bool)IsWanIP()["IsWanIP"]))
                                            {
                                                //MessageBox.Show("1. Check the Physical Connection between the PC and the router. 2. Check whether the modem is connected to the WAN(isolated) slot of the router. 3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route. 4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router. ");
                                                //SendRouterStatus("POWERCYCLE");
                                                //GearHeadMessageBox.Instance.Show("Power cycle your network", Globals.ProductName, MessageBoxButtons.OK);
                                                sbRouter.AppendLine("Power cycle your network");
                                            }
                                            else
                                            {
                                                //SendRouterStatus("PCONLINE");
                                                //MessageBox.Show("Your issue resolved...");
                                                //GearHeadMessageBox.Instance.Show("Your issue resolved...", Globals.ProductName, MessageBoxButtons.OK);
                                                sbRouter.AppendLine("Your issue resolved...");
                                            }
                                        }
                                    }

                                }
                            }
                            else
                            {
                                //MessageBox.Show("Hard & On/Off reset your router");
                                //SendRouterStatus("RESETROUTER");
                                //GearHeadMessageBox.Instance.Show("Hard & On/Off reset your router", Globals.ProductName, MessageBoxButtons.OK);
                                //dbmTimmer.Enabled = true;
                                sbRouter.AppendLine("Hard & On/Off reset your router");
                            }
                        }
                    }
                    else
                    {
                        sbRouter.AppendLine("Gateway is not Valid IP..");
                        sbRouter.AppendLine("Please check the below steps");
                        sbRouter.AppendLine("*********************************");
                        //SendRouterStatus("AUTOCONFIG");
                        //MessageBox.Show("1. Check with direct connection from modem to PC.   if your online (PC LAN adapter status is good)then, 2. Connect the PC back to the router LAN Port. 3. Try to Swap the cable, 4. Check with different Ethernet cable, 5. Try with different LAN port, 6. Disable and Enable LAN adapter,");
                        //GearHeadMessageBox.Instance.Show(", , , , 6. Disable and Enable LAN adapter", Globals.ProductName, MessageBoxButtons.OK);
                        //dbmTimmer.Enabled = true;
                        sbRouter.AppendLine("1. Check with direct connection from modem to PC.   if your online (PC LAN adapter status is good)then");
                        sbRouter.AppendLine("2. Connect the PC back to the router LAN Port. ");
                        sbRouter.AppendLine("3. Try to Swap the cable");
                        sbRouter.AppendLine("4. Check with different Ethernet cable");
                        sbRouter.AppendLine("5. Try with different LAN port");
                        sbRouter.AppendLine("6. Disable and Enable LAN adapter");
                    }
                }
                else if (routerAuthenticated == 401)
                {
                    //SendRouterStatus("FAILED");
                    //MessageBox.Show("Authentication failed. Please enter correct user name and password in \"Router Mange \" page.");
                    //GearHeadMessageBox.Instance.Show("Authentication failed. Please enter correct user name and password in \"Router Mange \" page.", Globals.ProductName, MessageBoxButtons.OK);
                    //dbmTimmer.Enabled = true;
                    //Todo: Redirect to login page
                    sbRouter.AppendLine("Authentication failed. Please enter correct user name and password in \"Router Mange \" page.");
                }
                else
                {
                    //SendRouterStatus("CHECKROUTER");
                    //GearHeadMessageBox.Instance.Show("Please check whether router connected with your device or not", Globals.ProductName, MessageBoxButtons.OK);
                    sbRouter.AppendLine("Please check whether router connected with your device or not");
                }

                //Write trouble shoot steps to Log
                string routerLogPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "TroubleShootLog");
                if (!Directory.Exists(routerLogPath))
                {
                    Directory.CreateDirectory(routerLogPath);
                }
                string routerTroubleLogPath = routerLogPath + @"\" + string.Format("RouterTrobleShootLog_{0:yyyy-MM-dd_hh-mm-ss-tt}.txt", DateTime.Now);
                File.WriteAllText(routerTroubleLogPath, sbRouter.ToString());

                //Open Log in Notepad

                string tempFiName = "";
                tempFiName = AppDomain.CurrentDomain.BaseDirectory + "tempLog.txt";

                File.Copy(routerLogPath, tempFiName);

                System.Diagnostics.Process.Start("notepad.exe", tempFiName);


                //Open Log in Notepad



            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "NetworkChange_NetworkAvailabilityChanged", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// retrn the router troubleshoot steps
        /// </summary>
        /// <returns></returns>
        public string getRouterRestorationSteps()
        {
            return JsonConvert.SerializeObject(sbRouter.ToString());
        }

        /// <summary>
        /// functionlity used to authenticate the router login
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public int routerAuthentication(string userName, string password)
        {
            try
            {
                XmlDocument doc = new XmlDocument();

                //Authenticate
                string strxmlau = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmlau += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmlau += "</SOAP-ENV:Header>";
                strxmlau += "<SOAP-ENV:Body><Authenticate>";
                strxmlau += "<NewPassword xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">" + password + "</NewPassword>";
                strxmlau += "<NewUsername xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">" + userName + "</NewUsername>";
                strxmlau += "</Authenticate></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmlau);
                string soapAction = "urn:NETGEAR-ROUTER:service:ParentalControl:1#Authenticate";
                string strRes = GetRouterSoapResponse(doc, soapAction);

                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);
                if (result == 0)
                {
                    Settings.Default.RouterUserName = userName;
                    Settings.Default.RouterPassword = password;
                    Settings.Default.Save();
                    //getRouterLog();
                }
                return result;
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "routerAuthentication()", "", ex.Message, ex.StackTrace, "ERROR");
                return 2;
            }
        }

        /// <summary>
        /// Functionality to post web soap request and get response
        /// </summary>
        /// <param name="doc"></param>
        /// <param name="soapAction"></param>
        /// <returns></returns>        
        private static string GetRouterSoapResponse(XmlDocument doc, string soapAction)
        {
            try
            {
                HttpWebRequest requestau = (HttpWebRequest)WebRequest.Create(Settings.Default.RouterSoapUrl);
                // add the headers
                // the SOAPACtion determines what action the web service should use
                // YOU MUST KNOW THIS and SET IT HERE
                requestau.Headers.Add("SOAPAction", soapAction);

                // set the request type
                // we user utf-8 but set the content type here
                requestau.ContentType = "text/xml;charset=\"utf-8\"";
                requestau.Accept = "text/xml";
                requestau.Method = "POST";

                // add our body to the request
                Stream streamau = requestau.GetRequestStream();
                doc.Save(streamau);
                streamau.Close();
                string strRes = string.Empty;

                // get the response back
                using (HttpWebResponse response = (HttpWebResponse)requestau.GetResponse())
                {
                    // do something with the response here
                    Stream responsedata = response.GetResponseStream();
                    StreamReader responsereader = new StreamReader(responsedata);
                    strRes = responsereader.ReadToEnd();
                }//end using
                return strRes;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Functionality to get router logs
        /// </summary>
        /// <returns></returns>
        public string getRouterLog()
        {
            try
            {
                string logDetails = GetRouterLogDetails();
                List<LogDetails> lstLogDetaisl = new List<LogDetails>();
                using (StringReader reader = new StringReader(logDetails))
                {
                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        lstLogDetaisl.Add(new LogDetails() { LogDetail = line });
                    }
                }
                return JsonConvert.SerializeObject(lstLogDetaisl);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "getRouterLog()", "", ex.Message, ex.StackTrace, "ERROR");
                throw ex;
            }
        }

        /// <summary>
        /// Functionality to get router details
        /// </summary>
        /// <returns></returns>
        public string getRouterDeviceDetails()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //GetLog
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><GetInfo>";
                strxmla += "</GetInfo></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceInfo:#GetInfo";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);
                ////Get Router Mac And Ip
                //var card = NetworkInterface.GetAllNetworkInterfaces().FirstOrDefault();
                //if (card == null) return null;
                //var address = card.GetIPProperties().GatewayAddresses.FirstOrDefault();
                string[] routerDet = GetInfo();
                Dictionary<string, string> dicDeviceinfo = new Dictionary<string, string>();
                if (result == 0)
                {
                    XmlNodeList model = doc.GetElementsByTagName("ModelName");
                    dicDeviceinfo.Add("Model", model[0].InnerText.ToString());
                    XmlNodeList firmware = doc.GetElementsByTagName("Firmwareversion");
                    dicDeviceinfo.Add("Version", firmware[0].InnerText.ToString());
                    XmlNodeList serial = doc.GetElementsByTagName("SerialNumber");
                    dicDeviceinfo.Add("SerialNumber", serial[0].InnerText.ToString());
                    dicDeviceinfo.Add("MacAddress", routerDet[1]);
                    dicDeviceinfo.Add("IpAddress", routerDet[0]);
                }
                var deviceDetails = JsonConvert.SerializeObject(dicDeviceinfo);
                return deviceDetails;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Functionality used to get router log
        /// </summary>
        /// <returns></returns>
        private static string GetRouterLogDetails()
        {
            try
            {
                sbRouter.AppendLine("Checking for log....");
                XmlDocument doc = new XmlDocument();
                //GetLog
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><GetSystemLogs>";
                strxmla += "</GetSystemLogs></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceInfo:#GetSystemLogs";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);
                string logDetails = string.Empty;
                if (result == 0)
                {
                    XmlNodeList nodeLog = doc.GetElementsByTagName("NewLogDetails");
                    logDetails = nodeLog[0].InnerText;
                }
                return logDetails;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Functionality used to get router config and back up
        /// </summary>
        private void GetRouterCofigSettings()
        {
            XmlDocument doc = new XmlDocument();
            try
            {
                //GetConfigInfo
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><GetConfigInfo>";
                strxmla += "</GetConfigInfo></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmla);

                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:#GetConfigInfo";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response

                doc.LoadXml(strRes);
                //doc.Save(@"D:/Important_Docs/GearHead-II/RouterConfig.xml");

                string decodedConfig = string.Empty;
                XmlNodeList nodeList = doc.GetElementsByTagName("NewConfigFile");
                foreach (XmlNode node in nodeList)
                {
                    decodedConfig = Base64Decode(node.InnerText);
                }

                //store router backup in directory
                string routDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "RouterBackup");
                if (!Directory.Exists(routDir))
                {
                    Directory.CreateDirectory(routDir);
                }
                else
                {
                    DirectoryInfo dir = new DirectoryInfo(routDir);
                    FileInfo[] file = dir.GetFiles().OrderBy(p => p.CreationTime).ToArray();
                    if (file.Length >= 5)
                    {
                        //delete the old backup
                        foreach (var fl in file.Take(1).ToArray())
                        {
                            fl.Delete();
                        }
                    }
                }
                string routBackUpDir = routDir + @"\" + string.Format("NetGearRouterBackup_{0:yyyy-MM-dd_hh-mm-ss-tt}.cfg", DateTime.Now);
                File.WriteAllText(routBackUpDir, decodedConfig);
            }
            catch (Exception ex)
            {
                doc = null;
                throw ex;
            }
        }

        /// <summary>
        /// functionality used to restore the router config
        /// </summary>
        private static void RestoreRouterBackup()
        {
            string routBackDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "RouterBackup");
            try
            {
                if (Directory.Exists(routBackDir))
                {
                    DirectoryInfo dir = new DirectoryInfo(routBackDir);
                    FileInfo file = dir.GetFiles().OrderByDescending(p => p.CreationTime).ToArray().FirstOrDefault<FileInfo>();   //take the most recent
                    string storedConfig = File.ReadAllText(file.FullName);
                    string encConfig = Base64Encode(storedConfig);

                    XmlDocument doc = new XmlDocument();
                    //SetConfig
                    string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                    strxmla += "<SOAP-ENV:Header>";
                    //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                    strxmla += "</SOAP-ENV:Header>";
                    strxmla += "<SOAP-ENV:Body><SetConfiguration>";
                    strxmla += "<NewConfigFile xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">" + encConfig + "</NewConfigFile>";
                    strxmla += "</SetConfiguration></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                    doc.LoadXml(strxmla);
                    string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:#SetConfiguration";
                    string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                    doc.LoadXml(strRes);
                    XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                    int result = 0;
                    result = Convert.ToInt32(nodeList[0].InnerText);
                    if (result == 0)
                    {

                    }

                    //Doubt
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //public static IPAddress GetDefaultGateway()
        //{
        //    try
        //    {
        //        var card = NetworkInterface.GetAllNetworkInterfaces().FirstOrDefault();
        //        if (card == null) return null;
        //        var address = card.GetIPProperties().GatewayAddresses.FirstOrDefault();
        //        return address.Address;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        /// <summary>
        /// Functionality used to get Gateway IP 
        /// </summary>
        /// <returns></returns>
        public static IPAddress GetDefaultGateway()
        {
            //SetText("Checking ..GetDefaultGateway." + Environment.NewLine);
            sbRouter.AppendLine("Checking ..GetDefaultGateway.");
            try
            {
                var card = NetworkInterface.GetAllNetworkInterfaces();

                NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
                foreach (NetworkInterface adapter in interfaces)
                {
                    if (adapter != null & adapter.GetIPProperties().GatewayAddresses.Count > 0)
                    {
                        if (adapter.OperationalStatus == OperationalStatus.Up)
                        {
                            var address = adapter.GetIPProperties().GatewayAddresses.FirstOrDefault();
                            return address.Address;
                        }

                    }

                }
                return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        bool lastStatus = false;
        /// <summary>
        /// Used to checking the network disconnected or not
        /// </summary>
        /// <returns></returns>
        public bool isNetworkAvail()
        {
            sbRouter.AppendLine("Checking for Network Availability...");
            string res = GetRouterLogDetails();
            logDetails = res;
            //SetText(res);

            string[] loglist = res.Split(new string[] { "\n" }, StringSplitOptions.None);
            Regex regex = new Regex(@"\[Internet (.*?)\]");
            Match mat = regex.Match(res);
            if (mat.Success)
            {
                sbRouter.AppendLine("Log found.");
                foreach (string log in loglist)
                {
                    if (log.IndexOf(mat.ToString()) != -1)
                    {
                        if (log.IndexOf("disconnected") > 0)
                        {
                            sbRouter.AppendLine(log);
                            lastStatus = false;
                            break;
                            //sbRouter.AppendLine("You are disconnected from the internet");
                            //sbRouter.AppendLine(log);
                            //SetText("You are disconnected from the internet" + Environment.NewLine);
                        }
                        else
                        {
                            lastStatus = true;
                        }

                    }
                }
            }
            else
            {
                sbRouter.AppendLine("Log not found.Hence checking for LAN IP \"0.0.0.0\"");
                string sysIp = GetInfo()[0];
                if (sysIp.Contains("0.0.0.0"))
                {
                    sbRouter.AppendLine("Found LAN IP as \"0.0.0.0\"");
                    lastStatus = false;
                }
                else
                {
                    sbRouter.AppendLine("Found LAN IP as " + sysIp + " Hence Pinging..");
                    if (GetPingSuccessCount(sysIp) == 4)
                    {
                        sbRouter.AppendLine("Ping Success for " + sysIp);
                        lastStatus = true;
                    }
                    else
                    {
                        sbRouter.AppendLine("Ping Failed for " + sysIp);
                        lastStatus = false;
                    }
                }

            }

            return lastStatus;
        }

        public string[] GetInfo()
        {
            try
            {
                XmlDocument doc = new XmlDocument();

                //Authenticate
                string strxmlau = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmlau += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmlau += "</SOAP-ENV:Header>";
                strxmlau += "<SOAP-ENV:Body><GetInfo>";
                strxmlau += "</GetInfo></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmlau);
                string soapAction = "urn:NETGEAR-ROUTER:service:WANIPConnection:1#GetInfo";
                string strRes = GetRouterSoapResponse(doc, soapAction);

                doc.LoadXml(strRes);
                XmlNodeList nodeListIP = doc.GetElementsByTagName("NewExternalIPAddress");
                XmlNodeList nodeListMac = doc.GetElementsByTagName("NewMACAddress");
                string[] devDet = new string[2];
                devDet[0] = nodeListIP[0].InnerText;
                devDet[1] = nodeListMac[0].InnerText;
                return devDet;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Checking the valid ip
        /// </summary>
        /// <returns></returns>
        private bool IsValidIP()
        {
            bool isValidIp = false;
            try
            {
                if (!GetDefaultGateway().ToString().Contains("169.254"))
                {
                    isValidIp = true;
                }
                return isValidIp;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// Checking the the private ip
        /// </summary>
        /// <returns></returns>
        private bool IsPrivateIp()
        {
            bool isPrivateIP = false;
            string gatewayIP = GetDefaultGateway().ToString();
            Regex regex10 = new Regex(@"^10\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
            Match mat10 = regex10.Match(gatewayIP);
            Regex regex172 = new Regex(@"^172\.(1[6-9]|2[0-9]|3[0-1])\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
            Match mat172 = regex172.Match(gatewayIP);
            Regex regex192 = new Regex(@"^192\.168\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
            Match mat192 = regex192.Match(gatewayIP);

            try
            {
                //if ((gatewayIP.Contains("192.168.1.1") || gatewayIP.Contains("10.0.0.1") || gatewayIP.Contains("172.16") || gatewayIP.Contains("172.31")))
                if (mat10.Success || mat172.Success || mat192.Success)
                {
                    isPrivateIP = true;
                }
                return isPrivateIP;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// Used to checking the log disconnected count
        /// </summary>
        /// <param name="logDetails"></param>
        /// <returns></returns>
        private int LogDisconnectedCount(string logDetails)
        {
            //SetText("Checking ..LogDisconnectedCount." + Environment.NewLine);
            sbRouter.AppendLine("Checking ..LogDisconnectedCount.");
            int disCnt = 0;
            using (StringReader reader = new StringReader(logDetails))
            {
                string logdet;
                while ((logdet = reader.ReadLine()) != null)
                {
                    if (logdet.Contains("[Internet disconnected]"))
                    {
                        disCnt += 1;
                    }
                }
            }
            return disCnt;
        }



        ///Check Private Or Public Or 0.0.0.0
        
        private static Dictionary<string,object> IsWanIP()
        {
            bool iswanIP = false;

            string sysIp = string.Empty;
            IPHostEntry host;
            string localIp = "?";
            string hostName = Dns.GetHostName();
            host = Dns.GetHostEntry(hostName);

            Dictionary<string,object> dictWanProperties=new Dictionary<string,object>();

            
            foreach (IPAddress ip in host.AddressList)
            {
                if (ip.AddressFamily.ToString() == "InterNetwork")
                {
                    sysIp = ip.ToString();
                }
                //localIp += " " + ip.AddressFamily.ToString() + " ";
            }

            
            Regex regex10 = new Regex(@"^10\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
            Match mat10 = regex10.Match(sysIp);
            Regex regex172 = new Regex(@"^172\.(1[6-9]|2[0-9]|3[0-1])\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
            Match mat172 = regex172.Match(sysIp);
            Regex regex192 = new Regex(@"^192\.168\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
            Match mat192 = regex192.Match(sysIp);

            if (sysIp == "0.0.0.0")
            {
                //0.0.0.0 
                //RestoreRouterBackup();

                dictWanProperties.Add("Online", true);
                dictWanProperties.Add("IPAddress", "");
                dictWanProperties.Add("IsWanIP", iswanIP);
                dictWanProperties.Add("Msg", "");

            }
            else
            {
                if (mat10.Success || mat172.Success || mat192.Success)
                {

                    iswanIP = true;

                    Ping pinger = new Ping();

                    PingReply reply = pinger.Send("google.com");

                    if (reply.Status == IPStatus.Success)
                    {
                        dictWanProperties.Add("Online", true);
                        dictWanProperties.Add("IPAddress", reply.Address.ToString());
                        dictWanProperties.Add("IsWanIP", iswanIP);
                        dictWanProperties.Add("Msg", "");
                    }
                    else
                    {
                        dictWanProperties.Add("Online",false);
                        dictWanProperties.Add("IPAddress", "");
                        dictWanProperties.Add("IsWanIP", iswanIP);
                        dictWanProperties.Add("Msg", "");
                    }

                }
                else //For Public Ips
                {
                    Regex regexRange = new Regex(@"^([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
                    Match matRange = regexRange.Match(sysIp);
                    if (matRange.Success)
                    {
                        Ping pinger = new Ping();

                        PingReply reply = pinger.Send("google.com");

                        if (reply.Status == IPStatus.Success)
                        {
                            dictWanProperties.Add("Online", true);
                            dictWanProperties.Add("IPAddress", reply.Address.ToString());
                            dictWanProperties.Add("IsWanIP", iswanIP);
                            dictWanProperties.Add("Msg", "");
                        }
                        else
                        {
                            dictWanProperties.Add("Online", false);
                            dictWanProperties.Add("IPAddress", "");
                            dictWanProperties.Add("IsWanIP", iswanIP);
                            dictWanProperties.Add("Msg", "");
                        }
                    }
                    else
                    {
                        dictWanProperties.Add("Online", false);
                        dictWanProperties.Add("IPAddress", "");
                        dictWanProperties.Add("IsWanIP", iswanIP);
                        dictWanProperties.Add("Msg", "Invalid Public IP");
                    }
                }
            }

            return dictWanProperties;
        }





        ///Check Private Or Public Or 0.0.0


        /// <summary>
        /// Functionality to get the system ip and check it is wan ip
        /// </summary>
        /// <returns></returns>
        //private static bool IsWanIP()
        //{
        //    bool iswanIP = false;

        //    string sysIp = string.Empty;
        //    IPHostEntry host;
        //    string localIp = "?";
        //    string hostName = Dns.GetHostName();
        //    host = Dns.GetHostEntry(hostName);
        //    foreach (IPAddress ip in host.AddressList)
        //    {
        //        if (ip.AddressFamily.ToString() == "InterNetwork")
        //        {
        //            sysIp = ip.ToString();
        //        }
        //        //localIp += " " + ip.AddressFamily.ToString() + " ";
        //    }

            
        //    Regex regex10 = new Regex(@"^10\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
        //    Match mat10 = regex10.Match(sysIp);
        //    Regex regex172 = new Regex(@"^172\.(1[6-9]|2[0-9]|3[0-1])\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
        //    Match mat172 = regex172.Match(sysIp);
        //    Regex regex192 = new Regex(@"^192\.168\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
        //    Match mat192 = regex192.Match(sysIp);

           
        //        //if ((gatewayIP.Contains("192.168.1.1") || gatewayIP.Contains("10.0.0.1") || gatewayIP.Contains("172.16") || gatewayIP.Contains("172.31")))
        //    if (mat10.Success || mat172.Success || mat192.Success)
        //    {
        //        //private ip
        //        GetPingSuccessCount("google.com");
                
        //    }
        //    else
        //    {
        //        //valid ip 0.0.0.0 - 255.255.255.255
        //        GetPingSuccessCount("google.com");
        //    } 
        //    else {
        //        //0.0.0.0 
        //        //RestoreRouterBackup();
        //    }
        //    //IPHostEntry ip = Dns.GetHostByName(Dns.GetHostName());

        //    //string sysIp = ip.AddressList[0].ToString();
        //    //if ((!sysIp.Contains("192.168.1.1") && !sysIp.Contains("10.0.0.1") && !sysIp.Contains("172.16") && !sysIp.Contains("172.31") && !sysIp.Contains("169.254")))
        //    if ((!sysIp.Contains("192.168.1") && !sysIp.Contains("10.0.0.1") && !sysIp.Contains("172.16") && !sysIp.Contains("172.31") && !sysIp.Contains("169.254")))
        //    {
        //        iswanIP = true;
        //    }
        //    return iswanIP;
        //}

        /// <summary>
        /// Functoinality used to ping and get the success count
        /// </summary>
        /// <returns></returns>
        private static int GetPingSuccessCount(string hostAddr)
        {
            sbRouter.AppendLine("Checking ..GetPingSuccessCount.");
            int count = 0; int Success = 0;
            try
            {
                //IPAddress addr = GetDefaultGateway();
                Ping pingSender = new Ping();
                PingOptions options = new PingOptions();

                // Use the default Ttl value which is 128,
                // but change the fragmentation behavior.
                options.DontFragment = true;
                // Create a buffer of 32 bytes of data to be transmitted.
                byte[] data = new byte[32];
                int timeout = 120;
                for (int i = 0; i < 4; i++)
                {
                    PingReply reply =
                      pingSender.Send(hostAddr, timeout, data, options);
                    {
                        count += Convert.ToInt32(reply.RoundtripTime);
                        if (reply.Status == IPStatus.Success)
                        { Success += 1; }
                    }
                }
                return Success;
            }
            catch (Exception ex)
            {
                return Success;
            }
        }

        /// <summary>
        /// Functoinality used to ping and get the success count
        /// </summary>
        /// <returns></returns>
        private static bool GetPingSuccessCount()
        {
            bool blnPingStatus = false;

            try
            {
                IPAddress addr = GetDefaultGateway();
                sbRouter.AppendLine("Pinging the Gateway IP" + addr.ToString());
                if (GetPingSuccessCount(addr.ToString()) == 4)
                {
                    sbRouter.AppendLine("Pinging the Gateway IP " + addr.ToString() + " Success");
                    blnPingStatus = true;
                }
                else
                {
                    sbRouter.AppendLine("Pinging the Gateway IP " + addr.ToString() + " Failed.");
                    sbRouter.AppendLine("Pinging the routerlogin.net...");
                    if (GetPingSuccessCount("routerlogin.net") == 4)
                    {
                        sbRouter.AppendLine("Pinging routerlogin.net success.");
                        blnPingStatus = true;
                    }
                    else
                    {
                        sbRouter.AppendLine("routerlogin.net ping failure.");
                        sbRouter.AppendLine("Pinging routerlogin.com ...");
                        if (GetPingSuccessCount("routerlogin.com") == 4)
                        {
                            sbRouter.AppendLine("routerlogin.com ping success.");
                            blnPingStatus = true;
                        }
                        else
                        {
                            sbRouter.AppendLine("routerlogin.com ping failure.");
                            blnPingStatus = false;
                        }
                    }
                }
                return blnPingStatus;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Decode the base64EncodedData string
        /// </summary>
        /// <param name="base64EncodedData"></param>
        /// <returns></returns>
        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            string decodedString = BitConverter.ToString(base64EncodedBytes);
            //string decodedString = Encoding.UTF8.GetString(base64EncodedBytes);
            //var plainTextBytes = System.Convert.FromBase64String(base64EncodedData).ToString();
            return decodedString;
            // return System.Convert.ToBase64String(plainTextBytes);
            // return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        /// <summary>
        /// Encode the decoded string
        /// </summary>
        /// <param name="plainText"></param>
        /// <returns></returns>
        public static string Base64Encode(string plainText)
        {
            plainText = plainText.Replace("-", "");
            int NumberChars = plainText.Length;
            byte[] bytes = new byte[NumberChars / 2];
            for (int i = 0; i < NumberChars; i += 2)
                bytes[i / 2] = Convert.ToByte(plainText.Substring(i, 2), 16);
            return System.Convert.ToBase64String(bytes);
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
            //var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        ///// <summary>
        ///// Decode the base64EncodedData string
        ///// </summary>
        ///// <param name="base64EncodedData"></param>
        ///// <returns></returns>
        //public static string Base64Decode(string base64EncodedData)
        //{
        //    var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
        //    return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        //}

        ///// <summary>
        ///// Encode the decoded string
        ///// </summary>
        ///// <param name="plainText"></param>
        ///// <returns></returns>
        //public static string Base64Encode(string plainText)
        //{
        //    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
        //    return System.Convert.ToBase64String(plainTextBytes);
        //}

        #endregion

        /// <summary>
        ///Functionality used to save the user loggin details in settings
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="chkremember"></param>
        /// <param name="userFirstName"></param>
        /// <param name="remainingDays"></param>
        /// <param name="userStatus"></param>
        /// <returns></returns>
        public bool rememberPassword(string username, string password, bool chkremember, string userFirstName, string remainingDays, string userStatus)
        {
            try
            {
                Settings.Default.UserName = username;
                Settings.Default.Password = password;
                Settings.Default.userlogout = "false";
                Settings.Default.FirstName = userFirstName;
                Settings.Default.RemainingDays = remainingDays;
                Settings.Default.rememberPassword = (chkremember) ? "true" : "false";
                Settings.Default.ContractAvailability = userStatus;
                Settings.Default.IsNetworkChanged = "False";
                Settings.Default.Save();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #region void NotifyIcon()
        private System.Windows.Forms.NotifyIcon uxNetgearNotifyIcon;
        private System.Windows.Forms.ContextMenu uxNetgearContextMenu;
        private System.Windows.Forms.MenuItem uxNetgearOpenMenuItem;
        private System.Windows.Forms.MenuItem uxNetgearLogOutMenuItem;
        private System.Windows.Forms.MenuItem uxNetgearExitMenuItem;
        //private System.Windows.Forms.MenuItem uxNetgearUninstallMenuItem;

        void NotifyIcon()
        {
            // Menu in icon

            uxNetgearContextMenu = new System.Windows.Forms.ContextMenu();
            uxNetgearOpenMenuItem = new System.Windows.Forms.MenuItem();
            uxNetgearLogOutMenuItem = new System.Windows.Forms.MenuItem();
            uxNetgearExitMenuItem = new System.Windows.Forms.MenuItem();
            //uxNetgearUninstallMenuItem = new System.Windows.Forms.MenuItem();

            // Initialize contextMenu1
            uxNetgearContextMenu.MenuItems.AddRange(
                        new[] { uxNetgearOpenMenuItem, uxNetgearLogOutMenuItem, uxNetgearExitMenuItem });//, uxNetgearContextMenu.MenuItems.Add("-"), uxNetgearUninstallMenuItem });

            // Initialize menuItem1
            uxNetgearOpenMenuItem.Index = 0;
            uxNetgearOpenMenuItem.Text = Properties.Resources.MainWindow_NotifyIcon__Open;
            uxNetgearOpenMenuItem.Click += uxNetgearOpenMenuItem_Click;

            // Initialize menuItem2
            uxNetgearLogOutMenuItem.Index = 1;
            uxNetgearLogOutMenuItem.Text = Properties.Resources.LogoutLabel;
            uxNetgearLogOutMenuItem.Click += uxNetgearLogOutMenuItem_Click;

            // Initialize menuItem3
            uxNetgearExitMenuItem.Index = 2;
            uxNetgearExitMenuItem.Text = Properties.Resources.MainWindow_NotifyIcon_E_xit;
            uxNetgearExitMenuItem.Click += uxNetgearExitMenuItem_Click;

            // Initialize menuItem4
            //uxNetgearUninstallMenuItem.Index = 4;
            //uxNetgearUninstallMenuItem.Text = Properties.Resources.MainWindow_NotifyIcon__Uninstall;
            //uxNetgearUninstallMenuItem.Click += uxNetgearUninstallMenuItem_Click;

            uxNetgearNotifyIcon = new System.Windows.Forms.NotifyIcon
            {
                Icon = (ConfigSettings.ClientName.ToUpper() == clientName) ? Properties.Resources.Activei_Tray : Properties.Resources.NetGear_Tray,
                BalloonTipText = (ConfigSettings.ClientName.ToUpper() == clientName) ? Properties.Resources.BaloonToolTipActivei : Properties.Resources.BaloonToolTipGearHead,
                BalloonTipTitle = (ConfigSettings.ClientName.ToUpper() == clientName) ? Properties.Resources.MainWindow_NotifyIcon_Activei : Properties.Resources.MainWindow_NotifyIcon_Netgear,
                Text = (ConfigSettings.ClientName.ToUpper() == clientName) ? Properties.Resources.MainWindow_NotifyIcon_Activei : Properties.Resources.MainWindow_NotifyIcon_Netgear,
                ContextMenu = uxNetgearContextMenu
            };

            var iconHandle = (ConfigSettings.ClientName.ToUpper() == clientName) ? Properties.Resources.Activei_Tray : Properties.Resources.NetGear_Tray;
            uxNetgearNotifyIcon.Icon = iconHandle;
            uxNetgearNotifyIcon.Visible = true;
            uxNetgearNotifyIcon.Click += MNotifyIconClick;
        }



        void uxNetgearLogOutMenuItem_Click(object sender, EventArgs e)
        {
            Logout();
        }
        #endregion
        #region void m_notifyIcon_Click(object sender, EventArgs e)
        void MNotifyIconClick(object sender, EventArgs e)
        {
            try
            {
                Show();
            }
            catch (Exception) { }
        }
        #endregion

        /// <summary>
        /// Logout  functionality
        /// </summary>
        private void Logout()
        {
            try
            {
                //if (Settings.Default.userlogout == "false")
                //{
                Settings.Default.userlogout = "true";
                Settings.Default.Save();
                this.Invoke(new MethodInvoker(delegate
                {
                    lblloading.Text = "                   Your application is logging out...";
                }));
                chromiumBrowser.ExecuteScript("javascript:logOut()");
                //}
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "Logout()", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }
        #region void uxNetgearExitMenuItem_Click(object Sender, EventArgs e)
        void uxNetgearExitMenuItem_Click(object sender, EventArgs e)
        {
            try
            {
                //if (GearHeadMessageBox.Instance.Show(Properties.Resources.exitText) == System.Windows.Forms.DialogResult.Yes)
                if (GearHeadMessageBox.Instance.Show((ConfigSettings.ClientName.ToUpper() == clientName) ? Properties.Resources.exitTextActivei : Properties.Resources.exitTextGearHead, ConfigSettings.ClientName, MessageBoxButtons.YesNo) == System.Windows.Forms.DialogResult.Yes)
                {
                    // Close the form, which closes the application.
                    if (uxNetgearNotifyIcon != null)
                    {
                        uxNetgearNotifyIcon.Dispose();
                    }
                    Environment.Exit(0);
                }
            }
            catch (Exception) { }
        }
        #endregion

        #region void uxNetgearOpenMenuItem_Click(object Sender, EventArgs e)
        void uxNetgearOpenMenuItem_Click(object sender, EventArgs e)
        {
            // Close the form, which closes the application.
            this.Show();
        }
        #endregion

        public string openBrowseDialog()
        {
            openFileDialogFirewall.ShowDialog();
            string filePath = openFileDialogFirewall.FileName;
            return filePath;
        }
        public string openFolderBrowseDialog()
        {
            openFolderDialogAntivirus.ShowDialog();
            string filePath = openFolderDialogAntivirus.SelectedPath;
            return filePath;
        }
        BackgroundWorker uxdatausageWorker;
        public void loadBandwidthUsages()
        {
            try
            {
                uxdatausageWorker = new BackgroundWorker();
                uxdatausageWorker.WorkerSupportsCancellation = true;
                uxdatausageWorker.DoWork += new DoWorkEventHandler(uxdatausageWorker_DoWork);
                uxdatausageWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(uxdatausageWorker_RunWorkerCompleted);
                uxdatausageWorker.WorkerReportsProgress = true;
                uxdatausageWorker.RunWorkerAsync();
            }
            catch (Exception Ex)
            {

            }
        }

        void uxdatausageWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            loadBandwidthUsage();
        }

        private void uxdatausageWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {
                chromiumBrowser.ExecuteScript("javascript:loadBandwidthUsageDetails()");
                chromiumBrowser.ExecuteScript("javascript:contentloaded()");
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "uxdatausageWorker_RunWorkerCompleted", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        public string loadBandwidthDetails()
        {
            return returnValue;
        }
        private void loadBandwidthUsage()
        {
            string usageDetails = string.Empty;
            string logpath = string.Empty;
            double usageLimit = 0;
            double oldUsageLimit = 0;
            string usageRouterName = string.Empty;
            string usageMacAddress = string.Empty;
            string usageDate = string.Empty;
            string networkUsage = string.Empty;
            string networkUsageHistory = string.Empty;
            string networkUsageLst = string.Empty;
            //logpath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "\\Activei-I\\" + (@"NetworkUsage.csv");
            logpath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "\\" + ConfigSettings.ClientName + "\\" + (@"NetworkUsage.csv");
            if (File.Exists(logpath))
            {
                //Loading Details for Current Date
                using (CsvFileReader reader = new CsvFileReader(logpath))
                {
                    CsvRow row = new CsvRow();
                    while (reader.ReadRow(row))
                    {
                        if (row != null)
                        {
                            if (row.Count > 3)
                            {
                                if (Convert.ToDateTime(row[3]).ToString("dd/MM/yyyy") == System.DateTime.Now.ToString("dd/MM/yyyy"))
                                {
                                    usageLimit += Convert.ToDouble(row[2]);
                                    if (usageRouterName == string.Empty || usageRouterName != row[0])
                                    {
                                        usageRouterName = row[0];
                                        usageMacAddress = row[1];
                                        usageDate = Convert.ToDateTime(row[3]).ToString("dd/MM/yyyy");
                                        networkUsage = Settings.Default.networkUsageTable.Replace("{$adapterName$}", usageRouterName);
                                        networkUsage = networkUsage.Replace("{$macAddress$}", usageMacAddress);
                                        networkUsage = networkUsage.Replace("{$usageDate$}", usageDate);
                                    }
                                }
                            }
                        }
                    }
                    networkUsage = networkUsage.Replace("{$usage$}", Math.Round(usageLimit, 2).ToString());
                    networkUsageLst = networkUsageLst + networkUsage;
                }
                //Loading Histrory Details
                using (CsvFileReader reader = new CsvFileReader(logpath))
                {
                    CsvRow row = new CsvRow();
                    while (reader.ReadRow(row))
                    {
                        if (row != null)
                        {
                            if (row.Count > 3)
                            {
                                if (Convert.ToDateTime(row[3]).ToString("dd/MM/yyyy") != System.DateTime.Now.ToString("dd/MM/yyyy"))
                                {
                                    if (usageDate == string.Empty || usageDate != Convert.ToDateTime(row[3]).ToString("dd/MM/yyyy") || usageRouterName != row[0])
                                    {
                                        if (oldUsageLimit != 0)
                                        {
                                            networkUsageHistory = networkUsageHistory.Replace("{$usage$}", Math.Round(usageLimit, 2).ToString());
                                            networkUsageLst = networkUsageLst + networkUsageHistory;
                                        }
                                        oldUsageLimit = 0;
                                        usageDate = Convert.ToDateTime(row[3]).ToString("dd/MM/yyyy");
                                        usageLimit = Convert.ToDouble(row[2]);
                                        oldUsageLimit += Convert.ToDouble(row[2]);
                                        usageRouterName = row[0];
                                        usageMacAddress = row[1];
                                        networkUsageHistory = Settings.Default.networkUsageTable.Replace("{$adapterName$}", usageRouterName);
                                        networkUsageHistory = networkUsageHistory.Replace("{$macAddress$}", usageMacAddress);
                                        networkUsageHistory = networkUsageHistory.Replace("{$usageDate$}", usageDate);
                                    }
                                    else
                                    {
                                        oldUsageLimit += Convert.ToDouble(row[2]);
                                    }
                                }
                            }
                        }
                    }
                    networkUsageHistory = networkUsageHistory.Replace("{$usage$}", Math.Round(usageLimit, 2).ToString());
                    networkUsageLst = networkUsageLst + networkUsageHistory;
                    returnValue = Settings.Default.networkUsage.Replace(Settings.Default.networkUsageKey, networkUsageLst);
                }
            }

        }

        #region GetCurrentWifiChannels
        /// <summary>
        /// Get Current and Available WifiChannels
        /// Channel Number
        /// Connection Quality
        /// Number of Networks Connected
        /// </summary>
        /// <returns></returns>
        public string getCurrentWifiChannels()
        {
            string returnValue = "false";
            List<string> wifiValue = new List<string>();
            try
            {

                string wifidetails = string.Empty;
                string wifiInfo = string.Empty;
                string wifiName = string.Empty;
                if (client != null)
                {

                    returnValue = Settings.Default.wifiChannel;
                    foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
                    {
                        NativeWifi.Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                        foreach (NativeWifi.Wlan.WlanAvailableNetwork network in networks)
                        {
                            string wifiNm = (GetStringForSSID(network.dot11Ssid) != "") ? GetStringForSSID(network.dot11Ssid) : "Unknown Wi-Fi";
                            var comparisons = wifiValue.Any(x => string.Compare(x, wifiNm, StringComparison.OrdinalIgnoreCase) == 0);
                            if (!comparisons)
                            {

                                string wifiList = string.Empty;
                                if (chkConnected(client, GetStringForSSID(network.dot11Ssid)))
                                {
                                    wifiInfo = Settings.Default.wifiChannelDetails;
                                    wifiInfo = wifiInfo.Replace("{$channelRate}", getChannelNumber(client, GetStringForSSID(network.dot11Ssid)).ToString());
                                    var progressHtml = "<div class='progress' style='width:200px !important'><div class='progress-bar progress-bar-info' role='progressbar' aria-valuenow='" + network.numberOfBssids.ToString() + "' aria-valuemin='0' aria-valuemax='13' style='width: " + network.numberOfBssids.ToString() + "%'><span style='color:black;'>" + network.numberOfBssids.ToString() + "</span></div></div>";
                                    wifiInfo = wifiInfo.Replace("{$networkConnected}", progressHtml);
                                    wifiInfo = wifiInfo.Replace("{$networkQuality}", signalQuality(network.wlanSignalQuality));
                                    returnValue = returnValue.Replace(Settings.Default.wifiChannelDetailsKey, wifiInfo);
                                }
                                else
                                {
                                    wifiList = Settings.Default.wifiChannelTable;
                                    wifiList = wifiList.Replace("{$channelNumber$}", getChannelNumber(client, GetStringForSSID(network.dot11Ssid)).ToString());
                                    var channelListProgress = "<div class='progress' style='width:200px !important'><div class='progress-bar progress-bar-info' role='progressbar' aria-valuenow='" + network.numberOfBssids.ToString() + "' aria-valuemin='0' aria-valuemax='13' style='width: " + network.numberOfBssids.ToString() + "%'><span style='color:black;'>" + network.numberOfBssids.ToString() + "</span></div></div>";
                                    wifiList = wifiList.Replace("{$numberofNetworks$}", channelListProgress);
                                    wifiList = wifiList.Replace("{$channelQuality$}", signalQuality(network.wlanSignalQuality));
                                    wifidetails = wifidetails + wifiList;

                                }
                                wifiName += GetStringForSSID(network.dot11Ssid) + ",";
                                wifiValue.Add(wifiNm);
                            }
                        }
                    }
                    returnValue = (returnValue.Contains("{$wifiChannelDetails$}")) ? returnValue.Replace("{$wifiChannelDetails$}", "") : returnValue;
                    returnValue = returnValue.Replace(Settings.Default.wifiChannelListKey, wifidetails);
                }
            }
            catch (Exception) { returnValue = "false"; }

            return returnValue;
        }
        #endregion

        public void csscorpRedirection()
        {
            Process.Start("https://www.csscorp.com/");
        }
        public void modelSearchRedirection()
        {
            Process.Start("http://support.netgear.com/general/find_model_number/");
        }

        public void redirectToproductUpgrade(string url)
        {
            Process.Start(url);
        }

        public string getKBProductDetails(string clientName, string id)
        {
            string productFamilyList = string.Empty;
            string url = string.Empty;
            try
            {
                if (ConfigurationManager.AppSettings["DeploymentType"] == "L")
                {
                    url = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), ((clientName == "Activei") ? clientName : "GearHead Connect"), strCurrentVersion, (((clientName == "Activei") ? clientName : "GearHeadConnect") + "Offline\\assets\\StaticResources\\NGProductDetails.txt"));
                }
                else
                {
                    url = ConfigurationManager.AppSettings["KbProductList"];
                }

                WebClient clients = new WebClient();
                string html = clients.DownloadString(url);

                using (StringReader reader = new StringReader(html))
                {
                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        string[] productDetails = null;
                        if (line.Contains("#"))
                        {
                            productDetails = line.Split('#');
                        }
                        if (productDetails != null && productDetails[0].ToLower().Equals(id.ToLower()))
                        {
                            productFamilyList = productDetails.Count() == 2 ? productDetails[1] : "<option value=\"-1\">No Items Found</option>";
                            break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "getKBProductDetails", "", ex.Message, ex.StackTrace, "ERROR");
            }

            return productFamilyList.Trim();
        }
        #region "Defragmentation"

        #endregion

        #region GetWiFiDetails
        /// <summary>
        /// Getting Wifi Details
        /// Connection Name
        /// Signal Strength
        /// Connection Status
        /// Mac Id
        /// RSSID
        /// BSS Type
        /// Default Authentication Algorithm
        /// Cipher Authentication Algorithm
        /// </summary>
        /// <returns>Wifi Details as Table</returns>
        public string getWiFiDetails()
        {
            string returnValue = "false";
            List<string> wifiValue = new List<string>();
            try
            {
                string wifidetails = string.Empty;
                foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
                {
                    NativeWifi.Wlan.WlanBssEntry[] wlanBssEntries = wlanIface.GetNetworkBssList();
                    foreach (NativeWifi.Wlan.WlanBssEntry network in wlanBssEntries)
                    {
                        string wifiNm = (GetStringForSSID(network.dot11Ssid) != "") ? GetStringForSSID(network.dot11Ssid) : "Unknown Wi-Fi";
                        var comparisons = wifiValue.Any(x => string.Compare(x, wifiNm, StringComparison.OrdinalIgnoreCase) == 0);
                        if (!comparisons)
                        {
                            byte[] macAddr = network.dot11Bssid;
                            string tMac = "";
                            foreach (byte part in network.dot11Bssid)
                            {
                                tMac += (tMac.Length > 0 ? "-" : "") + (part < 16 ? "0" : "") + part.ToString("X", CultureInfo.InvariantCulture);
                            }
                            string wifiInfo = Settings.Default.wifidetails.Replace("{$name$}", wifiNm);
                            var htmlInput = loadProgressBar(getSignalQuality(client, GetStringForSSID(network.dot11Ssid)));
                            wifiInfo = wifiInfo.Replace("{$strength$}", htmlInput);
                            var connectImg = chkNetworkConnected(client, GetStringForSSID(network.dot11Ssid));
                            wifiInfo = wifiInfo.Replace("{$status$}", connectImg);
                            wifiInfo = wifiInfo.Replace("{$MacId$}", tMac);
                            wifiInfo = wifiInfo.Replace("{$Rssid$}", network.rssi.ToString());
                            wifiInfo = wifiInfo.Replace("{$BSSType$}", network.dot11BssType.ToString());
                            wifiInfo = wifiInfo.Replace("{$AuthAlgorithm$}", getDefaultAlgorithm(client, GetStringForSSID(network.dot11Ssid)));
                            wifiInfo = wifiInfo.Replace("{$CipherAlgorithm$}", getCipherAlgorithm(client, GetStringForSSID(network.dot11Ssid)));
                            wifidetails = wifidetails + wifiInfo;
                            wifiValue.Add(wifiNm);
                        }
                    }
                    returnValue = Settings.Default.wifitemplate.Replace(Settings.Default.wifidetailsKey, wifidetails);
                }

            }
            catch (Exception)
            {

            }

            return returnValue;
        }
        #endregion
        #region GetChannelFromFrequency
        /// <summary>
        /// Get Channel from Frequency
        /// </summary>
        /// <param name="frequency">frequency value</param>
        /// <returns>channel number</returns>
        private uint getChannelFromFrequency(uint frequency)
        {
            switch (frequency / 1000)
            {
                case 2412: return 1;
                case 2417: return 2;
                case 2422: return 3;
                case 2427: return 4;
                case 2432: return 5;
                case 2437: return 6;
                case 2442: return 7;
                case 2447: return 8;
                case 2452: return 9;
                case 2457: return 10;
                case 2462: return 11;
                case 2467: return 12;
                case 2472: return 13;
                case 2484: return 14;
                default: return 15;
            }
        }
        #endregion

        #region GetSignalQuality
        /// <summary>
        /// Get Wifi Signal Quality 
        /// </summary>
        /// <param name="client">Native Wifi Client Object</param>
        /// <param name="connectionName">Wifi Connection Name</param>
        /// <returns>uint signal value</returns>
        private uint getSignalQuality(NativeWifi.WlanClient client, string connectionName)
        {
            uint i = 0;
            foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
            {
                NativeWifi.Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                foreach (NativeWifi.Wlan.WlanAvailableNetwork network in networks)
                {
                    if (connectionName == GetStringForSSID(network.dot11Ssid))
                    {
                        i = network.wlanSignalQuality;
                    }
                }
            }
            return i;
        }
        #endregion

        #region LoadProgressBar
        /// <summary>
        /// Load Progress Bar
        /// </summary>
        /// <param name="signalStrength">Signal Strength</param>
        /// <returns>Render progressbar div as string</returns>
        private string loadProgressBar(uint signalStrength)
        {
            string progressBarDiv = string.Empty;
            if (signalStrength <= 40)
            {
                progressBarDiv = "<div class='progress'><div class='progress-bar progress-bar-danger' role='progressbar' aria-valuenow='" + signalStrength.ToString() + "' aria-valuemin='0' aria-valuemax='100' style='width: " + signalStrength + "%'><span>" + signalStrength.ToString() + "%</span></div></div>";
            }
            else if (signalStrength <= 60)
            {
                progressBarDiv = "<div class='progress'><div class='progress-bar progress-bar-warning' role='progressbar' aria-valuenow='" + signalStrength.ToString() + "' aria-valuemin='0' aria-valuemax='100' style='width: " + signalStrength + "%'><span>" + signalStrength.ToString() + "%</span></div></div>";
            }
            else if (signalStrength <= 100)
            {
                progressBarDiv = "<div class='progress'><div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='" + signalStrength.ToString() + "' aria-valuemin='0' aria-valuemax='100' style='width: " + signalStrength + "%'><span>" + signalStrength.ToString() + "%</span></div></div>";
            }
            return progressBarDiv;
        }
        #endregion

        #region Signal Quality with no float
        /// <summary>
        /// Load Signal Quality
        /// </summary>
        /// <param name="quality">Quality</param>
        /// <returns>Signal Quality</returns>
        private string signalQuality(uint quality)
        {
            string progressBarDiv = string.Empty;
            if (quality <= 40)
            {
                progressBarDiv = "<label class='col-sm-3 control-label' style='color:red;'>POOR</label>";
            }
            else if (quality <= 60)
            {
                progressBarDiv = "<label class='col-sm-3 control-label' style='color:yellow;'>GOOD</label>";
            }
            else if (quality <= 100)
            {
                progressBarDiv = "<label class='col-sm-3 control-label' style='color:green;'>GREAT</label>";
            }
            return progressBarDiv;
        }
        #endregion

        #region Get Channel Number
        /// <summary>
        /// Get Channel Number
        /// </summary>
        /// <param name="client">Native Wifi Client object</param>
        /// <param name="connectionName">Wifi Connection Name</param>
        /// <returns>Getting Channel Number</returns>
        public uint getChannelNumber(NativeWifi.WlanClient client, string connectionName)
        {
            uint channel = 0;
            foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
            {
                NativeWifi.Wlan.WlanBssEntry[] wlanBssEntries = wlanIface.GetNetworkBssList();
                foreach (NativeWifi.Wlan.WlanBssEntry network in wlanBssEntries)
                {
                    if (connectionName == GetStringForSSID(network.dot11Ssid))
                    {
                        channel = getChannelFromFrequency(network.chCenterFrequency);
                        break;
                    }

                }
            }
            return channel;
        }
        #endregion

        #region ChkNetworkConnected
        /// <summary>
        /// Check Network Connected
        /// </summary>
        /// <param name="client">Native Wifi Client object</param>
        /// <param name="connectionName">Wifi Connection Name</param>
        /// <returns>Connected /Disconnected Image in string format</returns>
        private string chkNetworkConnected(NativeWifi.WlanClient client, string connectionName)
        {
            string connectDisConnect = string.Empty;
            foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
            {

                NativeWifi.Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                foreach (NativeWifi.Wlan.WlanAvailableNetwork network in networks)
                {
                    if (connectionName == GetStringForSSID(network.dot11Ssid))
                    {
                        connectDisConnect = (network.flags.ToString().Contains("Connected")) ? "<img src='assets/Content/img/wifiConnect.png' alt='' />" : "<img src='assets/Content/img/wifiDisconnect.png' alt='' />";
                        break;
                    }
                }
            }
            return connectDisConnect;
        }
        #endregion

        #region GetDefaultAlgorithm
        /// <summary>
        /// Get Default Algorithm Pattern
        /// </summary>
        /// <param name="client">Native Wifi Client object</param>
        /// <param name="connectionName">Wifi Connection Name</param>
        /// <returns>Default Algorithm Pattern as String format</returns>
        private string getDefaultAlgorithm(NativeWifi.WlanClient client, string connectionName)
        {
            string defaultAlgorithm = string.Empty;
            foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
            {
                NativeWifi.Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                foreach (NativeWifi.Wlan.WlanAvailableNetwork network in networks)
                {
                    if (connectionName == GetStringForSSID(network.dot11Ssid))
                    {
                        defaultAlgorithm = network.dot11DefaultAuthAlgorithm.ToString();
                        break;
                    }
                }
            }
            return defaultAlgorithm;
        }
        #endregion

        #region GetCipherAlgorithm
        /// <summary>
        /// Get Cipher Algorithm Pattern
        /// </summary>
        /// <param name="client">Native Wifi Client object</param>
        /// <param name="connectionName">Wifi Connection Name</param>
        /// <returns>Cipher Algorithm Pattern as string format</returns>
        private string getCipherAlgorithm(NativeWifi.WlanClient client, string connectionName)
        {
            string cipherAlgorithm = string.Empty;
            foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
            {
                NativeWifi.Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                foreach (NativeWifi.Wlan.WlanAvailableNetwork network in networks)
                {

                    if (connectionName == GetStringForSSID(network.dot11Ssid))
                    {
                        cipherAlgorithm = network.dot11DefaultCipherAlgorithm.ToString();
                        break;
                    }
                }
            }
            return cipherAlgorithm;
        }
        #endregion

        #region Render Wifi Graph
        /// <summary>
        /// Get Wifi Graph
        /// </summary>
        /// <returns>Graph Details Wifi Name Dbm Value</returns>
        public string getWiFiGraph()
        {
            string returnValue = "";
            try
            {
                foreach (NativeWifi.WlanClient.WlanInterface wlanIface in client.Interfaces)
                {
                    NativeWifi.Wlan.WlanBssEntry[] wlanBssEntries = wlanIface.GetNetworkBssList();
                    foreach (NativeWifi.Wlan.WlanBssEntry network in wlanBssEntries)
                    {
                        if (!returnValue.Contains(GetStringForSSID(network.dot11Ssid)))
                        {
                            returnValue += (GetStringForSSID(network.dot11Ssid) != "") ? GetStringForSSID(network.dot11Ssid) + ',' + network.rssi + ',' : "Unknown Wifi" + ',' + network.rssi + ',';
                        }
                    }
                }
                if (returnValue == "")
                {
                    returnValue = "false";
                }
            }
            catch (Exception)
            {
                if (returnValue == "")
                {
                    returnValue = "false";
                }
            }

            return returnValue;
        }
        #endregion

        public string fixAntivirusClean(string selectedVirus)
        {
            try
            {
                List<object> virusList = new List<object>();
                List<VirusDetails> selectedvirusDetails = JsonConvert.DeserializeObject<List<VirusDetails>>(selectedVirus);
                foreach (var item in selectedvirusDetails)
                {
                    if (item.Check == true)
                    {
                        File.Delete(item.Path);
                        item.Virusstatus = "Deleted";
                        virusList.Add(item);
                    }
                }
                return JsonConvert.SerializeObject(virusList);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "fixAntivirusClean", "", ex.Message, ex.StackTrace, "ERROR");
                throw ex;
            }
        }


        private List<string> selectedDrive = null;
        private BackgroundWorker uxAntivirusScanWorker = null;
        public int scanvalue = 0;
        public string selectedDriveList = null;
        public string scanFile = null;
        public void doAntiVirusScan(int scanval, string selectedDriveLists = null, string scanFiles = null)
        {
            try
            {
                selectedDriveList = selectedDriveLists;
                scanvalue = scanval;
                scanFile = scanFiles;
                if (uxAntivirusScanWorker != null)
                {
                    if (uxAntivirusScanWorker.IsBusy)
                    {
                        uxAntivirusScanWorker.CancelAsync();
                    }
                    uxAntivirusScanWorker = null;
                }
                uxAntivirusScanWorker = new BackgroundWorker();
                uxAntivirusScanWorker.WorkerSupportsCancellation = true;
                uxAntivirusScanWorker.DoWork += new DoWorkEventHandler(bgw_scanDoWork);
                uxAntivirusScanWorker.ProgressChanged += new ProgressChangedEventHandler(bgw_ProgressChanged);
                uxAntivirusScanWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(bgw_RunWorkerCompleted);
                uxAntivirusScanWorker.WorkerReportsProgress = true;
                uxAntivirusScanWorker.RunWorkerAsync();

            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "doAntiVirusScan", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        public void resetAntivirus()
        {
            if (uxAntivirusScanWorker != null)
            {
                uxAntivirusScanWorker.CancelAsync();
            }
        }


        void bgw_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            //prgbarScan.Value = e.ProgressPercentage;
            //lblprogress.Text = String.Format("Progress: {0} %", e.ProgressPercentage);
        }
        public List<string> list = new List<string>();
        public List<VirusDetails> scanList = new List<VirusDetails>();


        public string getScandetails()
        {

            return JsonConvert.SerializeObject(scanList);
        }


        public string viewScannedFiles()
        {
            List<VirusDetails> lstVirusDetails = new List<VirusDetails>();
            foreach (var item in scanList)
            {
                VirusDetails virusDetails = new VirusDetails();
                virusDetails.Check = item.Check;
                virusDetails.IsVirus = item.IsVirus;
                virusDetails.VirusName = item.VirusName;
                virusDetails.Path = item.Path;
                virusDetails.Virusstatus = "Found";
                lstVirusDetails.Add(virusDetails);
            }
            return JsonConvert.SerializeObject(lstVirusDetails);
        }


        public class SelectedDriveeDetails
        {
            public bool IsSelected { get; set; }
            public string DriveName { get; set; }
        }

        List<SelectedDriveeDetails> lstSeledtedScanDrivedetails = new List<SelectedDriveeDetails>();

        void bgw_scanDoWork(object sender, DoWorkEventArgs e)
        {
            try
            {

                if (scanvalue == 2)
                {
                    lstSeledtedScanDrivedetails = JsonConvert.DeserializeObject<List<SelectedDriveeDetails>>(selectedDriveList);

                    foreach (var element in lstSeledtedScanDrivedetails)
                    {
                        string textplb = "Please wait," + ConfigSettings.ClientName + " is preparing for list of files to scan...";
                        chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + textplb + "');");
                        FileNames = GetFiles(element.DriveName, "*", e).ToArray();
                        string textplbinit = ConfigSettings.ClientName + " virus scan is initializing...";
                        chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + textplbinit + "');");
                    }
                }
                else if (scanvalue == 1)
                {
                    string textplb = "Please wait," + ConfigSettings.ClientName + " is preparing for list of files to scan...";
                    chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + textplb + "');");
                    FileNames = GetFiles(Environment.GetFolderPath(Environment.SpecialFolder.System), "*", e).ToArray();
                    string textplbinit = ConfigSettings.ClientName + " virus scan is initializing...";
                    chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + textplbinit + "');");
                }
                else
                {
                    string textplb = "Please wait," + ConfigSettings.ClientName + " is preparing for list of files to scan...";
                    chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + textplb + "');");
                    FileNames = GetFiles(scanFile, "*", e).ToArray();
                    string textplbinit = ConfigSettings.ClientName + " virus scan is initializing...";
                    chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + textplbinit + "');");
                }
                int j = 1;
                scanList.Clear();
                foreach (string path in FileNames)
                {
                    list.Clear();
                    filename = path;
                    var clamVir = new ClamClient(hostname, portno);
                    ClamScanResult scanResult = clamVir.ScanFileOnServer(path);
                    if (uxAntivirusScanWorker.CancellationPending == true)
                    {
                        e.Cancel = true;
                        break;
                    }
                    switch (scanResult.Result)
                    {
                        case ClamScanResults.Clean:
                            string textfilescan = "File Scanned : " + path + "^^" + "Total Files Scanned : " + j;
                            chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + textfilescan + "');");
                            break;

                        case ClamScanResults.VirusDetected:
                            scanList.Add(new VirusDetails() { IsVirus = "Y", VirusName = scanResult.InfectedFiles.First().VirusName, Path = path });
                            break;
                        case ClamScanResults.Error:
                            break;
                    }
                    j++;
                }

            }
            catch (Exception ex)
            {
                e.Cancel = true;
                ErrorTracker.WriteErrorLog("MainWindow.cs", "bgw_scanDoWork", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        void bgw_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            //do the code when Backgroundwork completes its work            
            string conText = "";
            if (scanList.Count > 0)
            {
                conText = "No. of threats found : " + scanList.Count;
                string finalscanRes = conText + "^^^^" + JsonConvert.SerializeObject(scanList);
                chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + finalscanRes + "');");
            }
            else
            {
                conText = "No Threats Found";
                string finalRes = conText + "^^^^Completed";
                chromiumBrowser.ExecuteScript("javascript:setantivirusScannedFileDetails('" + finalRes + "');");
            }
        }

        public IEnumerable<string> GetFiles(string root, string searchPattern, DoWorkEventArgs e)
        {
            Stack<string> pending = new Stack<string>();
            pending.Push(root);
            while (pending.Count != 0)
            {
                if (uxAntivirusScanWorker.CancellationPending == true)
                {
                    e.Cancel = true;
                    break;
                }
                var path = pending.Pop();
                string[] next = null;
                try
                {
                    next = Directory.GetFiles(path, searchPattern);
                }
                catch { }
                if (next != null && next.Length != 0)
                    foreach (var file in next)
                    {
                        if (uxAntivirusScanWorker.CancellationPending == true)
                        {
                            e.Cancel = true;
                            break;
                        }
                        yield return file;
                    }
                try
                {
                    next = Directory.GetDirectories(path);
                    foreach (var subdir in next)
                    {
                        if (uxAntivirusScanWorker.CancellationPending == true)
                        {
                            e.Cancel = true;
                            break;
                        }
                        pending.Push(subdir);
                    }
                }
                catch (UnauthorizedAccessException)
                {
                    continue;
                }
            }
        }

        public string setStatusBarDetails()
        {
            try
            {
                string wanipaddress = "";
                isNetworkAvailable = System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable();
                if (isNetworkAvailable)
                {
                    var request = (HttpWebRequest)WebRequest.Create("http://checkip.dyndns.org");
                    request.UserAgent = "curl"; // this simulate curl linux command 
                    string publicIPAddress;
                    request.Method = "GET";
                    using (WebResponse response = request.GetResponse())
                    {
                        using (var reader = new StreamReader(response.GetResponseStream()))
                        {
                            publicIPAddress = reader.ReadToEnd();
                        }
                    }
                    // publicIPAddress = "<html><head><title>Current IP Check</title></head><body>Current IP Address: 115.114.95.200</body></html>";
                    string[] a = publicIPAddress.Split('>');

                    if (a[6].Contains("Current IP Address"))
                    {
                        string[] b = a[6].Split(':');
                        string[] c = b[1].Split('<');
                        wanipaddress = "WAN IP : " + c[0];
                    }
                    else
                    {
                        wanipaddress = "";
                    }
                }
                else
                {
                    wanipaddress = "";
                }
                return wanipaddress;
            }
            catch
            {
                return "";
            }

        }

        public void writeClientSideError(string controllerName, string methodName, string message, string clientName)
        {
            ErrorTracker.WriteClientErrorLog(controllerName, methodName, message, clientName);
        }

        public void setLoginDetails(String userName)
        {
            NetgearClientServiceSoapClient ngToolTrackingService = null;
            try
            {
                ngToolTrackingService = new NetgearClientServiceSoapClient();

                String uniqueID = ClickOnceHelper.GetUserUniqueID();

                ErrorTracker.WriteLog("MainWindow.cs :: SetLoginDetails : uniqueID : " + uniqueID);

                if (string.IsNullOrEmpty(uniqueID))
                {
                    ErrorTracker.WriteLog("MainWindow.cs :: SetLoginDetails : uniqueID not exists in app config.");
                    uniqueID = ngToolTrackingService.GetNetgearToolUniqueID();
                    ErrorTracker.WriteLog("MainWindow.cs :: SetLoginDetails : new uniqueID generated for login tracking.");
                }

                ngToolTrackingService.NetgearToolLoginDetails(uniqueID, userName, DateTime.Now);

                ngToolTrackingService = null;
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "SetLoginDetails", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        BackgroundWorker bw = new BackgroundWorker();
        string logDetails = string.Empty;

        void bw_DoWork(object sender, DoWorkEventArgs e)
        {
            if (!isNetworkAvail())
            {
                logTimer.Enabled = false;

                //Test
                // GetRouterCofigSettings();
                RestoreRouterBackup();
                //TestM
                if (IsValidIP())
                {
                    if (!IsPrivateIp())
                    {
                        //SendRouterStatus("PUBLICIP");
                        GearHeadMessageBox.Instance.Show("1. Check the Physical Connection between the PC and the router. 2. Check whether the modem is connected to the WAN(isolated) slot of the router. 3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route. 4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router. ", Globals.ProductName, MessageBoxButtons.OK);
                        //MessageBox.Show("1. Check the Physical Connection between the PC and the router. 2. Check whether the modem is connected to the WAN(isolated) slot of the router. 3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route. 4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router. ");
                    }
                    else
                    {
                        if (GetPingSuccessCount("routerlogin.net") == 4)
                        {

                            if (string.IsNullOrEmpty(logDetails))
                            {
                                //call router backup process
                                RestoreRouterBackup();
                                //if (!IsWanIP())
                                if (!((bool)IsWanIP()["IsWanIP"]))
                                {
                                    //SendRouterStatus("POWERCYCLE");
                                    //GearHeadMessageBox.Instance.Show("Power cycle your network", Globals.ProductName, MessageBoxButtons.OK);
                                    sbRouter.AppendLine("Power cycle your network");
                                }
                                else
                                {
                                    //MessageBox.Show("Your issue resolved...");
                                    //SendRouterStatus("PCONLINE");
                                    //GearHeadMessageBox.Instance.Show("Your issue resolved...", Globals.ProductName, MessageBoxButtons.OK);
                                    sbRouter.AppendLine("Your issue resolved...");
                                }
                            }
                            else
                            {
                                int logCount = LogDisconnectedCount(logDetails);
                                if (logCount > 0)
                                {
                                    if (logCount >= 5)
                                    {
                                        //sender log TokenAccessLevels product team
                                        //GearHeadMessageBox.Instance.Show("Log has been sent to Engineering team.", Globals.ProductName, MessageBoxButtons.OK);
                                        sbRouter.AppendLine("Log has been sent to Engineering team.");
                                    }
                                    else if (logCount != 1)
                                    {
                                        //call router backup process
                                        RestoreRouterBackup();
                                        //if (!IsWanIP())
                                        if (!((bool)IsWanIP()["IsWanIP"]))
                                        {
                                            //MessageBox.Show("Power cycle your network");
                                            //SendRouterStatus("POWERCYCLE");
                                            //GearHeadMessageBox.Instance.Show("Power cycle your network", Globals.ProductName, MessageBoxButtons.OK);
                                            sbRouter.AppendLine("Power cycle your network");
                                        }
                                        else
                                        {
                                            //SendRouterStatus("PCONLINE");
                                            //MessageBox.Show("Your issue resolved...");
                                            //GearHeadMessageBox.Instance.Show("Your issue resolved...", Globals.ProductName, MessageBoxButtons.OK);
                                            sbRouter.AppendLine("Your issue resolved...");
                                        }
                                    }
                                }

                            }
                        }
                        else
                        {
                            //MessageBox.Show("Hard & On/Off reset your route");
                            //SendRouterStatus("RESETROUTER");
                            //GearHeadMessageBox.Instance.Show("Hard & On/Off reset your router", Globals.ProductName, MessageBoxButtons.OK);
                            sbRouter.AppendLine("Hard & On/Off reset your router");

                        }
                    }
                }
                else
                {
                    //SendRouterStatus("AUTOCONFIG");
                    //MessageBox.Show("1. Check with direct connection from modem to PC.   if your online (PC LAN adapter status is good)then, 2. Connect the PC back to the router LAN Port. 3. Try to Swap the cable, 4. Check with different Ethernet cable, 5. Try with different LAN port, 6. Disable and Enable LAN adapter,");
                    GearHeadMessageBox.Instance.Show("1. Check with direct connection from modem to PC.   if your online (PC LAN adapter status is good)then, 2. Connect the PC back to the router LAN Port. 3. Try to Swap the cable, 4. Check with different Ethernet cable, 5. Try with different LAN port, 6. Disable and Enable LAN adapter", Globals.ProductName, MessageBoxButtons.OK);
                }
            }
            else
            {
                logTimer.Enabled = true;
            }


            //textBox1.Text = GetRouterLogDetails();
            //throw new NotImplementedException();
        }

        private void logTimer_Tick(object sender, EventArgs e)
        {
            //if (!bw.IsBusy)
            //    bw.RunWorkerAsync();
        }
    }
}

public class VirusDetails
{
    public bool Check { get; set; }
    public string IsVirus { get; set; }
    public string Path { get; set; }
    public string VirusName { get; set; }
    public string Virusstatus { get; set; }
}


public class LogDetails
{
    public string LogDetail { get; set; }
}




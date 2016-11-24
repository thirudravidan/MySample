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
using System.Threading;
using System.Net.Sockets;
using System.Timers;
using System.Net.Mail;
using System.Reflection;
using WUApiLib;
using System.Management;
using SystemVolume;

namespace Activei
{
    [PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
    [ComVisibleAttribute(true)]
    public partial class MainWindow : Form, IDefragmentation
    {
        [System.Runtime.InteropServices.DllImport("sensapi.dll")]
        static extern bool IsNetworkAlive(out int flags);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        static extern IntPtr SendMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);
        private const int APPCOMMAND_VOLUME_MUTE = 0x80000;
        private const int APPCOMMAND_VOLUME_UP = 0xA0000;
        private const int APPCOMMAND_VOLUME_DOWN = 0x90000;
        private const int WM_APPCOMMAND = 0x319;
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

        // Global Message Dictionary
        Dictionary<int, object[]> InvIPZoneMsg = new Dictionary<int, object[]>();
        Dictionary<int, object[]> NotPvtIPZoneMsg = new Dictionary<int, object[]>();
        Dictionary<int, object[]> PingCountFail = new Dictionary<int, object[]>();
        string strWaitMessage = "Checking Network Details...Please wait for 30 seconds...";
        TcpClient tcpSocket;
        string telnetEnableExepath = string.Empty;
        static bool isPrivateIPchecked = false;
        string routerMacAddress = string.Empty;
        string batFilePath = string.Empty;
        bool isCheckDoSAttack = false;
        bool isCheckWLANAccess = false;
        bool isIntremittentWifi = false;
        System.Timers.Timer aTimer = null;
        System.Timers.Timer wlanTimer = null;
        System.Timers.Timer wifiTimer = null;
        int dosAttackCnt = 0;
        int wlanProcess = 0;
        List<ConnectedDevices> lstConnectedDevices = new List<ConnectedDevices>();
        bool iswlanSuccess = false;
        NotifyIcon notifyIcon;
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
                //UpdateSessionClass uSession = new UpdateSessionClass();
                //IUpdateSearcher uSearcher = uSession.CreateUpdateSearcher();
                //ISearchResult uResult = uSearcher.Search("IsInstalled=0 and Type='Software'");

                //foreach (IUpdate update in uResult.Updates)
                //{
                //    Console.WriteLine(update.Title);
                //}
               
                if (SystemVolumChanger.IsMuted())
                {
                    SendMessage(this.Handle, WM_APPCOMMAND, this.Handle, (IntPtr)APPCOMMAND_VOLUME_MUTE);
                    SistemVolumChanger.SetVolume(50);
                }
                //string subKey = @"\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate";
                //using (RegistryKey key = Registry.LocalMachine.OpenSubKey(subKey, true))
                //{
                //    key.GetValue("AUoptions");
                //}

                AutomaticUpdatesClass auc = new AutomaticUpdatesClass();
                auc.Settings.NotificationLevel = AutomaticUpdatesNotificationLevel.aunlNotifyBeforeInstallation;
                auc.Settings.Save();
                auc.Settings.NotificationLevel.ToString();
                //AutomaticUpdates auc = new AutomaticUpdates();


                //bool active = auc.ServiceEnabled;
                //SendMessage(this.Handle, WM_APPCOMMAND, this.Handle, (IntPtr)APPCOMMAND_VOLUME_MUTE);
                //SendMessage(this.Handle, WM_APPCOMMAND, this.Handle, (IntPtr)APPCOMMAND_VOLUME_UP);                

                int ts = Convert.ToInt32((DateTime.Now.AddHours(2) - DateTime.Now).TotalSeconds.ToString());
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

                //Take Router Back up
                string hostName = string.Empty;
                if (GetPublicIPPingSuccessCount("google.com") == 1)
                {
                    hostName = GetDefaultGateway().ToString();
                    CreateTelnetBatFile(hostName);
                    RouterBackupusingTelnetClient(hostName, 23);
                }
                //else
                //{
                //    ErrorTracker.WriteLog("Bat file not created ...");
                //    RouterBackupusingTelnetClient(GetDefaultGateway().ToString(), 23);
                //}
                SetURl();
                //checkIntermittentWIFI();
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "MainWindow_Load", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        //Auto Heal RouterFunctionality
        #region "WLAN Rejected Email"

        /// <summary>
        /// Enable WLAN reject security threat and send mail to customer periodically
        /// </summary>
        public void createWLANEmailTicket()
        {
            try
            {
                if (Globals.ProductName.ToUpper() == clientName)
                {
                    wlanTimer = new System.Timers.Timer(Convert.ToDouble(ConfigurationManager.AppSettings["WLANPollingInterval"]));
                    // Hook up the Elapsed event for the timer. 
                    wlanTimer.Elapsed += Wlan_TimedEvent;
                    // Have the timer fire repeated events (true is the default)
                    wlanTimer.AutoReset = true;
                    // Start the timer
                    wlanTimer.Enabled = true;
                }
            }
            catch (Exception ex)
            {
                wlanTimer = null;
                ErrorTracker.WriteErrorLog("MainWindow.cs", "createWLANEmailTicket", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Check Router WLAN reject security threat and send mail to customer
        /// </summary>
        /// <param name="source"></param>
        /// <param name="e"></param>
        private void Wlan_TimedEvent(Object source, System.Timers.ElapsedEventArgs e)
        {
            try
            {
                if (!isCheckWLANAccess && !isIntremittentWifi)
                {
                    isCheckWLANAccess = true;
                    this.Invoke(new MethodInvoker(delegate
                    {
                        WLANAccessRejected();
                    }));
                    isCheckWLANAccess = false;
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "Wlan_TimedEvent", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        public void wlanEmailTicket()
        {
            try
            {
                this.Invoke(new MethodInvoker(delegate
                {
                    WLANAccessRejected();
                }));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void WLANAccessRejected()
        {
            string strLogDet = string.Empty;
            string wrPass = string.Empty;
            int routerStat;
            int WLANAccRejCnt;

            WirelessRouter wrBox;
            RouterMessageBox MsgBox;
            DialogResult msg1 = new DialogResult();
            DialogResult msg2 = new DialogResult();
            DialogResult msg3 = new DialogResult();
            DialogResult msg4 = new DialogResult();
            DialogResult msg5 = new DialogResult();

            DialogResult msg7 = new DialogResult();
            DialogResult msg8 = new DialogResult();

            try
            {
                //if (!isCheckWLANAccess)
                //{
                routerStat = routerAuthentication("admin", "password");
                //routerStat = 0;
                if (routerStat == 0)
                {
                    //DeleteBlockDeviceByMAC();
                    ConfigurationStart();
                    SetBlockDeviceByMAC();
                    ConfigurationFinished();
                    strLogDet = GetRouterLogDetails();
                    WLANAccRejCnt = GetDosAttackCount(strLogDet, ConfigurationManager.AppSettings["WLANAccessRejected"]);
                    string routerLogPath = CreateRouterLog(strLogDet, Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "RouterLogs"));

                    //strLogDet = string.Empty;
                    //WLANAccRejCnt = 4;
                    //string routerLogPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "RouterLogs") + "/" + "20160805122954057_RouterLog.txt";

                    Dictionary<string, string[]> dictMsgs = new Dictionary<string, string[]>();
                    dictMsgs.Add("msg1", new string[] { "Access to Wireless network"
                            , "One of the wireless devices at your place is trying to get connected with the wireless router and has been unsuccessful after 3 consecutive attempts." + Environment.NewLine + " Do you need any assistance to connect your device to the wireless network?"});
                    dictMsgs.Add("msg2", new string[] { "Connecting Wireless to the router"
                            , "1. From the Home screen, tap Menu, then Settings, and then Wireless and Networks." 
                            + Environment.NewLine +
                             Environment.NewLine +"2. Toggle the Wireless ON/OFF button to enable wireless."
                            + Environment.NewLine + Environment.NewLine +"3. Wireless icon  will be faded when the device is not connected to any network." 
                            + Environment.NewLine + Environment.NewLine +"4. The device will scan and list the available, nearby wireless networks."
                            + Environment.NewLine + Environment.NewLine +"5. Tap the name of wireless network to which you need to connect."
                            + Environment.NewLine + Environment.NewLine +"6. It will prompt for the password for authentication."
                            + Environment.NewLine + Environment.NewLine +"7. Enter the wireless password and tap connect."
                            + Environment.NewLine + Environment.NewLine +"8. If authentication succeeds, status will change as connected and icon will become bold."
                            + Environment.NewLine + Environment.NewLine +"9. Open the browser  and confirm internet access."
                            + Environment.NewLine + Environment.NewLine +"10. Did this solve your issue ?"
                    });
                    dictMsgs.Add("msg3", new string[] { "Connecting Wireless to the router"
                            , "Were you successful in connecting to the router wireless?" });
                    dictMsgs.Add("msg4", new string[] { "Thank You"
                            ,  "We thank you for your time!" });
                    dictMsgs.Add("msg5", new string[] { "Email Ticket Confirmation"
                            , "An Email ticket has been created successfully and your request has been forwarded to our support team. One of our support experts will get in touch with you shortly" });
                    dictMsgs.Add("msg7", new string[] { "Verify/Check Router Wireless"
                            , "Would you like to get any assistance from our technical support by reviewing your security settings?" });
                    dictMsgs.Add("msg8", new string[] { "Contact Support"
                            , "If you need any further assitance, you can also reach us at 1-888-SUPPORT" });
                    //WLANAccRejCnt = 4;
                    if (WLANAccRejCnt > 3)
                    {
                        wrBox = WirelessRouter.Instance;
                        MsgBox = RouterMessageBox.Instance;
                        wrPass = GetWirelessPassword();

                        if (!string.IsNullOrEmpty(wrPass))
                        {
                            //ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 5000);

                            msg1 = MsgBox.Show("we have noticed a new device trying to connect to your network. "
                                + Environment.NewLine + Environment.NewLine + "Do  you authorize this device ?", "Access to Wireless network", MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: false);
                            if (msg1 == DialogResult.Yes)
                            {
                                ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 30000);
                                msg2 = wrBox.Show(dictMsgs["msg2"][1], dictMsgs["msg1"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: false);
                                if (msg2 == DialogResult.Yes)
                                {
                                    ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 5000);
                                    iswlanSuccess = true; //Terminate the process in further subsequent process
                                    MsgBox.Show("We thank you for your time.", "Access to Wireless network", MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: false);
                                }
                                else
                                {
                                    iswlanSuccess = true; //Terminate the process in further subsequent process
                                    ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 5000);
                                    MsgBox.Show("You can contact support by calling the Toll Free Number on the top right of the screen or by chat or email .", "Access to Wireless network", MessageBoxButtons.OK, "Contact Support", "", "", isWanimg: false, isShowClose: false);
                                    chromiumBrowser.ExecuteScript("javascript:contactSupportAssistance()");
                                }

                            }
                            else
                            {
                                //DeleteBlockDeviceByMAC();
                                //SetBlockDeviceByMAC();
                                iswlanSuccess = true; //Terminate the process in further subsequent process
                                ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 5000);
                                MsgBox.Show("Please consider changing your  password periodically for your own safety", "Access to Wireless network", MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: false);
                                //RouterMessageBox.Instance.Show("If you need any further assitance, you can also reach us at 1-888-SUPPORT", "Contact Support", 5);
                            }
                        }


                        //if (!string.IsNullOrEmpty(wrPass))
                        //{
                        //    ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 5000);
                        //    msg1 = wrBox.Show(dictMsgs["msg2"][1], dictMsgs["msg1"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: false);
                        //    //msg1 = MsgBox.Show(dictMsgs["msg2"][1], dictMsgs["msg1"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: false);
                        //    if (msg1 == DialogResult.Yes)
                        //    {
                        //        iswlanSuccess = true; //Terminate the process in further subsequent process
                        //        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 5000);
                        //        MsgBox.Show("We thank you for your time.", "Access to Wireless network", MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
                        //    }
                        //    else
                        //    {
                        //        iswlanSuccess = true; //Terminate the process in further subsequent process
                        //        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Your wireless password is " + wrPass, 5000);
                        //        MsgBox.Show("If you need any further assitance, you can also reach us at 1-888-SUPPORT", "Access to Wireless network", MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
                        //        //RouterMessageBox.Instance.Show("If you need any further assitance, you can also reach us at 1-888-SUPPORT", "Contact Support", 5);
                        //    }
                        //}
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }


            //try
            //{
            //    //if (!isCheckWLANAccess)
            //    //{
            //    routerStat = routerAuthentication("admin", "password");
            //    //routerStat = 0;
            //    if (routerStat == 0)
            //    {

            //        strLogDet = GetRouterLogDetails();
            //        WLANAccRejCnt = GetDosAttackCount(strLogDet, ConfigurationManager.AppSettings["WLANAccessRejected"]);
            //        string routerLogPath = CreateRouterLog(strLogDet, Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "RouterLogs"));

            //        //strLogDet = string.Empty;
            //        //WLANAccRejCnt = 4;
            //        //string routerLogPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "RouterLogs") + "/" + "20160805122954057_RouterLog.txt";

            //        Dictionary<string, string[]> dictMsgs = new Dictionary<string, string[]>();
            //        dictMsgs.Add("msg1", new string[] { "Access to Wireless network"
            //                , "One of the wireless devices at your place is trying to get connected with the wireless router and has been unsuccessful after 3 consecutive attempts." + Environment.NewLine + " Do you need any assistance to connect your device to the wireless network?"});
            //        dictMsgs.Add("msg2", new string[] { "Connecting Wireless to the router"
            //                , "1.From the Home screen, tap Menu, then Settings, and then Wireless and Networks." + Environment.NewLine +"2.Select the Wi-Fi check box to turn your wireless ON." + Environment.NewLine + "3.The device will scan for available wireless networks."+ Environment.NewLine +"4.Tap Wi-Fi settings."+ Environment.NewLine +"5.Tap a Wi-Fi network to connect."+ Environment.NewLine +"6.Enter your wireless password and push on the connect."});
            //        dictMsgs.Add("msg3", new string[] { "Connecting Wireless to the router"
            //                , "Were you successful in connecting to the router wireless?" });
            //        dictMsgs.Add("msg4", new string[] { "Thank You"
            //                ,  "We thank you for your time!" });
            //        dictMsgs.Add("msg5", new string[] { "Email Ticket Confirmation"
            //                , "An Email ticket has been created successfully and your request has been forwarded to our support team. One of our support experts will get in touch with you shortly" });
            //        dictMsgs.Add("msg7", new string[] { "Verify/Check Router Wireless"
            //                , "Would you like to get any assistance from our technical support by reviewing your security settings?" });
            //        dictMsgs.Add("msg8", new string[] { "Contact Support"
            //                , "If you need any further assitance, you can also reach us at 1-888-SUPPORT" });

            //        if (WLANAccRejCnt > 3)
            //        {


            //            MsgBox = RouterMessageBox.Instance;

            //            msg1 = MsgBox.Show(dictMsgs["msg1"][1], dictMsgs["msg1"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: true);

            //            if (msg1 == DialogResult.Yes)
            //            {
            //                msg2 = MsgBox.Show(dictMsgs["msg2"][1], dictMsgs["msg2"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                if (msg2 == DialogResult.OK)
            //                {
            //                    msg3 = MsgBox.Show(dictMsgs["msg3"][1], dictMsgs["msg3"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: true);
            //                    if (msg3 == DialogResult.Yes)
            //                    {
            //                        msg4 = MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                    }
            //                    else if (msg3 == DialogResult.No)
            //                    {
            //                        msg7 = MsgBox.Show(dictMsgs["msg7"][1], dictMsgs["msg7"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: true);

            //                        if (msg7 == DialogResult.Yes)
            //                        {
            //                            msg5 = MsgBox.Show(dictMsgs["msg5"][1], dictMsgs["msg5"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                            sendmailWLAN(routerLogPath);
            //                            if (msg5 == DialogResult.OK)
            //                            {
            //                                msg4 = MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                            }
            //                        }
            //                        else if (msg7 == DialogResult.No)
            //                        {
            //                            msg8 = MsgBox.Show(dictMsgs["msg8"][1], dictMsgs["msg8"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                            if (msg8 == DialogResult.OK)
            //                            {
            //                                msg4 = MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                            }
            //                        }
            //                    }
            //                }
            //                else if (msg2 == DialogResult.No)
            //                {
            //                    msg7 = MsgBox.Show(dictMsgs["msg7"][1], dictMsgs["msg7"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: true);
            //                    if (msg7 == DialogResult.Yes)
            //                    {
            //                        msg5 = MsgBox.Show(dictMsgs["msg5"][1], dictMsgs["msg5"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: true);
            //                        sendmailWLAN(routerLogPath);
            //                        if (msg5 == DialogResult.OK)
            //                        {
            //                            msg4 = MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                        }
            //                    }
            //                    else if (msg7 == DialogResult.No)
            //                    {
            //                        msg8 = MsgBox.Show(dictMsgs["msg8"][1], dictMsgs["msg8"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);

            //                        if (msg8 == DialogResult.OK)
            //                        {
            //                            msg4 = MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                        }
            //                    }
            //                }
            //            }
            //            else if (msg1 == DialogResult.No)
            //            {
            //                msg7 = MsgBox.Show(dictMsgs["msg7"][1], dictMsgs["msg7"][0], MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: true);
            //                if (msg7 == DialogResult.Yes)
            //                {
            //                    msg5 = MsgBox.Show(dictMsgs["msg5"][1], dictMsgs["msg5"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                    sendmailWLAN(routerLogPath);
            //                    if (msg5 == DialogResult.OK)
            //                    {
            //                        msg4 = MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                    }
            //                }
            //                else if (msg7 == DialogResult.No)
            //                {
            //                    msg8 = MsgBox.Show(dictMsgs["msg8"][1], dictMsgs["msg8"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                    if (msg8 == DialogResult.OK)
            //                    {
            //                        msg4 = MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK, null, "", "", isWanimg: false, isShowClose: true);
            //                    }
            //                }
            //            }
            //        }
            //    }
            //}
            //catch (Exception)
            //{
            //    throw;
            //}
        }

        /// <summary>
        /// Send Maiul using SMTP Client
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="html"></param>
        private void sendmailWLAN(string attachment)
        {
            try
            {
                string bodyHtml = CreateTicketMailContentWLAN();
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient(ConfigurationManager.AppSettings["SmtpIp"]);
                mail.From = new MailAddress(ConfigurationManager.AppSettings["WLANFROM"]);
                mail.To.Add(Settings.Default.UserName);
                mail.CC.Add(ConfigurationManager.AppSettings["CC"]);
                mail.Bcc.Add(ConfigurationManager.AppSettings["Bcc"]);
                mail.Subject = ConfigurationManager.AppSettings["WLANMailSubject"];
                mail.Priority = MailPriority.High;
                mail.IsBodyHtml = true;
                mail.Body = bodyHtml;
                mail.Attachments.Add(new Attachment(attachment));
                //SmtpServer.Port = 587;
                //SmtpServer.Credentials = new System.Net.NetworkCredential("username", "password");
                SmtpServer.EnableSsl = false;
                SmtpServer.Send(mail);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "sendmail", "", ex.Message, ex.StackTrace, "ERROR");
            }

        }

        /// <summary>
        /// Generate mail body
        /// </summary>
        /// <returns></returns>
        public string CreateTicketMailContentWLAN()
        {

            StringBuilder sbRouter = new StringBuilder();
            sbRouter.Append("<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>");
            sbRouter.Append("<html xmlns='http://www.w3.org/1999/xhtml'>");
            sbRouter.Append("<head>");
            sbRouter.Append("<meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'/>");
            sbRouter.Append("<title>Router Mail</title>");
            sbRouter.Append("</head>");
            sbRouter.Append("<body>");
            sbRouter.Append("<table width='100%' border='0' cellspacing='0' cellpadding='0'>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>Hello Customer,<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>We have recently noticed that one of the wireless devices at your place is trying to get connected with the NETGEAR wireless router and has been unsuccessful after 3 consecutive attempts.<br>Attached is the copy of your router’s log for further confirmation of this activity.<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>Since you have opted to get further technical assistance for this issue, we have forwarded your <br> request to our technical support team.<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>For further reference, kindly have the copy of this email with Case # 12345.  One of our support experts will reach you shortly for providing further assistance.<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>Thanks for your time,");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>Technical support team.<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td><b>Note: This email is triggered automatically by our system, so please don’t respond to this email.</b><br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("</table>");
            sbRouter.Append("</body>");
            sbRouter.Append("</html>");
            return sbRouter.ToString();
        }

        /// <summary>
        /// Functionality used to get router wireless password
        /// </summary>
        /// <returns></returns>
        private static string GetWirelessPassword()
        {
            string strPass = string.Empty;
            try
            {
                XmlDocument doc = new XmlDocument();
                //GetLog
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><GetWPASecurityKeys>";
                strxmla += "</GetWPASecurityKeys></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:WLANConfiguration:1#GetWPASecurityKeys";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);
                string logDetails = string.Empty;
                if (result == 0)
                {
                    XmlNodeList wirelessPass = doc.GetElementsByTagName("NewWPAPassphrase");
                    strPass = wirelessPass[0].InnerText;
                }
                return strPass;
            }
            catch (Exception ex)
            {
                return strPass;
            }
        }

        private static string DeleteBlockDeviceByMAC()
        {
            string strPass = string.Empty;
            try
            {
                string mac = "5C95AEA41515";
                XmlDocument doc = new XmlDocument();
                //GetLog
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><DeleteBlockDeviceByMAC>";
                strxmla += "<NewMACAddress xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">0c1daffebb28</NewMACAddress>";
                //strxmla += "<NewBlockDeviceEnable xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">0</NewBlockDeviceEnable>";
                //strxmla += "<NewBlockStateByDefault xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">Block</NewBlockStateByDefault>";
                strxmla += "</DeleteBlockDeviceByMAC></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:1#DeleteBlockDeviceByMAC";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);
                string logDetails = string.Empty;
                if (result == 0)
                {
                    //XmlNodeList wirelessPass = doc.GetElementsByTagName("NewWPAPassphrase");
                    //strPass = wirelessPass[0].InnerText;
                }
                return strPass;
            }
            catch (Exception ex)
            {
                return strPass;
            }
        }

        /// <summary>
        /// Functionality used to get router wireless password
        /// </summary>
        /// <returns></returns>
        private static string SetBlockDeviceByMAC()
        {
            string strPass = string.Empty;
            try
            {


                string mac = "34:36:3B:93:1A:3A";
                XmlDocument doc = new XmlDocument();
                //GetLog
                //string strxmla = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>";
                //strxmla = "<SOAP-ENV:Envelope xmlns:SOAPSDK1=\"http://www.w3.org/2001/XMLSchema\" xmlns:SOAPSDK2=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:SOAPSDK3=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                strxmla += "<SessionID>58DEE6006A88A967E89A</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                //strxmla += "<SOAP-ENV:Body><M1:SetBlockDeviceByMAC xmlns:M1=\"urn:NETGEAR-ROUTER:service:DeviceConfig:1\">";
                //strxmla += "<NewAllowOrBlock>Block</NewAllowOrBlock>";
                //strxmla += "<NewMACAddress>34:36:3B:93:1A:3A</NewMACAddress>"; 
                strxmla += "<SOAP-ENV:Body><SetBlockDeviceByMAC>";
                strxmla += "<NewAllowOrBlock xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">Block</NewAllowOrBlock>";
                strxmla += "<NewMACAddress xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">34:36:3B:93:1A:3A</NewMACAddress>";
                //strxmla += "<NewMACAddress xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">4C:66:41:53:93:8A</NewMACAddress>";
                strxmla += "</SetBlockDeviceByMAC></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:1#SetBlockDeviceByMAC";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);
                string logDetails = string.Empty;
                if (result == 0)
                {
                    //XmlNodeList wirelessPass = doc.GetElementsByTagName("NewWPAPassphrase");
                    //strPass = wirelessPass[0].InnerText;
                }
                return strPass;
            }
            catch (Exception ex)
            {
                return strPass;
            }
        }

        #endregion

        #region "Create Email Ticket"

        /// <summary>
        /// Enable auto heal functionality periodically
        /// </summary>
        public void createEmailTicket()
        {
            try
            {
                if (Globals.ProductName.ToUpper() == clientName && Convert.ToBoolean(ConfigurationManager.AppSettings["IsEmaiTicket"]))
                {
                    aTimer = new System.Timers.Timer(Convert.ToDouble(ConfigurationManager.AppSettings["PollingInterval"]));
                    // Hook up the Elapsed event for the timer. 
                    aTimer.Elapsed += OnTimedEvent;
                    // Have the timer fire repeated events (true is the default)
                    aTimer.AutoReset = true;
                    // Start the timer
                    aTimer.Enabled = true;
                }
            }
            catch (Exception ex)
            {
                aTimer = null;
                ErrorTracker.WriteErrorLog("MainWindow.cs", "createEmailTicket", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Check Router Dos attack and send mail to customer
        /// </summary>
        /// <param name="source"></param>
        /// <param name="e"></param>
        private void OnTimedEvent(Object source, System.Timers.ElapsedEventArgs e)
        {
            string strLogDet = string.Empty;
            int routerStat;
            int dosAttCnt;
            try
            {
                //if (!isCheckWLANAccess)
                //{
                //    isCheckWLANAccess = true;
                //    WLANAccessRejected();
                //    isCheckWLANAccess = false;
                //}

                if (!isCheckDoSAttack)
                {
                    isCheckDoSAttack = true;
                    routerStat = routerAuthentication("admin", "password");
                    if (routerStat == 0)
                    {
                        strLogDet = GetRouterLogDetails();
                        dosAttCnt = GetDosAttackCount(strLogDet, ConfigurationManager.AppSettings["dosattacktext"]);
                        string routerlogpath = CreateRouterLog(strLogDet, Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "routerlogs"));
                        if (dosAttCnt >= Convert.ToInt32(ConfigurationManager.AppSettings["dosattackcnt"]))
                        {
                            // show ballon notifyicon.
                            if (dosAttCnt > dosAttackCnt)
                            {
                                ShowBaloonToolTip(Globals.ProductName, "activei.ico", ConfigurationManager.AppSettings["tooltipdesc"], Convert.ToInt32(ConfigurationManager.AppSettings["BaloonTipDelay"]));
                                if (GetPublicIPPingSuccessCount("google.com") == 1)
                                {
                                    dosAttackCnt = dosAttCnt;
                                    //mail functionality
                                    //sendmail(routerlogpath);
                                }
                                else
                                {
                                    ShowBaloonToolTip(Globals.ProductName, "activei.ico", ConfigurationManager.AppSettings["tooltipinternetdown"], Convert.ToInt32(ConfigurationManager.AppSettings["BaloonTipDelay"]));
                                }
                            }
                        }
                    }
                    isCheckDoSAttack = false;

                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "OnTimedEvent", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Ballon Tool tip
        /// </summary>
        /// <param name="title"></param>
        /// <param name="toolTipDesc"></param>
        /// <param name="icon"></param>
        private void ShowBaloonToolTip(string title, string icon, string toolTipDesc, int delay)
        {
            try
            {
                //NotifyIcon notifyIcon = new NotifyIcon();                
                if (notifyIcon == null)
                {
                    notifyIcon = new NotifyIcon();
                }
                else
                {
                    notifyIcon.Dispose();
                    notifyIcon = new NotifyIcon();
                }
                // The Icon property sets the icon that will appear
                // in the systray for this application.
                string iconPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\" + icon;
                notifyIcon.Icon = new Icon(iconPath);
                notifyIcon.BalloonTipIcon = ToolTipIcon.Info;
                //notifyIcon.Icon = SystemIcons.Warning;

                notifyIcon.Visible = true;
                // The Text property sets the text that will be displayed,
                // in a tooltip, when the mouse hovers over the systray icon.                
                notifyIcon.Text = "Notification from Activei";
                notifyIcon.BalloonTipText = toolTipDesc;
                notifyIcon.BalloonTipTitle = title;
                notifyIcon.ShowBalloonTip(delay);
                notifyIcon.BalloonTipClosed += (sender, e) =>
                {
                    var thisIcon = (NotifyIcon)sender;
                    thisIcon.Visible = false;
                    thisIcon.Dispose();
                    //notifyIcon.Dispose();
                };
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "ShowBaloonToolTip", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Read router log and Create file
        /// </summary>
        /// <param name="strLogDet"></param>
        /// <param name="filePath"></param>
        /// <returns></returns>
        private string CreateRouterLog(string strLogDet, string filePath)
        {
            string filDirectory = string.Empty;
            try
            {
                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }

                string currentDate = DateTime.Now.ToString("yyyyMMddHHmmssfff");

                filDirectory = filePath + @"\" + currentDate + "_RouterLog.txt";
                if (!string.IsNullOrEmpty(strLogDet) && filDirectory != "")
                {
                    using (System.IO.StreamWriter file =
        new System.IO.StreamWriter(filDirectory))
                    {
                        using (StringReader reader = new StringReader(strLogDet))
                        {
                            string logdet;
                            while ((logdet = reader.ReadLine()) != null)
                            {
                                file.WriteLine(logdet);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "CreateRouterLog", "", ex.Message, ex.StackTrace, "ERROR");
            }
            return filDirectory;
        }

        /// <summary>
        /// Check the DoS Attack count from Router Log
        /// </summary>
        /// <param name="logDetails"></param>
        /// <returns></returns>
        private int GetDosAttackCount(string logDetails, string logSearch)
        {
            int disCnt = 0;
            try
            {
                string[] loglist = logDetails.Split(new string[] { "\n" }, StringSplitOptions.None);
                Regex regex = new Regex(@"\[DoS Attack: (.*?)\]");
                Match mat = regex.Match(logDetails);
                using (StringReader reader = new StringReader(logDetails))
                {
                    string logdet;
                    while ((logdet = reader.ReadLine().ToUpper()) != null)
                    {
                        if (logdet.Contains(logSearch.ToUpper()))
                        {
                            disCnt += 1;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "GetDosAttackCount", "", ex.Message, ex.StackTrace, "ERROR");
            }
            return disCnt;
        }

        /// <summary>
        /// Send Maiul using SMTP Client
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="html"></param>
        private void sendmail(string attachment)
        {
            try
            {
                string bodyHtml = CreateTicketMailContent();
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient(ConfigurationManager.AppSettings["SmtpIp"]);
                mail.From = new MailAddress(ConfigurationManager.AppSettings["FROM"]);
                mail.To.Add(Settings.Default.UserName);
                mail.CC.Add(ConfigurationManager.AppSettings["CC"]);
                mail.Bcc.Add(ConfigurationManager.AppSettings["Bcc"]);
                mail.Subject = ConfigurationManager.AppSettings["MailSubject"];
                mail.Priority = MailPriority.High;
                mail.IsBodyHtml = true;
                mail.Body = bodyHtml;
                mail.Attachments.Add(new Attachment(attachment));
                //SmtpServer.Port = 587;
                //SmtpServer.Credentials = new System.Net.NetworkCredential("username", "password");
                SmtpServer.EnableSsl = false;
                SmtpServer.Send(mail);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "sendmail", "", ex.Message, ex.StackTrace, "ERROR");
            }

        }

        /// <summary>
        /// Generate mail body
        /// </summary>
        /// <returns></returns>
        public string CreateTicketMailContent()
        {

            StringBuilder sbRouter = new StringBuilder();
            sbRouter.Append("<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>");
            sbRouter.Append("<html xmlns='http://www.w3.org/1999/xhtml'>");
            sbRouter.Append("<head>");
            sbRouter.Append("<meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'/>");
            sbRouter.Append("<title>Router Mail</title>");
            sbRouter.Append("</head>");
            sbRouter.Append("<body>");
            sbRouter.Append("<table width='100%' border='0' cellspacing='0' cellpadding='0'>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>Hi Team,<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>This is to bring your attention that there is " + ConfigurationManager.AppSettings["DosAttackText"] + " found in your Netgear router R7500v2. An copy of this e-mail has been send to customer at " + Settings.Default.UserName + " and an E-mail ticket has been raised to " + ConfigurationManager.AppSettings["CC"] + ". Wait for the response from Support.<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("<tr>");
            sbRouter.Append("<td>Please find attached the router log for your reference.<br>");
            sbRouter.Append("<br></td>");
            sbRouter.Append("</tr>");
            sbRouter.Append("</table>");
            sbRouter.Append("</body>");
            sbRouter.Append("</html>");
            return sbRouter.ToString();
        }

        #endregion

        #region "Intermittent WIFI"

        public void checkWIFI()
        {
            try
            {
                if (Globals.ProductName.ToUpper() == clientName)
                {
                    wifiTimer = new System.Timers.Timer(Convert.ToDouble(ConfigurationManager.AppSettings["WIFIPollingInterval"]));
                    // Hook up the Elapsed event for the timer. 
                    wifiTimer.Elapsed += Wifi_TimedEvent;
                    // Have the timer fire repeated events (true is the default)
                    wifiTimer.AutoReset = true;
                    // Start the timer
                    wifiTimer.Enabled = true;
                }
            }
            catch (Exception ex)
            {
                wifiTimer = null;
                ErrorTracker.WriteErrorLog("MainWindow.cs", "checkWIFI", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Check Router WLAN reject security threat and send mail to customer
        /// </summary>
        /// <param name="source"></param>
        /// <param name="e"></param>
        private void Wifi_TimedEvent(Object source, System.Timers.ElapsedEventArgs e)
        {
            try
            {
                //if (!isIntremittentWifi && !isCheckWLANAccess)
                //{
                //    isIntremittentWifi = true;
                //    this.Invoke(new MethodInvoker(delegate
                //    {
                //        checkIntermittentWIFI();
                //    }));
                //    isIntremittentWifi = false;
                //}

                //WLAN Email
                if (wlanProcess == 0 || wlanProcess == 2)
                {
                    if (!isCheckWLANAccess && !isIntremittentWifi)
                    {
                        isCheckWLANAccess = true;
                        if (!iswlanSuccess)
                        {
                            //this.Invoke(new MethodInvoker(delegate
                            //{
                            //    WLANAccessRejected();
                            //}));
                            WLANAccessRejected();
                        }
                        wlanProcess = 1;
                        isCheckWLANAccess = false;
                    }
                }

                //Firmware upgrade
                if (wlanProcess == 1)
                {
                    if (!isIntremittentWifi && !isCheckWLANAccess)
                    {
                        isIntremittentWifi = true;
                        //this.Invoke(new MethodInvoker(delegate
                        //{
                        //    checkIntermittentWIFI(false);
                        //}));
                        checkIntermittentWIFI(false);
                        wlanProcess = 2;
                        isIntremittentWifi = false;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "Wifi_TimedEvent", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        void FirmwareUpgrade()
        {

            BackgroundWorker bw = new BackgroundWorker();
            bw.WorkerSupportsCancellation = true;
            bw.DoWork += new DoWorkEventHandler(bw_upgradefirmware);
            //bw.RunWorkerCompleted += new RunWorkerCompletedEventHandler(bwUpgradefirmware_RunWorkerCompleted);
            bw.WorkerReportsProgress = true;
            bw.RunWorkerAsync();
            //RouterMessageBox.Instance.Show("New firmware needs to updated on the router. Downloading the latest firmware version from the support website.", "Alert - Intermittent wireless connection!", 180);
            //RouterMessageBox.Instance.Show("Firmware upgrade is in progress… Do not unplug any cables from your modem or router.", "Alert - Intermittent wireless connection!", 120);

        }

        void bw_upgradefirmware(object sender, DoWorkEventArgs e)
        {
            ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few time...Upgrade start", 300000);
            //Upgrade firmware   
            Updatefirmware();
        }

        //private void bwUpgradefirmware_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        //{
        //    try
        //    {
        //        MessageBox.Show("Upgrade completed");
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorTracker.WriteErrorLog("MainWindow.cs", "bwUpgradefirmware_RunWorkerCompleted", "", ex.Message, ex.StackTrace, "ERROR");
        //    }
        //}
        public void intermittenWIFI()
        {
            //this.Invoke(new MethodInvoker(delegate
            //{
            //    checkIntermittentWIFI(true);
            //}));
            checkIntermittentWIFI(true);
        }

        //public void getConnectedDevices()
        public void getConnectedDevices(List<ConnectedDevices> lstDeviceinfo)
        {
            int routerStat = 0;
            string strLogDet = string.Empty;
            bool isExecuted = false;
            List<ConnectedDevices> newConnectedDev = new List<ConnectedDevices>();
            List<ConnectedDevices> disConnectedDev = new List<ConnectedDevices>();
            List<ConnectedDevices> connectedDev = new List<ConnectedDevices>();
            List<ConnectedDevices> allDevices = new List<ConnectedDevices>();
            //List<ConnectedDevices> lstDeviceinfo = new List<ConnectedDevices>();
            //routerStat = routerAuthentication("admin", "password");
            //if (routerStat == 0)
            //{
            //    string hostName = GetDefaultGateway().ToString();
            //    strLogDet = GetRouterLogDetails();
            //    lstDeviceinfo = GetAttachedDevices().Where(x => x.DevType.ToUpper() != "WIRED").ToList<ConnectedDevices>();
            //}
            if (lstConnectedDevices.Count > 0)
            {
                isExecuted = true;
                //Getting connected device
                var connectDev = from curdev in lstDeviceinfo
                                 join conDev in lstConnectedDevices on curdev.MAC equals conDev.MAC
                                 //where !conDev.isDisConnected
                                 select new ConnectedDevices
                                 {
                                     IP = conDev.IP,
                                     Name = conDev.Name,
                                     MAC = conDev.MAC,
                                     DevType = conDev.DevType,
                                     LinkRate = conDev.LinkRate,
                                     ConnectedCnt = ((!conDev.isDisConnected) ? conDev.ConnectedCnt : conDev.ConnectedCnt + 1),
                                     DisConnectedCnt = conDev.DisConnectedCnt,
                                     WifiTimeDet = (!conDev.isDisConnected) ? conDev.WifiTimeDet : GetConDev(conDev.WifiTimeDet),
                                 };
                connectedDev = connectDev.ToList();

                //Getting new connected device
                var lstNewDev = from curdev in lstDeviceinfo
                                where !lstConnectedDevices.Any(x => x.MAC == curdev.MAC)
                                select curdev;
                newConnectedDev = lstNewDev.ToList();

                //Getting the disconnected device
                var disDev = from disdev in lstConnectedDevices
                             where !lstDeviceinfo.Any(x => x.MAC == disdev.MAC)
                             select new ConnectedDevices
                             {
                                 IP = disdev.IP,
                                 Name = disdev.Name,
                                 MAC = disdev.MAC,
                                 DevType = disdev.DevType,
                                 LinkRate = disdev.LinkRate,
                                 ConnectedCnt = disdev.ConnectedCnt,
                                 WifiTimeDet = (from wifitime in disdev.WifiTimeDet
                                                select new IntermittenFreq
                                                {
                                                    //ConnectedTime = disdev.WifiTimeDet[(disdev.ConnectedCnt - 1)].ConnectedTime,
                                                    //DisConnectedTime = (disdev.ConnectedCnt > disdev.DisConnectedCnt) ? DateTime.Now : disdev.WifiTimeDet[(disdev.ConnectedCnt - 1)].DisConnectedTime,
                                                    //TimeDiff = (disdev.ConnectedCnt > disdev.DisConnectedCnt) ? Convert.ToInt32((DateTime.Now - disdev.WifiTimeDet[(disdev.ConnectedCnt - 1)].ConnectedTime).TotalSeconds) : disdev.WifiTimeDet[(disdev.ConnectedCnt - 1)].TimeDiff
                                                    ConnectedTime = wifitime.ConnectedTime,
                                                    DisConnectedTime = (wifitime.DisConnectedTime == null) ? DateTime.Now : wifitime.DisConnectedTime,
                                                    TimeDiff = (wifitime.TimeDiff == 0) ? Convert.ToInt32((DateTime.Now - wifitime.ConnectedTime).TotalSeconds) : wifitime.TimeDiff

                                                }).ToList(),
                                 DisConnectedCnt = (disdev.ConnectedCnt > disdev.DisConnectedCnt) ? disdev.DisConnectedCnt + 1 : disdev.DisConnectedCnt,
                                 isDisConnected = true
                             };
                disConnectedDev = disDev.ToList();
                allDevices = (connectedDev.Concat(newConnectedDev).Concat(disConnectedDev)).ToList();
            }
            lstConnectedDevices = (!isExecuted) ? lstDeviceinfo : allDevices.ToList();

            //List<ConnectedDevices> lstDev = lstConnectedDevices.Where(x => x.DisConnectedCnt >= Convert.ToInt32(ConfigurationManager.AppSettings["inetrmittentWificnt"])).ToList();
            //TimeDiffDev lstt = new TimeDiffDev();
            //if (lstDev.Count >= 1)
            //{
            //    lstt = (from dev in lstDev
            //            from tim in dev.WifiTimeDet
            //            group tim by new { dev.MAC, dev.Name } into g
            //            select new TimeDiffDev { Mac = g.Key.MAC, Name = g.Key.Name, timediffer = g.Sum(x => x.TimeDiff) }).OrderBy(x => x.timediffer).First();
            //    //GroupBy(grp => new { grp.Mac, grp.Name }).Select(x => new TimeDiffDev { Mac=x.Key.Mac,Name=x.Key.Name,timediffer=x.Min(tt=>tt.timediffer)}).ToList();
            //    int val = lstt.timediffer;
            //}


        }
        public class TimeDiffDev
        {
            public string Mac { get; set; }
            public string Name { get; set; }
            public int timediffer { get; set; }
        }

        public List<IntermittenFreq> GetConDev(List<IntermittenFreq> lst)
        {
            lst.Add(new IntermittenFreq { ConnectedTime = DateTime.Now });
            return lst;
        }

        /// <summary>
        /// Functionality used to check the intermittent WIFI
        /// </summary>
        public void checkIntermittentWIFI(bool isClicked)
        {
            string strLogDet = string.Empty;
            int routerStat;
            RouterMessageBox MsgBox;
            DialogResult msg1 = new DialogResult();
            DialogResult msg2 = new DialogResult();

            int wifiCnt;
            bool isDisconnectedCheck = false;

            //var json = GetResponseFromUrl();
            routerStat = routerAuthentication("admin", "password");
            if (routerStat == 0)
            {
                string hostName = GetDefaultGateway().ToString();

                //Checkfirmware();
                //Updatefirmware();
                //ConfigurationStart();

                //ConfigurationFinished();

                //int rescode = ConfigurationStart();
                //if (rescode == 0)
                //{
                //    Updatefirmware();
                //}
                //tcpSocket = CheckTelnetEnabled(hostName, 23);
                //if (tcpSocket.Connected)
                //{
                //    //ExecuteTelnetCommand("config set streamboost_enable=1");
                //    //ExecuteTelnetCommand("config set wl_plcphdr=" + ConfigurationManager.AppSettings["2_4Preamble"]);
                //    ////5GHz change Preamble mode
                //    //ExecuteTelnetCommand("config set wla_plcphdr=" + ConfigurationManager.AppSettings["5Preamble"]);
                //    //ExecuteTelnetCommand("config set basic_dynamic_page=both");
                //}
                //Checkfirmware();
                //Updatefirmware();

                //CheckFirmware
                //CheckQosStatus();
                //EnableQosStatus();
                //Dictionary<string, string> dicFirmwareDet1 = Checkfirmware();
                //if (dicFirmwareDet1 != null && dicFirmwareDet1.Count > 0)
                //{
                //    if (!string.IsNullOrEmpty(dicFirmwareDet1["NewVersion"]))
                //    {
                //        //Firmware upgrade
                //        Updatefirmware();
                //        //Softreboot
                //        ExecuteTelnetCommand("reboot");
                //    }
                //}               

                strLogDet = GetRouterLogDetails();
                List<ConnectedDevices> lstDeviceinfo = GetAttachedDevices().Where(x => x.DevType.ToUpper() != "WIRED").ToList<ConnectedDevices>();
                getConnectedDevices(lstDeviceinfo);
                //Log Process
                //isDisconnectedCheck = lstConnectedDevices.Any(x => x.DisConnectedCnt >= Convert.ToInt32(ConfigurationManager.AppSettings["inetrmittentWificnt"]));

                List<ConnectedDevices> disDev = lstConnectedDevices.Where(x => x.DisConnectedCnt >= Convert.ToInt32(ConfigurationManager.AppSettings["inetrmittentWificnt"])).ToList();
                TimeDiffDev grpdDev = null;
                if (disDev.Count >= 1)
                {
                    grpdDev = (from dev in disDev
                               from tim in dev.WifiTimeDet
                               group tim by new { dev.MAC, dev.Name } into g
                               select new TimeDiffDev { Mac = g.Key.MAC, Name = g.Key.Name, timediffer = g.Sum(x => x.TimeDiff) }).OrderBy(x => x.timediffer).First();
                    //GroupBy(grp => new { grp.Mac, grp.Name }).Select(x => new TimeDiffDev { Mac=x.Key.Mac,Name=x.Key.Name,timediffer=x.Min(tt=>tt.timediffer)}).ToList();
                    isDisconnectedCheck = (grpdDev != null);
                }
                if (isClicked)
                {
                    isDisconnectedCheck = true;
                }
                //isDisconnectedCheck = true;
                //ShowBaloonToolTip(Globals.ProductName, "activei.ico", ConfigurationManager.AppSettings["tooltipdesc"],
                if (isDisconnectedCheck)
                {
                    ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Intermittent wireless connection detected - ActiveI is performing changes automatically", 5000);
                    Thread.Sleep(10000);
                    bool isFirmware = false;
                    bool isFirmwareAvial = false;
                    tcpSocket = CheckTelnetEnabled(hostName, 23);
                    if (tcpSocket.Connected)
                    {
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few minutes...", 5000);
                        //Enable Qos
                        Thread.Sleep(5000);
                        ExecuteTelnetCommand("config set streamboost_enable=1");
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few minutes...", 3000);
                        Thread.Sleep(8000);

                        //Backup
                        //CreateTelnetBatFile(hostName);
                        RouterBackupusingTelnetClient(hostName, 23);
                        //Code commented on 12-10-2016
                        //ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few sometime...", 40000);
                        //Thread.Sleep(11000);                        
                        //Dictionary<string, string> dicFirmwareDet = Checkfirmware();
                        //if (string.IsNullOrEmpty(dicFirmwareDet["NewVersion"]))
                        //{
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few minutes...", 5000);
                        Thread.Sleep(8000);
                        tcpSocket = CheckTelnetEnabled(hostName, 23);
                        ExecuteTelnetCommand("config set wl_rts=2305");
                        //Thread.Sleep(10000);
                        isFirmware = true;
                        //isFirmwareAvial = true;
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few minutes...", 2000);
                        Thread.Sleep(5000);
                        //2.4GHz Threshold change
                        ExecuteTelnetCommand("config set wl_rts=2305");
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few minutes...", 2000);
                        Thread.Sleep(5000);
                        //5GHz Threshold change
                        ExecuteTelnetCommand("config set wla_rts=2305");
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few minutes...", 8000);
                        Thread.Sleep(13000);
                        //Preamble
                        //2.4GHz change Preamble mode
                        ExecuteTelnetCommand("config set wl_plcphdr=2");
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Performing necessary changes on your wireless router and this might take a few minutes...", 20000);
                        Thread.Sleep(30000);
                        //5GHz change Preamble mode
                        ExecuteTelnetCommand("config set wla_plcphdr=2");
                        ////Softreboot                        
                        Thread.Sleep(15000);
                        ExecuteTelnetCommand("reboot");
                        ////RebootRouter();
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Router is rebooting and it might take approximately 2 to 3 minutes before its ready..", 110000);
                        Thread.Sleep(120000);
                        lstConnectedDevices.Clear();
                        ShowBaloonToolTip(Globals.ProductName, "activei.ico", "Successfully modified the settings and your connection should be more stable now", 10000);
                        //Code commented on 12-10-2016
                        //}
                        //else
                        //{
                        //    //Firmware upgrade
                        //    Thread.Sleep(3000);
                        //    isFirmware = true;
                        //    FirmwareUpgrade();
                        //    Thread.Sleep(300000);
                        //    //Updatefirmware();
                        //    //RouterMessageBox.Instance.Show("Please wait while upgrading your...This might take approximately 4 minutes...", "Firmware Upgrade", 240);                                
                        //    //Softreboot
                        //    //ExecuteTelnetCommand("reboot");
                        //    //RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Power cycle your network", 180);
                        //}

                    }
                    //Code commented on 12-10-2016
                    //if (isFirmware)
                    //{
                    //    ShowBaloonToolTip(Globals.ProductName, "activei.ico", "All Issue are fixed presently and we would continue to monitor the wireless connection.", 10000);
                    //}

                }
                //Code commented on 27-09-2016
                //if (isDisconnectedCheck)
                //{
                //    bool isFirmware = false;
                //    bool isFirmwareAvial = false;
                //    tcpSocket = CheckTelnetEnabled(hostName, 23);
                //    MsgBox = RouterMessageBox.Instance;
                //    msg1 = MsgBox.Show("We have recently noticed that the some of the wireless devices at your place are experiencing intermittent wireless disconnection with the NETGEAR wireless router." + Environment.NewLine + Environment.NewLine + "We have an automated solution for this issue presently.", "Alert - Intermittent wireless connection!", MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: false);
                //    if (msg1 == DialogResult.Yes)
                //    {
                //        msg2 = MsgBox.Show("Our tool will perform the below actions automatically now: "
                //            + Environment.NewLine + "1.Enabling QoS. 2.Configuration Backup "
                //            + Environment.NewLine + "3.Changing CTS/RTS threshold value on the router"
                //            + Environment.NewLine + "4.Setting the preamble mode 5.Rebooting the router"
                //            + Environment.NewLine + "6.Upgrade your firmware – if the unit doesn’t have the latest version"
                //            + Environment.NewLine + "The overall process might take up to 5 minutes to do the necessary changes. "
                //            + Environment.NewLine + "Confirm to proceed with the above changes on the router (Yes/No)", "Alert - Intermittent wireless connection!"
                //            , MessageBoxButtons.YesNo, null, "", "", isWanimg: false, isShowClose: false);
                //        if (msg2 == DialogResult.Yes)
                //        {
                //            if (tcpSocket.Connected)
                //            {
                //                //Enable Qos
                //                RouterMessageBox.Instance.Show("Enabling QoS", "Alert - Intermittent wireless connection!", 5);
                //                ExecuteTelnetCommand("config set streamboost_enable=1");
                //                RouterMessageBox.Instance.Show("QoS Enabled ", "Alert - Intermittent wireless connection!", 3);
                //                //Thread.Sleep(2000);
                //                RouterMessageBox.Instance.Show("We are taking a backup of the current settings of the wireless router", "Alert - Intermittent wireless connection!", 5);
                //                //Backup
                //                //CreateTelnetBatFile(hostName);
                //                RouterBackupusingTelnetClient(hostName, 23);
                //                RouterMessageBox.Instance.Show("Backup Successful", "Alert - Intermittent wireless connection!", 3);

                //                RouterMessageBox.Instance.Show("Checking the Firmware version", "Alert - Intermittent wireless connection!", 3);
                //                Thread.Sleep(5000);
                //                Dictionary<string, string> dicFirmwareDet = Checkfirmware();
                //                if (string.IsNullOrEmpty(dicFirmwareDet["NewVersion"]))
                //                {
                //                    RouterMessageBox.Instance.Show("Firmware version is Upto date", "Alert - Intermittent wireless connection!", 3);
                //                    Thread.Sleep(5000);
                //                    tcpSocket = CheckTelnetEnabled(hostName, 23);
                //                    //Thread.Sleep(10000);
                //                    isFirmware = true;
                //                    //isFirmwareAvial = true;
                //                    RouterMessageBox.Instance.Show("Changing CTS/RTS threshold value are being changed", "Alert - Intermittent wireless connection!", 5);
                //                    //2.4GHz Threshold change
                //                    ExecuteTelnetCommand("config set wl_rts=2305");
                //                    Thread.Sleep(5000);
                //                    //5GHz Threshold change
                //                    ExecuteTelnetCommand("config set wla_rts=2305");
                //                    RouterMessageBox.Instance.Show("CTS/RTS value change Successful", "Alert - Intermittent wireless connection!", 3);

                //                    RouterMessageBox.Instance.Show("Changing the preamble mode", "Alert - Intermittent wireless connection!", 5);
                //                    Thread.Sleep(5000);
                //                    //Preamble
                //                    //2.4GHz change Preamble mode
                //                    ExecuteTelnetCommand("config set wl_plcphdr=2");
                //                    Thread.Sleep(30000);
                //                    //5GHz change Preamble mode
                //                    ExecuteTelnetCommand("config set wla_plcphdr=2");
                //                    RouterMessageBox.Instance.Show("Preamble mode changed", "Alert - Intermittent wireless connection!", 3);                                   

                //                    ////Softreboot

                //                    //RouterBackupusingTelnetClient(hostName, 23);
                //                    //Thread.Sleep(10000);
                //                    RouterMessageBox.Instance.Show("Your router needs to be rebooted.", "Alert - Intermittent wireless connection!", 3);
                //                    Thread.Sleep(7000);
                //                    ExecuteTelnetCommand("reboot");
                //                    ////RebootRouter();
                //                    RouterMessageBox.Instance.Show("Router is being rebooted, please wait… ", "Alert - Intermittent wireless connection!", 120);
                //                }
                //                else
                //                {
                //                    //Firmware upgrade
                //                    RouterMessageBox.Instance.Show("New firmware needs to updated on the router.", "Alert - Intermittent wireless connection!", 3);
                //                    isFirmware = true;
                //                    FirmwareUpgrade();
                //                    //Updatefirmware();
                //                    //RouterMessageBox.Instance.Show("Please wait while upgrading your...This might take approximately 4 minutes...", "Firmware Upgrade", 240);                                
                //                    //Softreboot
                //                    //ExecuteTelnetCommand("reboot");
                //                    //RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Power cycle your network", 180);
                //                }

                //            }
                //            if (isFirmware)
                //            {
                //                RouterMessageBox.Instance.Show("Required changes have been successful made on the device. The wireless connection should be more stable now", "Alert - Intermittent wireless connection!", 3);
                //            }
                //        }

                //    }

                //}

                //Code commented on 27-09-2016

                //Commented on 08-09-2016
                //if (lstDeviceinfo != null && lstDeviceinfo.Count > 0)
                //{
                //    foreach (var item in lstDeviceinfo)
                //    {
                //        bool isFirmware = false;
                //        bool isFirmwareAvial = false;
                //        wifiCnt = GetDosAttackCount(strLogDet, "[WLAN access rejected: incorrect security] from MAC address " + item.MAC.Trim());
                //        if (wifiCnt >= Convert.ToInt32(ConfigurationManager.AppSettings["inetrmittentWificnt"]))
                //        {
                //            tcpSocket = CheckTelnetEnabled(hostName, 23);
                //            if (tcpSocket.Connected)
                //            {
                //                //Enable Qos
                //                RouterMessageBox.Instance.Show("Enabling the Qos...This might take approximately 5 seconds...", "Qos Enable", 5);
                //                ExecuteTelnetCommand("config set streamboost_enable=1");
                //                //Thread.Sleep(2000);
                //                RouterMessageBox.Instance.Show("Configuration backup process going...This might take approximately 5 seconds...", "Config Backup", 5);
                //                //Backup
                //                //CreateTelnetBatFile(hostName);
                //                RouterBackupusingTelnetClient(hostName, 23);
                //                Thread.Sleep(5000);
                //                Dictionary<string, string> dicFirmwareDet = Checkfirmware();
                //                if (string.IsNullOrEmpty(dicFirmwareDet["NewVersion"]))
                //                {
                //                    Thread.Sleep(5000);
                //                    tcpSocket = CheckTelnetEnabled(hostName, 23);
                //                    Thread.Sleep(5000);
                //                    isFirmwareAvial = true;
                //                    RouterMessageBox.Instance.Show("Setting the CTS/RTS threshold value...This might take approximately 5 seconds...", "CTS/RTS", 5);
                //                    //2.4GHz Threshold change
                //                    ExecuteTelnetCommand("config set wl_rts=2305");
                //                    Thread.Sleep(5000);
                //                    //5GHz Threshold change
                //                    ExecuteTelnetCommand("config set wla_rts=2305");
                //                    RouterMessageBox.Instance.Show("Setting the Preamble value...This might take approximately 5 seconds...", "Preamble Change", 5);
                //                    //Preamble
                //                    //2.4GHz change Preamble mode
                //                    ExecuteTelnetCommand("config set wl_plcphdr=2");
                //                    Thread.Sleep(5000);
                //                    //5GHz change Preamble mode
                //                    ExecuteTelnetCommand("config set wla_plcphdr=2");
                //                    //Softreboot
                //                    Thread.Sleep(5000);
                //                    ExecuteTelnetCommand("reboot");
                //                    RouterMessageBox.Instance.Show("Router reboot going on...This might take approximately 2 minutes...", "Router reboot", 120);
                //                }
                //                else
                //                {
                //                    //Firmware upgrade
                //                    RouterMessageBox.Instance.Show("Your router firmware is going to update in another 5 seconds...", "Firmware Upgrade", 5);
                //                    isFirmware = true;
                //                    FirmwareUpgrade();
                //                    //Updatefirmware();
                //                    //RouterMessageBox.Instance.Show("Please wait while upgrading your...This might take approximately 4 minutes...", "Firmware Upgrade", 240);                                
                //                    //Softreboot
                //                    //ExecuteTelnetCommand("reboot");
                //                    //RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Power cycle your network", 180);
                //                }

                //            }

                //        }
                //        if (isFirmware)
                //        {
                //            MessageBox.Show("Firmware Upgraded");
                //        }
                //    }
                //}

                //Commented on 08-09-2016
            }
        }

        public string GetResponseFromUrl()
        {
            string PostData = string.Empty;
            string Method = "GET";
            var request = (HttpWebRequest)WebRequest.Create("http://routerlogin.net/UPG_upgrade.htm");
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes("admin:password");
            string strad = System.Convert.ToBase64String(plainTextBytes);
            request.Headers["Authorization"] = "Basic " + strad;
            request.Method = "GET";
            request.ContentLength = 0;
            request.ContentType = "text/xml";
            //request.Credentials = new NetworkCredential("admin", "password");
            if (!string.IsNullOrEmpty(PostData) && Method == "POST")
            {
                var encoding = new UTF8Encoding();
                var bytes = Encoding.GetEncoding("iso-8859-1").GetBytes(PostData);
                request.ContentLength = bytes.Length;

                using (var writeStream = request.GetRequestStream())
                {
                    writeStream.Write(bytes, 0, bytes.Length);
                }
            }

            using (var response = (HttpWebResponse)request.GetResponse())
            {
                var responseValue = string.Empty;

                if (response.StatusCode != HttpStatusCode.OK)
                {
                    var message = String.Format("Request failed. Received HTTP {0}", response.StatusCode);
                    throw new ApplicationException(message);
                }

                // grab the response
                using (var responseStream = response.GetResponseStream())
                {
                    if (responseStream != null)
                        using (var reader = new StreamReader(responseStream))
                        {
                            responseValue = reader.ReadToEnd();

                        }
                }
                return responseValue;
            }
        }

        #endregion

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
            startAntivirusService();
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
                //strAddress = AppDomain.CurrentDomain.BaseDirectory + ConfigurationManager.AppSettings["LocalUrl"];
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
                bool isnetworkavil = checknetwork();
                isnetwork = isnetworkavil;
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
        /// Functionaliy used to show the new device notification alert
        /// </summary>
        public void showNewDeviceDialog()
        {
            try
            {
                string alertText = "A new device is trying to access your network. Choose ‘Allow’ to grant access or ‘Deny’ to disconnect the device from your network.";
                string caption = "Alert - New device requires your permission to access your network!";
                this.Invoke(new MethodInvoker(delegate
                {
                    RouterMessageBox MsgBox = RouterMessageBox.Instance;
                    MsgBox.Show(alertText, caption, MessageBoxButtons.YesNo, null, "Allow", "Deny");
                }));

            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "activeiClose", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Functionaliy used to show the new device notification alert
        /// </summary>
        public void showRouterLogDialog()
        {
            try
            {
                string alertText = "We have created a report that you can send to our engineering to fix this issue.";
                string caption = "Alert – Frequent Disconnection";
                this.Invoke(new MethodInvoker(delegate
                {
                    RouterMessageBox MsgBox = RouterMessageBox.Instance;
                    MsgBox.Show(alertText, caption, MessageBoxButtons.YesNo, null, "Send Error Report", "Don't Send");
                }));

            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "activeiClose", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Functionality to start router backup and restoration
        /// </summary>
        public void doAutomaticTroubleshoot()
        {
            try
            {
                #region GlobalMessage
                //Dictionary<int, object[title,description,isshowed,MessageBoxButtons.YesNo/MessageBoxButtons.OK,OkMsg,YesMsg,NoMsg]> 

                InvIPZoneMsg.Clear();
                InvIPZoneMsg.Add(1, new object[] { "Verify the Physical Connection", "The ethernet cable from the modem should be connected to the Internet (Yellow color) port  on the router.  The Computer should be connected to any one of the other 4 LAN ports on the router.", false, MessageBoxButtons.YesNo });
                InvIPZoneMsg.Add(2, new object[] { "Verify the Physical Connection", "Ensure that the Ethernet cable is firmly connected at both the ends", false, MessageBoxButtons.YesNo });
                InvIPZoneMsg.Add(3, new object[] { "Verify the Physical Connection", "Connect the computer to one of the other LAN ports on the router. ", false, MessageBoxButtons.YesNo });
                InvIPZoneMsg.Add(4, new object[] { "Verify the Physical Connection", "Please check, if you see any one of the LAN ports lights lit up on the router. If not, try changing the cable, which is connected from NETGEAR router to the computer.", false, MessageBoxButtons.OK, "Change the Cable Now" });
                InvIPZoneMsg.Add(5, new object[] { "Disable and Enable the LAN Adapter", "Ethernet adapter is being disabled and enabled automatically during this time. Please wait...", false, MessageBoxButtons.OK, "OK" });
                InvIPZoneMsg.Add(6, new object[] { "Power cycle the router", "Unplug only the power cable from the router and connect it back after 30 Seconds...Please click on the OK button after 30 seconds, when you connect the power cable back to the NETGEAR router...", false, MessageBoxButtons.OK, "OK" });
                InvIPZoneMsg.Add(7, new object[] { "Performing Winsock Reset", "Our tool is performing Winsock reset at the movement.  Please wait...", false, MessageBoxButtons.YesNo });
                InvIPZoneMsg.Add(8, new object[] { "Reset the NETGEAR router", "Take a Pen or a Paper clip and push it into the reset button (Mostly the reset button will be in the rear side) of the NETGEAR router. Release the Pen or Paper clip from the reset button, if you have seen the power light blinking in amber for 3 to 4 times(while you perform the reset)." + Environment.NewLine + "Your approximate reset time might take 20 to 30 seconds, during this process. Please click on the OK button below, after you have performed a hard reset to the NETGEAR router...", false, MessageBoxButtons.OK, "Ok" });
                InvIPZoneMsg.Add(9, new object[] { "Contact Technical Support", "Contact Technical Support (888-NETGEAR) or (888-638-4327)", false, MessageBoxButtons.OK, "OK" });

                NotPvtIPZoneMsg.Clear();
                NotPvtIPZoneMsg.Add(1, new object[] { "Verify the Physical Connection", "The ethernet cable from the modem should be connected to the Internet (Yellow color) port  on the router.  The Computer should be connected to any one of the other 4 LAN ports on the router.", false, MessageBoxButtons.YesNo });
                NotPvtIPZoneMsg.Add(2, new object[] { "Checking for Static IP address..", "Currently Checking, if the computer is assigned with Static IP address.  Please wait....", false, MessageBoxButtons.OK, "No Static IP found/Static IP detected and" + Environment.NewLine + " changed to Dynamic IP on the PC..." });
                NotPvtIPZoneMsg.Add(3, new object[] { "Reset the NETGEAR router", "Take a Pen or a Paper clip and push it into the reset button (Mostly the reset button will be in the rear side) of the NETGEAR router. Release the Pen or Paper clip from the reset button, if you have seen the power light blinking in amber for 3 to 4 times(while you perform the reset)." + Environment.NewLine + "Your approximate reset time might take 20 to 30 seconds, during this process. Please click on the OK button below, after you have performed a hard reset to the NETGEAR router...", false, MessageBoxButtons.OK, "Ok" });
                NotPvtIPZoneMsg.Add(4, new object[] { "Contact Technical Support", "Contact Technical Support (888-NETGEAR) or (888-638-4327)", false, MessageBoxButtons.OK, "OK" });

                PingCountFail.Clear();
                PingCountFail.Add(1, new object[] { "Checking for Static IP address..", "Currently Checking, if the computer is assigned with Static IP address.  Please wait....", false, MessageBoxButtons.OK, "No Static IP found/Static IP detected and" + Environment.NewLine + " changed to Dynamic IP on the PC..." });
                PingCountFail.Add(2, new object[] { "Verify the Physical Connection", "The ethernet cable from the modem should be connected to the Internet (Yellow color) port  on the router.  The Computer should be connected to any one of the other 4 LAN ports on the router.", false, MessageBoxButtons.YesNo });
                PingCountFail.Add(3, new object[] { "Power cycle the router", "Unplug only the power cable from the router and connect it back after 30 Seconds...Please click on the OK button after 30 seconds, when you connect the power cable back to the NETGEAR router...", false, MessageBoxButtons.OK, "Ok" });
                PingCountFail.Add(4, new object[] { "Reset the NETGEAR router", "Take a Pen or a Paper clip and push it into the reset button (Mostly the reset button will be in the rear side) of the NETGEAR router. Release the Pen or Paper clip from the reset button, if you have seen the power light blinking in amber for 3 to 4 times(while you perform the reset)." + Environment.NewLine + "Your approximate reset time might take 20 to 30 seconds, during this process. Please click on the OK button below, after you have performed a hard reset to the NETGEAR router...", false, MessageBoxButtons.OK, "Ok" });
                PingCountFail.Add(5, new object[] { "Contact Technical Support", "Contact Technical Support (888-NETGEAR) or (888-638-4327)", false, MessageBoxButtons.OK, "OK" });

                #endregion
                sbRouter = new StringBuilder();
                this.Invoke(new MethodInvoker(delegate
                {
                    troubleshoot();
                }));

            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "doAutomaticTroubleshoot()", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        /// <summary>
        /// Checking the valid ip
        /// </summary>
        /// <returns></returns>
        public bool checkvalidIP()
        {

            bool isValid = false;
            bool isValipIp = false;
            int flags;
            DialogResult resPCn = new DialogResult();
            DialogResult resPCnenet = new DialogResult();
            DialogResult resPCnlanp = new DialogResult();
            try
            {
                this.Invoke(new MethodInvoker(delegate
                {
                    bool isValidIpDisableLan = false;
                    bool isLanAvail = false;
                    //if (isValipIp)
                    if (IsValidIP())
                    {
                        isValid = true;

                    }
                    else
                    {
                        RouterMessageBox MsgBox;
                        string Title = Globals.ProductName;
                        Dictionary<string, string[]> dictMsgs = new Dictionary<string, string[]>();

                        dictMsgs.Add("msg1", new string[] { "Verify the Physical Connection"
                            , "The ethernet cable from the modem should be connected to the Internet (Yellow color) port  on the router.  The Computer should be connected to any one of the other 4 LAN ports on the router." });

                        dictMsgs.Add("msg2", new string[] { "Verify the Physical Connection"
                            , "Ensure that the Ethernet cable is firmly connected at both the ends" });

                        dictMsgs.Add("msg3", new string[] { "Verify the Physical Connection", "Connect the computer to one of the other LAN ports on the router." });
                        dictMsgs.Add("msg4", new string[] { "Disable and Enable the LAN Adapter", "Ethernet adapter is being disabled and enabled automatically during this time. Please wait..." });
                        dictMsgs.Add("msg5", new string[] { "Power cycle the router", "Unplug only the power cable from the router and connect it back after 30 Seconds...Please click on the OK button after 30 seconds, when you connect the power cable back to the NETGEAR router..." });
                        dictMsgs.Add("msg6", new string[] { "Performing Winsock Reset", "Our tool is performing Winsock reset at the movement.  Please wait..." });
                        dictMsgs.Add("msg7", new string[] { "Reset the NETGEAR router", "Take a Pen or a Paper clip and push it into the reset button (Mostly the reset button will be in the rear side) of the NETGEAR router. Release the Pen or Paper clip from the reset button, if you have seen the power light blinking in amber for 3 to 4 times(while you perform the reset)." + Environment.NewLine + "Your approximate reset time might take 20 to 30 seconds, during this process. Please click on the OK button below, after you have performed a hard reset to the NETGEAR router..." });
                        dictMsgs.Add("msg8", new string[] { "Contact Technical Support", "Contact Technical Support (888-NETGEAR) or (888-638-4327)" });
                        dictMsgs.Add("msg9", new string[] { "Verify the Physical Connection", "Please check, if you see any one of the LAN ports lights lit up on the router. If not, try changing the cable, which is connected from NETGEAR router to the computer." });

                        string connectedCaption = "Already Connected";
                        string notConnectedCaption = "Changed the Physical Connections now";


                        MsgBox = RouterMessageBox.Instance;
                        resPCn = MsgBox.Show(dictMsgs["msg1"][1], dictMsgs["msg1"][0], MessageBoxButtons.YesNo, null, connectedCaption, notConnectedCaption, isWanimg: true);
                        //if ((resPCn == DialogResult.Yes) || !isValipIp)
                        if ((resPCn == DialogResult.Yes) || !IsValidIP())
                        {
                            if ((resPCn != DialogResult.Yes))
                            {
                                RouterMessageBox.Instance.Show(strWaitMessage, "Verify the Physical Connection", 30);
                            }
                            resPCnenet = MsgBox.Show(dictMsgs["msg2"][1], dictMsgs["msg2"][0], MessageBoxButtons.YesNo, null, connectedCaption, notConnectedCaption);
                            //if ((resPCnenet == DialogResult.Yes) || !isValipIp)
                            if ((resPCnenet) == DialogResult.Yes || !IsValidIP())
                            {
                                if ((resPCnenet != DialogResult.Yes))
                                {
                                    RouterMessageBox.Instance.Show(strWaitMessage, "Verify the Physical Connection", 30);
                                }
                                resPCnlanp = MsgBox.Show(dictMsgs["msg3"][1], dictMsgs["msg3"][0], MessageBoxButtons.YesNo, null, connectedCaption, notConnectedCaption);
                                //if ((resPCnlanp == DialogResult.Yes) || !isValipIp)
                                if (resPCnlanp == DialogResult.Yes || !IsValidIP())
                                {
                                    if ((resPCnlanp != DialogResult.Yes))
                                    {
                                        RouterMessageBox.Instance.Show(strWaitMessage, "Verify the Physical Connection", 30);
                                    }
                                    isLanAvail = IsNetworkAlive(out flags);
                                    if (!isLanAvail)
                                    {
                                        if (MsgBox.Show(dictMsgs["msg9"][1], dictMsgs["msg9"][0], MessageBoxButtons.OK, "Change the Cable Now") == DialogResult.OK)
                                        {
                                            RouterMessageBox.Instance.Show("Checking the Ethernet adapter status on the Computer. Please wait...", "Verify the Physical Connection", 30);
                                            if (!IsValidIP())
                                            {
                                                if (!isValidIpDisableLan)
                                                {

                                                    if (MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK) == DialogResult.OK)
                                                    {
                                                        //DisableEnableLanAdapter();
                                                        //New code added on 04/01/2016
                                                        CheckEthernetStatus();
                                                        isValidIpDisableLan = true;
                                                        RouterMessageBox.Instance.Show(strWaitMessage, "Verify the Physical Connection", 30);
                                                        //if (isValipIp)
                                                        if (IsValidIP())
                                                        {
                                                            isValid = true;
                                                        }
                                                        else
                                                        {
                                                            isValid = powercycleFlow();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (!isValidIpDisableLan)
                                        {

                                            if (MsgBox.Show(dictMsgs["msg4"][1], dictMsgs["msg4"][0], MessageBoxButtons.OK) == DialogResult.OK)
                                            {
                                                //DisableEnableLanAdapter();
                                                //New code added on 04/01/2016
                                                CheckEthernetStatus();
                                                isValidIpDisableLan = true;
                                                RouterMessageBox.Instance.Show(strWaitMessage, "Verify the Physical Connection", 30);
                                                //if (isValipIp)
                                                if (IsValidIP())
                                                {
                                                    isValid = true;
                                                }
                                                else
                                                {
                                                    isValid = powercycleFlow();
                                                }
                                            }
                                        }
                                    }


                                }
                            }

                        }
                    }
                }
                ));
                return isValid;
            }
            catch (Exception)
            {
                return isValid;
            }
        }


        private bool powercycleFlow()
        {
            bool blnIsValid = false;
            bool isValid = false;
            RouterMessageBox MsgBox;
            string Title = Globals.ProductName;
            Dictionary<string, string[]> dictMsgs = new Dictionary<string, string[]>();
            DialogResult resWinsoc = new System.Windows.Forms.DialogResult();

            dictMsgs.Add("msg1", new string[] { "Verify the Physical Connection"
                            , "The ethernet cable from the modem should be connected to the Internet (Yellow color) port  on the router.  The Computer should be connected to any one of the other 4 LAN ports on the router." });

            dictMsgs.Add("msg2", new string[] { "Verify the Physical Connection"
                            , "Ensure that the Ethernet cable is firmly connected at both the ends" });

            dictMsgs.Add("msg3", new string[] { "Verify the Physical Connection", "Connect the computer to one of the other LAN ports on the router." });
            dictMsgs.Add("msg4", new string[] { "Disable and Enable the LAN Adapter", "Ethernet adapter is being disabled and enabled automatically during this time. Please wait..." });
            dictMsgs.Add("msg5", new string[] { "Power cycle the router", "Unplug only the power cable from the router and connect it back after 30 Seconds...Please click on the OK button after 30 seconds, when you connect the power cable back to the NETGEAR router..." });
            dictMsgs.Add("msg6", new string[] { "Performing Winsock Reset", "Our tool is performing Winsock reset at the movement.  Please wait..." });
            dictMsgs.Add("msg7", new string[] { "Reset the NETGEAR router", "Take a Pen or a Paper clip and push it into the reset button (Mostly the reset button will be in the rear side) of the NETGEAR router. Release the Pen or Paper clip from the reset button, if you have seen the power light blinking in amber for 3 to 4 times(while you perform the reset)." + Environment.NewLine + "Your approximate reset time might take 20 to 30 seconds, during this process. Please click on the OK button below, after you have performed a hard reset to the NETGEAR router..." });
            dictMsgs.Add("msg8", new string[] { "Contact Technical Support", "Contact Technical Support (888-NETGEAR) or (888-638-4327)" });
            MsgBox = RouterMessageBox.Instance;


            string notConnectedCaption = "Changed the Physical" + Environment.NewLine + " Connections now";

            if (MsgBox.Show(dictMsgs["msg5"][1], dictMsgs["msg5"][0], MessageBoxButtons.OK, "Ok") == DialogResult.OK)
            {
                RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Power cycle your network", 120);
                //if (!isValid)
                if (!IsValidIP())
                {
                    resWinsoc = MsgBox.Show(dictMsgs["msg6"][1], dictMsgs["msg6"][0], MessageBoxButtons.YesNo, null, "Ok", "Skip");
                    //if (MsgBox.Show(dictMsgs["msg6"][1], dictMsgs["msg6"][0], MessageBoxButtons.OK) == DialogResult.OK)
                    if (resWinsoc == DialogResult.Yes || resWinsoc == DialogResult.No)
                    {
                        if (resWinsoc == DialogResult.Yes)
                        {
                            ExecuteCommandSync("netsh winsock reset");
                        }
                        //if (!isValid)
                        if (!IsValidIP())
                        {

                            if (MsgBox.Show(dictMsgs["msg7"][1], dictMsgs["msg7"][0], MessageBoxButtons.OK, "Ok") == DialogResult.OK)
                            {
                                RouterMessageBox.Instance.Show("Please wait while the NETGEAR router is powering on after the hard reset. This might take approximately 2 minutes...", "Router is rebooting after reset", 120);
                                //if (!isValid)
                                if (!IsValidIP())
                                {
                                    if (MsgBox.Show(dictMsgs["msg8"][1], dictMsgs["msg8"][0], MessageBoxButtons.OK) == DialogResult.OK)
                                    {
                                        // isValipIp = true;
                                        sbRouter.AppendLine("Contact Customer Support.");
                                    }
                                }
                                else
                                {
                                    blnIsValid = true;
                                }

                            }
                        }
                        else
                        {
                            blnIsValid = true;
                        }
                    }
                }
                else
                {
                    blnIsValid = true;
                }
            }
            return blnIsValid;
        }


        void troubleshoot()
        {
            try
            {
                //Trigger from here
                bool isPingPowerCycle = false;
                bool isLanAvail = false;
                bool isRestored = false;
                int flags;
                string logDetails = string.Empty;
                sbRouter.AppendLine("Analysis by our Connect Tool:");
                sbRouter.AppendLine("-----------------------------");
                sbRouter.AppendLine(string.Empty);

                if (routerAuthenticated != 0) { routerAuthenticated = routerAuthentication("admin", "password"); }
                if (routerAuthenticated == 0)
                {
                    string routerIP = (GetDefaultGateway() != null) ? GetDefaultGateway().ToString() : string.Empty;
                    string hostName = Dns.GetHostName();
                    string sysIp = string.Empty;
                    IPHostEntry host = Dns.GetHostEntry(hostName);

                    foreach (IPAddress ip in host.AddressList)
                    {
                        if (ip.AddressFamily.ToString() == "InterNetwork")
                        {
                            sysIp = ip.ToString();
                        }
                    }

                    sbRouter.AppendLine("LAN IP Information:");
                    sbRouter.AppendLine("**************");
                    sbRouter.AppendLine("Computer IP Address : " + sysIp);
                    sbRouter.AppendLine("Router Address      : " + routerIP);
                    sbRouter.AppendLine("Ping Router Address : Success (4 Replies from " + routerIP + " )");
                    sbRouter.AppendLine(string.Empty);
                    sbRouter.AppendLine("Router Information:");
                    sbRouter.AppendLine("**************");
                    sbRouter.AppendLine("Logging into the Router : Success");
                    isNetworkAvailable = isNetworkAvail();
                    //isNetworkAvailable = false;
                    if (isNetworkAvailable) return;
                //GetRouterCofigSettings();

                IsValidIPZone:
                    //bool blnip = false;
                    //if (blnip)

                    if (IsValidIP())
                    {

                    IsPrivateIpZone:
                        //bool blnPriIP = false;
                        //if (!blnPriIP)
                        if (!IsPrivateIp())
                        {
                            for (int i = 1; i <= NotPvtIPZoneMsg.Count; i++)
                            {
                                if (!Convert.ToBoolean(NotPvtIPZoneMsg[i][2]))
                                {
                                    bool status = false;
                                    if (i == 1)
                                    {
                                        status = TriggerMessage(NotPvtIPZoneMsg, i, ((MessageBoxButtons)NotPvtIPZoneMsg[i][3]), true);
                                    }
                                    else
                                    {
                                        status = TriggerMessage(NotPvtIPZoneMsg, i, ((MessageBoxButtons)NotPvtIPZoneMsg[i][3]), false);
                                    }

                                    NotPvtIPZoneMsg[i][2] = true;
                                    if (status)
                                    {
                                        switch (i)
                                        {
                                            case 1:
                                                break;
                                            case 2:
                                                //Static IP Process
                                                break;
                                            case 3:
                                                RouterMessageBox.Instance.Show("Please wait while the NETGEAR router is powering on after the hard reset. This might take approximately 2 minutes...", "Router is rebooting after reset", 120);
                                                goto IsValidIPZone;
                                            case 4:
                                                sbRouter.AppendLine("Contact Customer Support.");
                                                break;
                                        }
                                    }
                                    else
                                    {
                                        RouterMessageBox.Instance.Show(strWaitMessage, Convert.ToString(NotPvtIPZoneMsg[i][0]), 30);
                                        goto IsValidIPZone;
                                    }
                                }
                            }
                        }
                        else
                        {

                        GetPingSuccessCountZone:
                            //bool isSuccess = true;
                            //if (isSuccess)
                            if (GetPingSuccessCount())
                            {
                                logDetails = GetRouterLogDetails();
                                //logDetails = "ssss";

                                if (string.IsNullOrEmpty(logDetails))
                                {
                                    //call router backup process
                                    if (!isRestored)
                                    {
                                        sbRouter.AppendLine("BackUp Restoration started...");
                                        RestoreBackupusingTelnetClient(GetDefaultGateway().ToString(), 23);
                                        isRestored = true;
                                        RouterMessageBox.Instance.Show("Config restoration Processing...This might take approximately 1 minutes...", "Config restoration", 60);
                                        sbRouter.AppendLine("BackUp Restoration Completed...");
                                    }

                                    //if (!IsWanIP())
                                    if (!((bool)IsWanIP()["IsWanIP"]))
                                    {
                                        if (!isPingPowerCycle)
                                        {
                                            RouterMessageBox.Instance.Show("Unplug only the power cable from the router and connect it back after 30 Seconds...", "Power cycle your network", MessageBoxButtons.OK);
                                            RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Power cycle your network", 120);
                                            sbRouter.AppendLine("Power cycle your network");
                                            isPingPowerCycle = true;
                                            goto IsValidIPZone;
                                        }
                                        else
                                        {
                                            RouterMessageBox.Instance.Show("Contact Technical Support (888-NETGEAR) or (888-638-4327)", "Contact Technical Support", MessageBoxButtons.OK);
                                        }
                                    }
                                    else
                                    {
                                        sbRouter.AppendLine("Current Status: Connected to Internet Successfully!!!");

                                    }
                                }
                                else
                                {
                                    int logCount = LogDisconnectedCount(logDetails);
                                    //int logCount = 0;
                                    //if (logCount > 0)
                                    //{
                                    if (logCount >= 25)
                                    {
                                        sbRouter.AppendLine("Log has been sent to Engineering team.");
                                    }
                                    else if (logCount != 1)
                                    {
                                        //call router backup process
                                        if (!isRestored)
                                        {
                                            sbRouter.AppendLine("BackUp Restoration started...");
                                            RestoreBackupusingTelnetClient(GetDefaultGateway().ToString(), 23);
                                            isRestored = true;
                                            RouterMessageBox.Instance.Show("Config restoration Processing...This might take approximately 1 minutes...", "Config restoration", 60);
                                            sbRouter.AppendLine("BackUp Restoration Completed...");
                                        }
                                        //bool iswan = false;
                                        //if (!iswan)
                                        if (!((bool)IsWanIP()["IsWanIP"]))
                                        {
                                            if (!isPingPowerCycle)
                                            {
                                                if (Convert.ToBoolean(ConfigurationManager.AppSettings["IsReboot"]))
                                                {
                                                    ExecuteTelnetCommand("reboot");
                                                    RouterMessageBox.Instance.Show("Router reboot going on...This might take approximately 2 minutes...", "Router reboot", 120);
                                                }
                                                else
                                                {
                                                    RouterMessageBox.Instance.Show("Unplug only the power cable from the router and connect it back after 30 Seconds...", "Power cycle your network", MessageBoxButtons.OK);
                                                    RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Power cycle your network", 120);
                                                }

                                                sbRouter.AppendLine("Power cycle your network");
                                                isPingPowerCycle = true;
                                                goto IsValidIPZone;
                                            }
                                            else
                                            {
                                                RouterMessageBox.Instance.Show("Contact Technical Support (888-NETGEAR) or (888-638-4327)", "Contact Support", MessageBoxButtons.OK);
                                                sbRouter.AppendLine("Contact Technical Support (888-NETGEAR) or (888-638-4327)");
                                            }
                                        }
                                        else
                                        {
                                            sbRouter.AppendLine("Current Status: Connected to Internet Successfully!!!");
                                        }
                                    }
                                }

                                //}
                            }
                            else
                            {
                                for (int i = 1; i <= PingCountFail.Count; i++)
                                {
                                    if (!Convert.ToBoolean(PingCountFail[i][2]))
                                    {
                                        bool status = false;
                                        if (i == 2)
                                        {
                                            status = TriggerMessage(PingCountFail, i, ((MessageBoxButtons)PingCountFail[i][3]), true);
                                        }
                                        else
                                        {
                                            status = TriggerMessage(PingCountFail, i, ((MessageBoxButtons)PingCountFail[i][3]), false);
                                        }
                                        PingCountFail[i][2] = true;
                                        if (status)
                                        {
                                            switch (i)
                                            {
                                                case 1:
                                                    //Static IP Process
                                                    break;
                                                case 2:
                                                    break;
                                                case 3:
                                                    //PowerCycle
                                                    RouterMessageBox.Instance.Show("Please wait while the NETGEAR router is powering on after the hard reset. This might take approximately 2 minutes...", "Power cycle your network", 120);
                                                    goto IsValidIPZone;
                                                case 4:
                                                    //ResetRouter
                                                    RouterMessageBox.Instance.Show("Please wait while the NETGEAR router is powering on after the hard reset. This might take approximately 2 minutes...", "Router is rebooting after reset", 120);
                                                    goto IsValidIPZone;
                                                case 5:
                                                    sbRouter.AppendLine("Contact Technical Support (888-NETGEAR) or (888-638-4327)");
                                                    break;
                                            }
                                        }
                                        else
                                        {
                                            RouterMessageBox.Instance.Show(strWaitMessage, Convert.ToString(PingCountFail[i][0]), 30);
                                            goto IsValidIPZone;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        //string Title = Globals.ProductName;
                        for (int i = 1; i <= InvIPZoneMsg.Count; i++)
                        {
                            if (!Convert.ToBoolean(InvIPZoneMsg[i][2]))
                            {
                                bool status = false;
                                if (i == 1)
                                {
                                    status = TriggerMessage(InvIPZoneMsg, i, ((MessageBoxButtons)InvIPZoneMsg[i][3]), true);
                                }
                                else
                                {
                                    if (i == 4)
                                    {
                                        isLanAvail = IsNetworkAlive(out flags);
                                        if (!isLanAvail)
                                        {
                                            status = TriggerMessage(InvIPZoneMsg, i, ((MessageBoxButtons)InvIPZoneMsg[i][3]), false);
                                        }
                                    }
                                    else
                                    {
                                        status = TriggerMessage(InvIPZoneMsg, i, ((MessageBoxButtons)InvIPZoneMsg[i][3]), false);
                                    }

                                }
                                InvIPZoneMsg[i][2] = true;
                                if (status)
                                {
                                    switch (i)
                                    {
                                        case 1:
                                            break;
                                        case 2:
                                            break;
                                        case 3:
                                            break;
                                        case 4:
                                            RouterMessageBox.Instance.Show("Checking the Ethernet adapter status on the Computer. Please wait...", "Verify the Physical Connection", 30);
                                            goto IsValidIPZone;
                                            break;
                                        case 5:
                                            //DisableEnableLanAdapter();
                                            //New code added on 04/01/2016
                                            CheckEthernetStatus();
                                            goto IsValidIPZone;
                                        //break;
                                        case 6:
                                            RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Power cycle your network", 120);
                                            goto IsValidIPZone;
                                        //break;
                                        case 7:
                                            ExecuteCommandSync("netsh winsock reset");
                                            goto IsValidIPZone;
                                        //break;
                                        case 8:
                                            RouterMessageBox.Instance.Show("Please wait while the router is powering on...This might take approximately 2 minutes...", "Router is rebooting after reset", 120);
                                            goto IsValidIPZone;
                                        //break;
                                        case 9:
                                            sbRouter.AppendLine("Contact Customer Support.");
                                            break;
                                    }
                                }
                                else
                                {
                                    RouterMessageBox.Instance.Show(strWaitMessage, Convert.ToString(InvIPZoneMsg[i][0]), 30);
                                    goto IsValidIPZone;
                                }
                            }
                        }
                    }
                }
                else if (routerAuthenticated == 401)
                {
                    sbRouter.AppendLine("Logging into the Router : Failed. Please enter correct user name and password in \"Router Mange \" page.");
                }
                else
                {
                    sbRouter.AppendLine("Please check whether router connected with your device or not");
                }

                //Write troubleshoot steps to Log
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
                File.Copy(routerTroubleLogPath, tempFiName, true);
                System.Diagnostics.Process.Start("notepad.exe", tempFiName);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "NetworkChange_NetworkAvailabilityChanged", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        public void RouterBackupusingTelnetClient(string hostname, int port)
        {
            try
            {
                ErrorTracker.WriteLog("RouterBackupusingTelnetClient()");
                tcpSocket = CheckTelnetEnabled(hostname, port);
                if (tcpSocket.Connected)
                {
                    ErrorTracker.WriteLog("Telnet is Enabled  ");
                    ErrorTracker.WriteLog("Router Backup started");
                    ExecuteTelnetCommand("config backup " + ConfigurationManager.AppSettings["RouterConfigFileName"]);
                    //ExecuteTelnetCommand("config restore test.cfg");
                    Thread.Sleep(500);
                    //tc.WriteLine("rm test.cfg");
                }
            }
            catch (Exception ex)
            {

            }
        }

        public void RestoreBackupusingTelnetClient(string hostname, int port)
        {
            try
            {
                ErrorTracker.WriteLog("RestoreBackupusingTelnetClient() method invoked");
                tcpSocket = CheckTelnetEnabled(hostname, port);
                if (tcpSocket.Connected)
                {
                    ErrorTracker.WriteLog("Restoration started");
                    //ExecuteTelnetCommand("config backup test.cfg");
                    ExecuteTelnetCommand("config restore " + ConfigurationManager.AppSettings["RouterConfigFileName"]);
                    ErrorTracker.WriteLog("Finished");
                    //Thread.Sleep(50000);
                    //tc.WriteLine("rm test.cfg");
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public TcpClient CheckTelnetEnabled(string hostname, int port)
        {
            try
            {
                tcpSocket = new TcpClient(hostname, port);
            }
            catch (SocketException ex)
            {
                ErrorTracker.WriteLog("Telnet Connection not opened ");
                if (ex.SocketErrorCode == SocketError.ConnectionRefused)
                {
                    EnableTelnet(hostname);
                    tcpSocket = new TcpClient(hostname, port);
                    ErrorTracker.WriteLog("Telnet Connection opened" + hostname);
                }
            }
            return tcpSocket;
        }

        private string CreateTelnetBatFile(string hostname)
        {
            try
            {
                routerMacAddress = GetRouterMacAddress(hostname).ToUpper();
                string DirpathRoot = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), ConfigurationManager.AppSettings["ClientName"]);
                string Dirpath = DirpathRoot + "\\Router\\";

                if (!Directory.Exists(Dirpath))
                {
                    Directory.CreateDirectory(Dirpath);
                }
                batFilePath = Path.Combine(Dirpath, ConfigurationManager.AppSettings["TelnetBatFileName"]);
                if (File.Exists(batFilePath))
                {
                    ErrorTracker.WriteLog("Existing bat delete process");
                    File.Delete(batFilePath);
                }
                ErrorTracker.WriteLog("Bat file creation started");
                using (StreamWriter writer = new StreamWriter(batFilePath, true))
                {
                    for (int currentLine = 1; currentLine <= 3; currentLine++)
                    {
                        if (currentLine == 1)
                        {
                            writer.WriteLine("echo on");
                        }
                        else if (currentLine == 2)
                        {
                            writer.WriteLine("telnetenable.exe " + hostname + " " + routerMacAddress + " admin password");
                            //writer.WriteLine("telnetenable.exe 192.168.1.1 A063918432BC admin password");
                        }
                        else if (currentLine == 3)
                        {
                            writer.WriteLine("end");
                        }
                    }
                }
                ErrorTracker.WriteLog("Bat file creation Completed");
            }
            catch (Exception ex)
            {
                batFilePath = string.Empty;
            }
            return batFilePath;
        }

        public void ExecuteTelnetCommand(string cmd)
        {
            ErrorTracker.WriteLog("Telnet Command Executed " + cmd);
            Write(cmd + "\n");
        }

        public void Write(string cmd)
        {
            if (!tcpSocket.Connected) return;
            byte[] buf = System.Text.ASCIIEncoding.ASCII.GetBytes(cmd.Replace("\0xFF", "\0xFF\0xFF"));
            tcpSocket.GetStream().Write(buf, 0, buf.Length);
        }


        public void ExecuteReadTelnetCommand(string cmd)
        {
            //create a new telnet connection to hostname "gobelijn" on port "23"
            //TelnetConnection tc = new TelnetConnection("10.0.0.1", 23);

            ////login with user "root",password "rootpassword", using a timeout of 100ms, and show server output
            //string s = tc.Login("admin", "password", 100);


            //// server output should end with "$" or ">", otherwise the connection failed
            ////string prompt = s.TrimEnd();
            ////prompt = s.Substring(prompt.Length - 1, 1);
            ////if (prompt != "$" && prompt != ">")
            ////    throw new Exception("Connection failed");

            ////prompt = "";

            //// while connected
            //while (tc.IsConnected)
            //{
            //    StringBuilder sb = new StringBuilder();
            //    tc.WriteLine("config get wl_rts");
            //    // display server output
            //    Console.Write(tc.Read());
            //    int input = tcpSocket.GetStream().ReadByte();
            //    sb.Append((char)input);

            //    // send client input to server
            //    string str = Console.ReadLine();


            //    // display server output
            //    Console.Write(tc.Read());
            //}
            //Console.WriteLine("***DISCONNECTED");
            //Console.ReadLine();




            //Process p = new Process();
            //// Redirect the output stream of the child process.
            //p.StartInfo.UseShellExecute = false;
            //p.StartInfo.CreateNoWindow = true;
            //p.StartInfo.RedirectStandardOutput = true;
            ////p.StartInfo.WorkingDirectory = @"D:\Client\is TEAM\Git\windows\";
            //p.StartInfo.WorkingDirectory = @"D:\Softwares\";
            //p.StartInfo.FileName = @"D:\Git\activei_win_container\Activei\Activei\bin\Release\testbat.bat";
            //p.Start();

            //// Do not wait for the child process to exit before
            //// reading to the end of its redirected stream.
            //// p.WaitForExit();
            //// Read the output stream first and then wait.
            ////var output = p.StandardOutput.ReadToEnd();
            //var reader = p.StandardOutput;
            //while (!reader.EndOfStream)
            //{

            //    string line= reader.ReadLine();

            //    // Read data..
            //}
            //p.WaitForExit();
            //Thread.Sleep(500);

            Write(cmd + "\n");
            ReadTcp(cmd + "\n");
        }

        public void ReadTcp(string cmd)
        {
            if (!tcpSocket.Connected) return;

            //var data = Encoding.GetEncoding(1252).GetBytes(cmd);
            //var stm = tcpSocket.GetStream();
            //stm.Write(data, 0, data.Length);
            //byte[] resp = new byte[2048];
            //var memStream = new MemoryStream();
            //var bytes = 0;
            //tcpSocket.Client.ReceiveTimeout = 20;
            //do
            //{
            //    try
            //    {
            //        bytes = stm.Read(resp, 0, resp.Length);
            //        memStream.Write(resp, 0, bytes);
            //    }
            //    catch (IOException ex)
            //    {
            //        // if the ReceiveTimeout is reached an IOException will be raised...
            //        // with an InnerException of type SocketException and ErrorCode 10060
            //        var socketExept = ex.InnerException as SocketException;
            //        if (socketExept == null || socketExept.ErrorCode != 10060)
            //            // if it's not the "expected" exception, let's not hide the error
            //            throw ex;
            //        // if it is the receive timeout, then reading ended
            //        bytes = 0;
            //    }
            //} while (bytes > 0);
            //string strVal = Encoding.GetEncoding(1252).GetString(memStream.ToArray());


            NetworkStream netStream = tcpSocket.GetStream();
            //byte[] buf = System.Text.ASCIIEncoding.ASCII.GetBytes(cmd.Replace("\0xFF", "\0xFF\0xFF"));
            //tcpSocket.GetStream().Write(buf, 0, buf.Length);
            if (netStream.CanRead)
            {
                //tcpSocket.GetStream().Read(buf, 0, buf.Length);
                // Reads NetworkStream into a byte buffer.
                byte[] bytes = new byte[tcpSocket.ReceiveBufferSize];

                // Read can return anything from 0 to numBytesToRead. 
                // This method blocks until at least one byte is read.
                netStream.Read(bytes, 0, (int)tcpSocket.ReceiveBufferSize);


                // Returns the data received from the host to the console.
                string returndata = Encoding.UTF8.GetString(bytes);

                Console.WriteLine("This is what the host returned to you: " + returndata);

            }



            // Translate the passed message into ASCII and store it as a Byte array.
            //Byte[] data = System.Text.Encoding.ASCII.GetBytes(cmd);

            //// Get a client stream for reading and writing.
            ////  Stream stream = client.GetStream();

            //NetworkStream serverStream = tcpSocket.GetStream();
            //byte[] outStream = System.Text.Encoding.ASCII.GetBytes(cmd);
            //serverStream.Write(outStream, 0, outStream.Length);
            //serverStream.Flush();

            //byte[] inStream = new byte[10025];
            //serverStream.Read(inStream, 0, (int)tcpSocket.ReceiveBufferSize);
            //string returndata = System.Text.Encoding.ASCII.GetString(inStream);


            // Server Reply
            //NetworkStream netStream = tcpSocket.GetStream();
            //byte[] buf = System.Text.ASCIIEncoding.ASCII.GetBytes(cmd.Replace("\0xFF", "\0xFF\0xFF"));
            //tcpSocket.GetStream().Write(buf, 0, buf.Length);     
            //if (netStream.CanRead)
            //{
            //    // Buffer to store the response bytes.
            //    byte[] readBuffer = new byte[tcpSocket.ReceiveBufferSize];
            //    string fullServerReply = null;
            //    using (var writer = new MemoryStream())
            //    {
            //        while (netStream.DataAvailable)
            //        {
            //            int numberOfBytesRead = netStream.Read(readBuffer, 0, readBuffer.Length);
            //            if (numberOfBytesRead <= 0)
            //            {
            //                break;
            //            }
            //            writer.Write(readBuffer, 0, numberOfBytesRead);
            //        }
            //        fullServerReply = Encoding.UTF8.GetString(writer.ToArray());
            //    }
            //}


        }

        /// <summary>
        /// functoinality 
        /// </summary>
        /// <param name="hostname"></param>
        private void EnableTelnet(string hostname)
        {
            if (IsRunAsAdministrator())
            {
                batFilePath = CreateTelnetBatFile(hostname);
                RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName(ConfigurationManager.AppSettings["ClientName"]);
                if (UninstallRegistryKey != null)
                {
                    string uninstallPath = UninstallRegistryKey.GetValue("UninstallString").ToString();
                    telnetEnableExepath = Path.Combine(uninstallPath.Replace("\"", "").Substring(0, uninstallPath.LastIndexOf("\\")));
                }
                ErrorTracker.WriteLog("EnableTelnet() Command Execution started" + hostname);
                Process p = new Process();
                // Redirect the output stream of the child process.
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.CreateNoWindow = true;
                p.StartInfo.RedirectStandardOutput = true;
                //p.StartInfo.WorkingDirectory = @"D:\Client\is TEAM\Git\windows\";
                p.StartInfo.WorkingDirectory = telnetEnableExepath;
                p.StartInfo.FileName = batFilePath;

                p.Start();
                ErrorTracker.WriteLog("EnableTelnet() Command Execution Completed" + hostname);
                // Do not wait for the child process to exit before
                // reading to the end of its redirected stream.
                // p.WaitForExit();
                // Read the output stream first and then wait.
                string output = p.StandardOutput.ReadToEnd();
                p.WaitForExit();
                Thread.Sleep(500);
            }
        }


        /// <summary>
        /// Functionality used to get routermac address
        /// </summary>
        /// <param name="ipAddress"></param>
        /// <returns></returns>
        public string GetRouterMacAddress(string ipAddress)
        {
            string macAddress = string.Empty;
            System.Diagnostics.Process Process = new System.Diagnostics.Process();
            Process.StartInfo.FileName = "arp";
            Process.StartInfo.Arguments = "-a " + ipAddress;
            Process.StartInfo.UseShellExecute = false;
            Process.StartInfo.RedirectStandardOutput = true;
            Process.StartInfo.CreateNoWindow = true;
            Process.Start();
            string strOutput = Process.StandardOutput.ReadToEnd();
            string[] substrings = strOutput.Split('-');
            if (substrings.Length >= 8)
            {
                macAddress = substrings[3].Substring(Math.Max(0, substrings[3].Length - 2))
                         + "-" + substrings[4] + "-" + substrings[5] + "-" + substrings[6]
                         + "-" + substrings[7] + "-"
                         + substrings[8].Substring(0, 2);
                return macAddress.Replace("-", "");
            }
            else
            {
                return "OWN Machine";
            }
        }




        public bool TriggerMessage(Dictionary<int, object[]> dicObj, int MsgNo, MessageBoxButtons objMsgBoxBtns, bool isWanPort)
        {
            string connectedCaption = "Already Connected";
            string notConnectedCaption = "Changed the Physical Connections now";
            if (MsgNo == 6)
            {
                connectedCaption = "Ok";
                notConnectedCaption = "Skip";
            }
            RouterMessageBox MsgBox;
            MsgBox = RouterMessageBox.Instance;
            DialogResult resPCn = new DialogResult();
            if (MessageBoxButtons.YesNo == objMsgBoxBtns)
            {
                if (isWanPort)
                {
                    resPCn = MsgBox.Show(Convert.ToString(dicObj[MsgNo][1]), Convert.ToString(dicObj[MsgNo][0]), MessageBoxButtons.YesNo, null, connectedCaption, notConnectedCaption, isWanPort);
                }
                else
                {
                    resPCn = MsgBox.Show(Convert.ToString(dicObj[MsgNo][1]), Convert.ToString(dicObj[MsgNo][0]), MessageBoxButtons.YesNo, null, connectedCaption, notConnectedCaption, isWanPort);
                }
                if (resPCn == DialogResult.Yes)
                    return true;
            }
            else if (MessageBoxButtons.OK == objMsgBoxBtns)
            {
                if (MsgBox.Show(Convert.ToString(dicObj[MsgNo][1]), Convert.ToString(dicObj[MsgNo][0]), MessageBoxButtons.OK, Convert.ToString(dicObj[MsgNo][4])) == DialogResult.OK)
                    return true;
            }
            return false;
        }

        public string ExecuteCommandSync(object command)
        {
            string result = "";
            try
            {
                // create the ProcessStartInfo using "cmd" as the program to be run, and "/c " as the parameters.
                // Incidentally, /c tells cmd that we want it to execute the command that follows, and then exit.
                System.Diagnostics.ProcessStartInfo procStartInfo = new System.Diagnostics.ProcessStartInfo("cmd", "/c " + command);
                // The following commands are needed to redirect the standard output. 
                //This means that it will be redirected to the Process.StandardOutput StreamReader.
                procStartInfo.RedirectStandardOutput = true;
                procStartInfo.UseShellExecute = false;
                // Do not create the black window.
                procStartInfo.CreateNoWindow = true;
                // Now we create a process, assign its ProcessStartInfo and start it
                System.Diagnostics.Process proc = new System.Diagnostics.Process();
                proc.StartInfo = procStartInfo;
                proc.Start();

                // Get the output into a string
                result = proc.StandardOutput.ReadToEnd();

                // Display the command output.
                //Console.WriteLine(result);

            }
            catch (Exception objException)
            {
                // Log the exception
            }
            return result;
        }

        public void DisableEnableLanAdapter()
        {
            NetworkInterface[] ifaceList = NetworkInterface.GetAllNetworkInterfaces();
            foreach (NetworkInterface iface in ifaceList)
            {
                if (iface.OperationalStatus == OperationalStatus.Up)
                {
                    //netsh interface set interface "Network Adapter name" DISABLED 
                    //netsh interface set interface "Network Adapter name" ENABLED 
                    //MessageBox.Show(iface.Name);
                    ExecuteCommandSync("netsh interface set interface \"" + iface.Name + "\" DISABLED");
                    ExecuteCommandSync("netsh interface set interface \"" + iface.Name + "\" ENABLED");
                }
            }
        }

        bool connected = false;
        public void CheckEthernetStatus()
        {
            sbRouter.AppendLine("Checking the Network Adapter is Enabled or Disabled");
            System.Management.ManagementObjectSearcher searcher = new System.Management.ManagementObjectSearcher("SELECT * FROM Win32_NetworkAdapter");
            foreach (System.Management.ManagementObject networkAdapter in searcher.Get())
            {
                //SelectQuery query = new SelectQuery("Win32_NetworkAdapter", "NetConnectionStatus=2");
                //NetworkAdapter adapter = new NetworkAdapter(networkAdapter1);
                if (networkAdapter["NetConnectionStatus"] != null)
                {
                    if (Convert.ToInt32(networkAdapter["NetConnectionStatus"]).Equals(2))
                    {
                        connected = true;
                        //Console.WriteLine("Internet available and adapter is enabled......");
                        //DisableEnableLanAdapter();
                        break;
                    }
                    else
                    {
                        sbRouter.AppendLine("Network Adapter Enabled Started..");
                        //Console.WriteLine("No internet and adapter is disabled .....");
                        //Console.WriteLine("Adapter Enabled functoin called.....");
                        networkAdapter.InvokeMethod("Enable", null);
                        Thread.Sleep(500);
                        sbRouter.AppendLine("Network Adapter Enabled Completed..");
                        //Console.WriteLine("Adapter Enabled Completed.....");

                    }
                }
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
                //string strxmlau = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>";
                //string strxmlau = "<SOAP-ENV:Envelope xmlns:SOAPSDK1=\"http://www.w3.org/2001/XMLSchema\" xmlns:SOAPSDK2=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:SOAPSDK3=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                //
                string strxmlau = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmlau += "<SOAP-ENV:Header>";
                //strxmlau += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">58DEE6006A88A967E89A</SessionID>";
                strxmlau += "</SOAP-ENV:Header>";
                strxmlau += "<SOAP-ENV:Body><Authenticate>";
                //strxmlau += "<SOAP-ENV:Body><M1:Authenticate xmlns:M1=\"urn:NETGEAR-ROUTER:service:ParentalControl:1\">";
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
        /// Get attached devices
        /// </summary>
        /// <returns></returns>
        public List<ConnectedDevices> GetAttachedDevices()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //GetLog
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><GetAttachDevice>";
                strxmla += "</GetAttachDevice></SOAP-ENV:Body></SOAP-ENV:Envelope>";
                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceInfo:#GetAttachDevice";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);

                List<ConnectedDevices> lstDeviceinfo = new List<ConnectedDevices>();
                if (result == 0)
                {
                    XmlNodeList model = doc.GetElementsByTagName("NewAttachDevice");
                    string[] devDet = doc.GetElementsByTagName("NewAttachDevice").Item(0).InnerText.Split('@');
                    if (devDet.Length > 0)
                    {
                        for (int i = 1; i < devDet.Length; i++)
                        {
                            string[] devInfo = devDet[i].ToString().Split(';');
                            //for (int j = 0; j < devInfo.Length; j++)
                            //{
                            lstDeviceinfo.Add(new ConnectedDevices
                            {
                                IP = devInfo[1].ToString(),
                                Name = devInfo[2].ToString(),
                                MAC = devInfo[3].ToString(),
                                DevType = devInfo[4].ToString(),
                                LinkRate = devInfo[5].ToString(),
                                ConnectedCnt = 1,
                                WifiTimeDet = new List<IntermittenFreq>() { new IntermittenFreq() { ConnectedTime = DateTime.Now, DisConnectedTime = null, TimeDiff = 0 } },
                                //WifiTimeDet = new IntermittenFreq { ConnectedTime = DateTime.Now, DisConnectedTime = null, TimeDiff = 0 },
                                DisConnectedCnt = 0,
                            });
                            //}
                        }
                    }
                }
                //var deviceDetails = JsonConvert.SerializeObject(dicDeviceinfo);
                return lstDeviceinfo;
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("MainWindow.cs", "GetAttachedDevices()", "", ex.Message, ex.StackTrace, "ERROR");
                return null;
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
                requestau.Timeout = 300000;
                //requestau.KeepAlive = true;                
                requestau.UserAgent = "SOAP Toolkit 3.0";
                requestau.Host = "www.routerlogin.com";

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
            catch (WebException ex)
            {
                throw;
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

        /// <summary>
        /// functionality used to checking the availability of new firmware version 
        /// </summary>
        private int ConfigurationStart()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //SetConfig
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><ConfigurationStarted>";
                strxmla += "<NewSessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">58DEE6006A88A967E89A</NewSessionID>";
                strxmla += "</ConfigurationStarted></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:#ConfigurationStarted";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                return Convert.ToInt32(nodeList[0].InnerText);
            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        /// <summary>
        /// functionality used to checking the availability of new firmware version 
        /// </summary>
        private int ConfigurationFinished()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //SetConfig
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">58DEE6006A88A967E89A</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><ConfigurationFinished>";
                strxmla += "<NewStatus xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">ChangesApplied</NewStatus>";
                strxmla += "</ConfigurationFinished></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:#ConfigurationFinished";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                return Convert.ToInt32(nodeList[0].InnerText);
            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        /// <summary>
        /// functionality used to checking the availability of new firmware version 
        /// </summary>
        private Dictionary<string, string> Checkfirmware()
        {
            Dictionary<string, string> dicFirmwareDet = new Dictionary<string, string>();
            try
            {
                XmlDocument doc = new XmlDocument();
                //SetConfig
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><CheckNewFirmware>";
                strxmla += "</CheckNewFirmware></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:#CheckNewFirmware";
                string strRes = GetRouterSoapResponse(doc, soapAction);      //Soap request and response
                doc.LoadXml(strRes);
                XmlNodeList nodeList = doc.GetElementsByTagName("ResponseCode");
                int result = 0;
                result = Convert.ToInt32(nodeList[0].InnerText);

                if (result == 0)
                {
                    dicFirmwareDet.Add("CurrentVersion", doc.GetElementsByTagName("CurrentVersion").Item(0).InnerText);
                    dicFirmwareDet.Add("NewVersion", doc.GetElementsByTagName("NewVersion").Item(0).InnerText);
                }
                return dicFirmwareDet;
                //Doubt
            }
            catch (Exception ex)
            {
                return dicFirmwareDet;
            }
        }

        /// <summary>
        /// functionality used to checking the availability of new firmware version 
        /// </summary>
        private void RebootRouter()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //SetConfig
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><Reboot>";
                strxmla += "</Reboot></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:#Reboot";
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
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// functionality used to upgrade the firmware
        /// </summary>
        private static void Updatefirmware()
        {
            try
            {


                XmlDocument doc = new XmlDocument();
                //SetConfig
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><UpdateNewFirmware>";
                strxmla += "<YesOrNo xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">1</YesOrNo>";
                strxmla += "</UpdateNewFirmware></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:DeviceConfig:1#UpdateNewFirmware";
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
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// functionality used to check the Qos status
        /// </summary>
        private static void CheckQosStatus()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //SetConfig
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><GetQoSEnableStatus>";
                strxmla += "</GetQoSEnableStatus></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:AdvancedQoS:#GetQoSEnableStatus";
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
            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// functionality used to check the Qos status
        /// </summary>
        private static void EnableQosStatus()
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                //SetConfig
                string strxmla = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                strxmla += "<SOAP-ENV:Header>";
                //strxmla += "<SessionID xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">E6A88AE69687E58D9A00</SessionID>";
                strxmla += "</SOAP-ENV:Header>";
                strxmla += "<SOAP-ENV:Body><SetQoSEnableStatus>";
                strxmla += "<NewQoSEnable xsi:type=\"xsd:string\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\">1</NewQoSEnable>";
                strxmla += "</SetQoSEnableStatus></SOAP-ENV:Body></SOAP-ENV:Envelope>";

                doc.LoadXml(strxmla);
                string soapAction = "urn:NETGEAR-ROUTER:service:AdvancedQoS:1#SetQoSEnableStatus";
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
            //sbRouter.AppendLine("Checking ..GetDefaultGateway.");
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

        public bool checknetwork()
        {
            if (GetPingSuccessCount("google.com") >= 1)
            {
                chromiumBrowser.ExecuteScript("javascript:changenetworkicon('" + true + "','" + true + "')");
                return true;
            }
            else
            {
                chromiumBrowser.ExecuteScript("javascript:changenetworkicon('" + false + "','" + false + "')");
                return false;
            }


        }

        bool lastStatus = false;
        /// <summary>
        /// Used to checking the network disconnected or not
        /// </summary>
        /// <returns></returns>
        public bool isNetworkAvail()
        {

            string res = GetRouterLogDetails();
            logDetails = res;
            string sysIp = GetInfo()[0];

            string[] loglist = res.Split(new string[] { "\n" }, StringSplitOptions.None);
            Regex regex = new Regex(@"\[Internet (.*?)\]");
            Match mat = regex.Match(res);
            if (mat.Success)
            {
                sbRouter.AppendLine("Checking for Router Logs : Available");
                foreach (string log in loglist)
                {
                    if (log.IndexOf(mat.ToString()) != -1)
                    {
                        if (log.IndexOf("disconnected") > 0)
                        {
                            //sbRouter.AppendLine(log);
                            lastStatus = false;
                            sbRouter.AppendLine("Last time when the Internet was Disconnected : " + log);
                            break;
                            //sbRouter.AppendLine("You are disconnected from the internet");
                            //sbRouter.AppendLine(log);
                            //SetText("You are disconnected from the internet" + Environment.NewLine);
                        }
                        else
                        {
                            lastStatus = ((bool)IsWanIP(sysIp)["Online"]);
                        }

                    }
                }
            }
            else
            {
                //sbRouter.AppendLine("Log not found.Hence checking for WAN IP \"0.0.0.0\"");
                sbRouter.AppendLine("Checking for Router Logs : Unavailable");
                lastStatus = ((bool)IsWanIP(sysIp)["Online"]);

                //if (sysIp.Contains("0.0.0.0"))
                //{
                //    sbRouter.AppendLine("Found WAN IP as \"0.0.0.0\"");
                //    lastStatus = false;
                //}
                //else
                //{
                //    sbRouter.AppendLine("Found WAN IP as " + sysIp + " Hence Pinging..");
                //    if (GetPingSuccessCount(sysIp) == 4)
                //    {
                //        sbRouter.AppendLine("Ping Success for " + sysIp);
                //        lastStatus = true;
                //    }
                //    else
                //    {
                //        sbRouter.AppendLine("Ping Failed for " + sysIp);
                //        lastStatus = false;
                //    }
                //}

            }

            return lastStatus;
        }

        public static string[] GetInfo()
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
            routerAuthenticated = routerAuthentication("admin", "password");
            bool isValidIp = false;
            try
            {
                IPAddress strGateIp = GetDefaultGateway();
                if (strGateIp != null)
                {
                    if (!strGateIp.ToString().Contains("169.254"))
                    {
                        isValidIp = true;
                    }
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
            //sbRouter.AppendLine("Checking ..LogDisconnectedCount.");
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

        private static Dictionary<string, object> IsWanIP(string IpAddress = "")
        {
            bool iswanIP = false;
            string sysIp = string.Empty;
            IPHostEntry host;
            string localIp = "?";
            Dictionary<string, object> dictWanProperties = new Dictionary<string, object>();

            if (IpAddress.Trim() == "")
            {
                //string hostName = Dns.GetHostName();
                //host = Dns.GetHostEntry(hostName);

                //foreach (IPAddress ip in host.AddressList)
                //{
                //    if (ip.AddressFamily.ToString() == "InterNetwork")
                //    {
                //        sysIp = ip.ToString();
                //    }
                //    //localIp += " " + ip.AddressFamily.ToString() + " ";
                //}

                sysIp = GetInfo()[0];
            }
            else
            {
                sysIp = IpAddress;
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
                dictWanProperties.Add("Online", false);
                dictWanProperties.Add("IPAddress", "0.0.0.0");
                dictWanProperties.Add("IsWanIP", iswanIP);
                dictWanProperties.Add("Msg", "");

            }
            else
            {
                if (mat10.Success || mat172.Success || mat192.Success)
                {

                    // iswanIP = true;
                    Ping pinger = new Ping();
                    try
                    {
                        PingReply reply = pinger.Send("google.com");

                        if (reply.Status == IPStatus.Success)
                        {
                            sbRouter.AppendLine("Ping Website: Success (Ping www.google.com, got 4 Replies from " + reply.Address.ToString() + ")");
                            dictWanProperties.Add("Online", true);
                            dictWanProperties.Add("IPAddress", reply.Address.ToString());
                            dictWanProperties.Add("IsWanIP", true);
                            dictWanProperties.Add("Msg", "");
                        }
                        else
                        {
                            sbRouter.AppendLine("Ping Website: failed (Ping www.google.com)");
                            dictWanProperties.Add("Online", false);
                            dictWanProperties.Add("IPAddress", "");
                            dictWanProperties.Add("IsWanIP", false);
                            dictWanProperties.Add("Msg", "");
                        }
                    }
                    catch (PingException ex)
                    {
                        sbRouter.AppendLine("Ping Website: failed (Ping www.google.com)");
                        dictWanProperties.Add("Online", false);
                        dictWanProperties.Add("IPAddress", "");
                        dictWanProperties.Add("IsWanIP", false);
                        dictWanProperties.Add("Msg", "");
                    }
                }
                else //For Public Ips
                {
                    //Regex regexRange = new Regex(@"^([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$");
                    //Match matRange = regexRange.Match(sysIp);
                    //if (matRange.Success)
                    //{
                    try
                    {
                        Ping pinger = new Ping();

                        PingReply reply = pinger.Send("google.com");

                        if (reply.Status == IPStatus.Success)
                        {
                            sbRouter.AppendLine("Ping Website: Success (Ping www.google.com, got 4 Replies from " + reply.Address.ToString() + ")");
                            dictWanProperties.Add("Online", true);
                            dictWanProperties.Add("IPAddress", reply.Address.ToString());
                            dictWanProperties.Add("IsWanIP", true);
                            dictWanProperties.Add("Msg", "");
                        }
                        else
                        {
                            sbRouter.AppendLine("Ping Website: failed (Ping www.google.com)");
                            dictWanProperties.Add("Online", false);
                            dictWanProperties.Add("IPAddress", "");
                            dictWanProperties.Add("IsWanIP", false);
                            dictWanProperties.Add("Msg", "");
                        }
                    }
                    catch (PingException ex)
                    {
                        sbRouter.AppendLine("Ping Website: failed (Ping www.google.com)");
                        dictWanProperties.Add("Online", false);
                        dictWanProperties.Add("IPAddress", "");
                        dictWanProperties.Add("IsWanIP", false);
                        dictWanProperties.Add("Msg", "");
                    }
                    //}
                    //else
                    //{
                    //    dictWanProperties.Add("Online", false);
                    //    dictWanProperties.Add("IPAddress", "");
                    //    dictWanProperties.Add("IsWanIP", iswanIP);
                    //    dictWanProperties.Add("Msg", "Invalid Public IP");
                    //}
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
                        {
                            Success += 1;
                        }
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
        private static int GetPublicIPPingSuccessCount(string hostAddr)
        {
            int count = 0; int Success = 0;
            ErrorTracker.WriteLog("GetPublicIPPingSuccessCount :: " + hostAddr + " Pinging started...");
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
                for (int i = 0; i < 1; i++)
                {
                    PingReply reply =
                      pingSender.Send(hostAddr, timeout, data, options);
                    {
                        count += Convert.ToInt32(reply.RoundtripTime);
                        if (reply.Status == IPStatus.Success)
                        {
                            Success += 1;
                            ErrorTracker.WriteLog(hostAddr + " Pinging success Count---" + Success);
                            if (Success == 1 && !isPrivateIPchecked)
                            {
                                isPrivateIPchecked = true;
                                GetPublicIPPingSuccessCount(reply.Address.ToString());
                            }
                        }
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
                sbRouter.AppendLine("Pinging the Gateway IP " + addr.ToString());
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
                //notifyIcon.Dispose();
                dosAttackCnt = 0;
                if (aTimer != null)
                {
                    aTimer.Stop();
                    aTimer.Enabled = false;
                    aTimer = null;
                }
                if (wlanTimer != null)
                {
                    wlanTimer.Stop();
                    wlanTimer.Enabled = false;
                    wlanTimer = null;
                }
                if (wifiTimer != null)
                {
                    wifiTimer.Stop();
                    wifiTimer.Enabled = false;
                    wifiTimer = null;
                }
                if (Settings.Default.rememberPassword.ToString() == "false")
                {
                    Settings.Default.UserName = string.Empty;
                    Settings.Default.Password = string.Empty;
                }
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
                    dosAttackCnt = 0;
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


public class ConnectedDevices
{
    public string IP { get; set; }
    public string Name { get; set; }
    public string MAC { get; set; }
    public string DevType { get; set; }
    public string LinkRate { get; set; }
    public int ConnectedCnt { get; set; }
    public int DisConnectedCnt { get; set; }
    public List<IntermittenFreq> WifiTimeDet { get; set; }
    public bool isDisConnected { get; set; }
}

public class IntermittenFreq
{
    public DateTime ConnectedTime { get; set; }
    public DateTime? DisConnectedTime { get; set; }
    public int TimeDiff { get; set; }
}


enum Verbs
{
    WILL = 251,
    WONT = 252,
    DO = 253,
    DONT = 254,
    IAC = 255
}

enum Options
{
    SGA = 3
}

class TelnetConnection
{
    TcpClient tcpSocket;

    int TimeOutMs = 100;

    public TelnetConnection(string Hostname, int Port)
    {
        tcpSocket = new TcpClient(Hostname, Port);

    }

    public string Login(string Username, string Password, int LoginTimeOutMs)
    {
        int oldTimeOutMs = TimeOutMs;
        TimeOutMs = LoginTimeOutMs;
        string s = Read();
        //if (!s.TrimEnd().EndsWith(":"))
        //    throw new Exception("Failed to connect : no login prompt");
        //WriteLine(Username);

        //s += Read();
        //if (!s.TrimEnd().EndsWith(":"))
        //    throw new Exception("Failed to connect : no password prompt");
        //WriteLine(Password);

        //s += Read();
        TimeOutMs = oldTimeOutMs;
        return s;
    }

    public void WriteLine(string cmd)
    {
        Write(cmd + "\n");
    }

    public void Write(string cmd)
    {
        if (!tcpSocket.Connected) return;
        byte[] buf = System.Text.ASCIIEncoding.ASCII.GetBytes(cmd.Replace("\0xFF", "\0xFF\0xFF"));
        tcpSocket.GetStream().Write(buf, 0, buf.Length);
    }

    public string Read()
    {
        if (!tcpSocket.Connected) return null;
        StringBuilder sb = new StringBuilder();
        do
        {
            ParseTelnet(sb);
            System.Threading.Thread.Sleep(TimeOutMs);
        } while (tcpSocket.Available > 0);
        return sb.ToString();
    }

    public bool IsConnected
    {
        get { return tcpSocket.Connected; }
    }

    void ParseTelnet(StringBuilder sb)
    {
        //while (tcpSocket.Available > 0)
        //{
        int input = tcpSocket.GetStream().ReadByte();
        switch (input)
        {
            case -1:
                break;
            case (int)Verbs.IAC:
                // interpret as command
                int inputverb = tcpSocket.GetStream().ReadByte();
                if (inputverb == -1) break;
                switch (inputverb)
                {
                    case (int)Verbs.IAC:
                        //literal IAC = 255 escaped, so append char 255 to string
                        sb.Append(inputverb);
                        break;
                    case (int)Verbs.DO:
                    case (int)Verbs.DONT:
                    case (int)Verbs.WILL:
                    case (int)Verbs.WONT:
                        // reply to all commands with "WONT", unless it is SGA (suppres go ahead)
                        int inputoption = tcpSocket.GetStream().ReadByte();
                        if (inputoption == -1) break;
                        tcpSocket.GetStream().WriteByte((byte)Verbs.IAC);
                        if (inputoption == (int)Options.SGA)
                            tcpSocket.GetStream().WriteByte(inputverb == (int)Verbs.DO ? (byte)Verbs.WILL : (byte)Verbs.DO);
                        else
                            tcpSocket.GetStream().WriteByte(inputverb == (int)Verbs.DO ? (byte)Verbs.WONT : (byte)Verbs.DONT);
                        tcpSocket.GetStream().WriteByte((byte)inputoption);
                        break;
                    default:
                        break;
                }
                break;
            default:
                sb.Append((char)input);
                break;
        }
        //}
    }
}
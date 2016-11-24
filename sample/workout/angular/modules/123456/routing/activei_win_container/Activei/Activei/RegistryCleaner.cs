using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.ComponentModel;
using System.Threading;
using System.IO;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Runtime.InteropServices;
using Newtonsoft.Json.Linq;
using System.Collections;
using VTRegScan;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Threading;
using CustomizedClickOnce.Common;
using System.Security.Permissions;
using Activei.Tracker;

namespace Activei
{
    [PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
    public partial class MainWindow : Form
    {
        #region Registry Cleaner Global Variables
        /// <summary>
        /// Global Variable declaration for Registry Cleaner
        /// </summary>
        private cRegScan _RegScan;
        private ObservableCollection<ScanData> _Results = new ObservableCollection<ScanData>();
        private static cRestore _Restore = new cRestore();
        private static bool _bRestoreComplete = false;
        private static bool _bRestoreSucess = false;
        private static int _iRestoreCounter = 0;
        private static int _iKeyCounter = 0;
        private static int _iResultsCounter = 0;
        private static int _iSegmentCounter = 0;
        private static int _iProgressMax = 0;
        private static string _sLabel = "";
        private static string _sPhase = "";
        private static string _sMatch = "";
        private static string _sPath = "";
        private static string _sHive = "";
        private static string _sSegment = "";
        private static int[] _aSubScan;
        private static DateTime _dTime;
        private static TimeSpan _tTimeElapsed;
        private System.Windows.Forms.Timer regScanTimer;
        private System.Windows.Forms.Timer restoreTimer;
        private BackgroundWorker _oProcessAsyncBackgroundWorker = null;
        #endregion

        #region Registry Cleaner Property
        private bool IsTimerOn { get; set; }
        #endregion

        #region Do Registry Cleaner

        #region ResetContext
        /// <summary>
        /// Resetting Context Controls
        /// </summary>
        private void ResetContext()
        {
            // reset panel vars
            //lblScanNameValue.Text = string.Empty;
            //lblScanDescValue.Text = string.Empty;
            //lblSubKeyValue.Text = string.Empty;
            //lblScanHiveValue.Text = string.Empty;
            //lblKeyCountValue.Text = string.Empty;
            //lblLastMatchValue.Text = string.Empty;
            //lblMatchCountValue.Text = string.Empty;
            //lblSegRemainValue.Text = string.Empty;
            //lblSegScanValue.Text = string.Empty;
            //lblTimeValue.Text = string.Empty;
            // reset counters
            this.IsTimerOn = false;
            _iKeyCounter = 0;
            _iResultsCounter = 0;
            _iSegmentCounter = 0;
            _iProgressMax = 0;
            _sSegment = "";
        }
        #endregion

        #region Show Registry Cleaner
        /// <summary>
        /// Show Registry Cleaner Pannel
        /// </summary>
        public void showRegistryCleaner()
        {
            try
            {
                //Initializing Registry Scanner
                initiateRegScan();
                ResetEngine();
                ResetData();
                ResetContext();
                //regResultsGrpBox.Visible = false;
                //btnScanRegistry.Visible = true;
                //regScanningGrpBox.Visible = false;
                //registryCleanerPanel.Visible = true;
                //regScanGroupBox.Visible = true;
                //btnViewResults.Visible = false;
                //btnFixAll.Visible = false;
                //btnStopScan.Visible = false;
                //registryCleanerPanel.BringToFront();
                //regScanGroupBox.BringToFront();
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("RegistryCleaner.cs", "showRegistryCleaner", "", ex.Message, ex.StackTrace, "ERROR");
                //ShowMessage(ex.Message, SystemToolsProxy.MessageType.Error);
            }
        }
        #endregion

        #region btnScanRegistry_Click
        #region "Registry global variable declaration"

        bool isControlScan = false;
        bool isUserScan = false;
        bool isSysSoftwareScan = false;
        bool isSysFontScan = false;

        bool issysHelipFilesScan = false;
        bool isSharedLibScan = false;
        bool isStartUpScan = false;
        bool isInstallationstrScan = false;

        bool isVirtualDevScan = false;
        bool isHistoryScan = false;
        bool isDeepScan = false;
        bool isMRUlstScan = false;
        bool isSysRestoreScan = false;

        #endregion
        /// <summary>
        /// Start Scaning Registry Based on the Options
        /// </summary>
        /// <param name="sender">Click Sender Event</param>
        /// <param name="e">Event Agrmument</param>
        public void startRegistryScan(bool ischkControlScan, bool ischkUserScan, bool ischkSysSoftwareScan, bool ischkSysFontScan,
            bool ischksysHelipFilesScan, bool ischkSharedLibScan, bool ischkStartUpScan, bool ischkInstallationstrScan,
            bool ischkVirtualDevScan, bool ischkHistoryScan, bool ischkDeepScan, bool ischkMRUlstScan, bool ischkSysRestoreScan)
        {
            try
            {
                isControlScan = ischkControlScan;
                isUserScan = ischkUserScan;
                isSysSoftwareScan = ischkSysSoftwareScan;
                isSysFontScan = ischkSysFontScan;

                issysHelipFilesScan = ischksysHelipFilesScan;
                isSharedLibScan = ischkSharedLibScan;
                isStartUpScan = ischkStartUpScan;
                isInstallationstrScan = ischkInstallationstrScan;

                isVirtualDevScan = ischkVirtualDevScan;
                isHistoryScan = ischkHistoryScan;
                isDeepScan = ischkDeepScan;
                isMRUlstScan = ischkMRUlstScan;
                isSysRestoreScan = ischkSysRestoreScan;

                scanSetup();
                _RegScan.AsyncScan();
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("RegistryCleaner.cs", "startRegistryScan", "", ex.Message, ex.StackTrace, "ERROR");
                throw ex;
            }
        }
        #endregion

        #region btnStopScan_Click
        /// <summary>
        /// Stop Registry Scan
        /// </summary>
        /// <param name="sender">Sender Object</param>
        /// <param name="e">Event Argument</param>
        public void stopRegistryScan()
        {
            ScanStop();
        }
        #endregion

        #region Reset Engine
        /// <summary>
        /// Reset Scan Engine
        /// </summary>
        private void ResetEngine()
        {
            _RegScan.CancelProcessAsync();
            _RegScan.Data.Clear();
        }
        #endregion

        #region Scan Setup
        /// <summary>
        /// Setting Prelist for Scaning Registry Object
        /// </summary>
        private void scanSetup()
        {
            _dTime = DateTime.Now;
            _aSubScan = new int[12];

            ////Initiating Timmer
            regScanTimer.Enabled = true;

            this.IsTimerOn = true;

            //Setting Up the Registry Params

            _RegScan.ScanControl = isControlScan;
            _RegScan.ScanUser = isUserScan;
            _RegScan.ScanFile = isSysSoftwareScan;
            _RegScan.ScanFont = isSysFontScan;
            _RegScan.ScanHelp = issysHelipFilesScan;
            _RegScan.ScanSharedDll = isSharedLibScan;
            _RegScan.ScanStartupEntries = isStartUpScan;
            _RegScan.ScanUninstallStrings = isInstallationstrScan;
            _RegScan.ScanVDM = isVirtualDevScan;
            _RegScan.ScanHistory = isHistoryScan;
            _RegScan.ScanDeep = isDeepScan;
            _RegScan.ScanMru = isMRUlstScan;
        }
        #endregion

        #region Initiating Registry Scan Objects
        /// <summary>
        /// Initiating Registry Scan Objects
        /// </summary>
        private void initiateRegScan()
        {
            _RegScan = new cRegScan();
            _RegScan.CurrentPath += new cRegScan.CurrentPathDelegate(RegScan_CurrentPath);
            _RegScan.KeyCount += new cRegScan.KeyCountDelegate(RegScan_KeyCount);
            _RegScan.LabelChange += new cRegScan.LabelChangeDelegate(RegScan_LabelChange);
            _RegScan.MatchItem += new cRegScan.MatchItemDelegate(RegScan_MatchItem);
            _RegScan.ProcessChange += new cRegScan.ProcessChangeDelegate(RegScan_ProcessChange);
            _RegScan.ProcessCompleted += new cRegScan.ProcessCompletedEventHandler(RegScan_ProcessCompleted);
            _RegScan.ScanComplete += new cRegScan.ScanCompleteDelegate(RegScan_ScanComplete);
            _RegScan.SubScanComplete += new cRegScan.SubScanCompleteDelegate(RegScan_SubScanComplete);
            _RegScan.ScanCount += new cRegScan.ScanCountDelegate(RegScan_ScanCount);
            _RegScan.StatusChange += new cRegScan.StatusChangeDelegate(RegScan_StatusChange);
            // text updates using timer setup            
            regScanTimer.Interval = 1000;
            regScanTimer.Enabled = false;
            regScanTimer.Tick += new EventHandler(regScanTimer_Tick);
        }
        #endregion

        #region Library Events
        private void RegScan_CurrentPath(string hive, string path)
        {
            _sHive = hive;
            _sPath = path;
        }

        private void RegScan_KeyCount()
        {
            _iKeyCounter += 1;
        }

        private void RegScan_LabelChange(string phase, string label)
        {
            _sPhase = phase;
            _sLabel = label;
        }

        private void RegScan_MatchItem(cLightning.ROOT_KEY root, string key, string value, string data, RESULT_TYPE id)
        {
            _sMatch = data;
            _iResultsCounter += 1;
        }

        private void RegScan_ProcessChange()
        {
            _iSegmentCounter += 1;
        }

        private void RegScan_ProcessCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            _sSegment = "Scan Complete!";
        }

        private void RegScan_ScanComplete()
        {
            _sSegment = "Scan Complete!";
            this.IsTimerOn = false;
        }

        private void RegScan_ScanCount(int count)
        {
            _iProgressMax = count;
        }

        private void RegScan_StatusChange(string label)
        {
            _sSegment = label;
        }

        private void RegScan_SubScanComplete(string id)
        {
            SubProgressCounter(id);
        }

        private void _aRestoreTimer_Tick(object sender, EventArgs e)
        {
            _iRestoreCounter += 1;
            if (_iRestoreCounter > 1000)
            {
                _iRestoreCounter = 1;
            }
            //prgRestore.Value = _iRestoreCounter;
        }

        private static void SubProgressCounter(string id)
        {
            switch (id)
            {
                case "CONTROL":
                    _aSubScan[0] = 100;
                    break;
                case "USER":
                    _aSubScan[1] = 100;
                    break;
                case "SOFTWARE":
                    _aSubScan[2] = 100;
                    break;
                case "FONT":
                    _aSubScan[3] = 100;
                    break;
                case "HELP":
                    _aSubScan[4] = 100;
                    break;
                case "SHAREDDLL":
                    _aSubScan[5] = 100;
                    break;
                case "STARTUP":
                    _aSubScan[6] = 100;
                    break;
                case "UNINSTALL":
                    _aSubScan[7] = 100;
                    break;
                case "VDM":
                    _aSubScan[8] = 100;
                    break;
                case "HISTORY":
                    _aSubScan[9] = 100;
                    break;
                case "DEEP":
                    _aSubScan[10] = 100;
                    break;
                case "MRU":
                    _aSubScan[11] = 100;
                    break;
            }
        }
        #endregion

        #region Stop Scan
        /// <summary>
        /// Stop Registry Scanning
        /// </summary>
        private void ScanStop()
        {
            ResetData();
            //btnStopScan.Visible = false;
            //btnViewResults.Visible = true;
            this.IsTimerOn = false;
            regScanTimer.Enabled = false;
            chromiumBrowser.ExecuteScript("javascript:scanCompleted();");
            //GearHeadMessageBox.Instance.Show("Scan completed successfully", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        #endregion

        #region ResetData
        /// <summary>
        /// Resetting Scan Data to Data Grid 
        /// </summary>
        private void ResetData()
        {
            //if (dgScanResults.DataSource != null)
            //{
            //    dgScanResults.DataSource = null;
            //}
            if (_RegScan.Data.Count > 0)
            {
                _Results = new ObservableCollection<ScanData>(_RegScan.Data);
                //dgScanResults.AutoGenerateColumns = false;
                //dgScanResults.DataSource = _Results;
                //btnFixAll.Enabled = true;
            }
            else
            {
                //btnFixAll.Enabled = false;
            }
        }


        #endregion

        #region Timer Tick
        /// <summary>
        /// Timer Tick
        /// </summary>
        /// <param name="sender">Timer Tick</param>
        /// <param name="e">Event Args</param>
        private void regScanTimer_Tick(object sender, EventArgs e)
        {
            bool isScanCompleted = false;
            StringBuilder scanValues = new StringBuilder();
            _tTimeElapsed = DateTime.Now.Subtract(_dTime);
            scanValues.Append("{");
            scanValues.Append("\"scanName\":\"" + _sPhase + "\",");
            scanValues.Append("\"scanDescription\":\"" + _sLabel + "\",");
            scanValues.Append("\"matchCount\":\"" + _iResultsCounter.ToString() + "\",");
            scanValues.Append("\"lastMatch\":\"" + ((_sMatch.Length > 0) ? _sMatch : string.Empty) + "\",");
            scanValues.Append("\"scanHive\":\"" + _sHive + "\",");
            scanValues.Append("\"subKey\":\"" + _sPhase + "\",");
            scanValues.Append("\"keyCount\":\"" + _iKeyCounter.ToString() + "\",");
            scanValues.Append("\"segmentsScanned\":\"" + _iSegmentCounter.ToString() + "\",");
            scanValues.Append("\"segmentsRemaining\":\"" + (_iProgressMax - _iSegmentCounter).ToString() + "\",");
            scanValues.Append("\"timeElapsed\":\"" + ((int)_tTimeElapsed.TotalSeconds).ToString() + " seconds" + "\"");
            scanValues.Append("}");

            //lblScanDescValue.Text = _sLabel;
            //lblSubKeyValue.Text = _sPath;
            //lblScanHiveValue.Text = _sHive;
            //lblKeyCountValue.Text = _iKeyCounter.ToString();

            // if (_sMatch.Length > 0)
            // {
            //lblLastMatchValue.Text = _sMatch;
            // }
            //lblMatchCountValue.Text = _iResultsCounter.ToString();

            //lblSegRemainValue.Text = (_iProgressMax - _iSegmentCounter).ToString();
            //lblSegScanValue.Text = _iSegmentCounter.ToString();

            ////_pnlRegScanActive.prgMain.Maximum = _iProgressMax;
            ////_pnlRegScanActive.prgMain.Value = _iSegmentCounter;
            ////this.txtStatusBar.Text = _sSegment;
            ////SubProgressUpdate();


            //lblTimeValue.Text = ((int)_tTimeElapsed.TotalSeconds).ToString() + " seconds";
            if (this.IsTimerOn == false)
            {
                ////_pnlRegScanActive.prgMain.Value = _iProgressMax;
                ScanStop();
                
            }
            // MessageBox.Show(scanValues.ToString());
            chromiumBrowser.ExecuteScript("javascript:setScannedFileDetails('" + scanValues.ToString() + "');");
        }
        #endregion

        #region btnViewResults_Click
        /// <summary>
        /// View Registry Scan Results 
        /// </summary>
        /// <param name="sender">Sender Object</param>
        /// <param name="e">Event Argument</param>
        public string scannedRegistryFiles;
        public string viewScannedRegistryFiles()
        {
            List<RegistryDetails> lstRegistryDetails = new List<RegistryDetails>();
            foreach (var item in _Results)
            {
                RegistryDetails registryDetails = new RegistryDetails();
                registryDetails.Check = item.Check;
                registryDetails.Root = item.Root.ToString();
                registryDetails.Key = item.Key;
                registryDetails.Name = item.Name;
                registryDetails.Value = item.Value;
                registryDetails.Data = item.Data;
                registryDetails.ImagePath = item.ImagePath;
                registryDetails.Id = item.Id;
                registryDetails.Scope = item.Scope;
                registryDetails.RootValue = item.Root;
                lstRegistryDetails.Add(registryDetails);
            }
            return JsonConvert.SerializeObject(lstRegistryDetails);
        }

        public class RegistryDetails
        {
            public bool Check { get; set; }
            public string Root { get; set; }
            public string Key { get; set; }
            public string Name { get; set; }
            public string Value { get; set; }
            public string Data { get; set; }
            public string ImagePath { get; set; }
            public int Id { get; set; }
            public int Scope { get; set; }
            public cLightning.ROOT_KEY RootValue { get; set; }

        }

        #endregion

        #region btnFixAll_Click
        /// <summary>
        /// Fix All
        /// </summary>
        /// <param name="sender">Sender Object</param>
        /// <param name="e">Event Argument</param>
        public void fixRegistryClean(string selectedRegistry)
        {
            try
            {
                List<RegistryDetails> selectedRegistryDetails = JsonConvert.DeserializeObject<List<RegistryDetails>>(selectedRegistry);
                _Results.Clear();
                foreach (var item in selectedRegistryDetails)
                {
                    _Results.Add(new ScanData(item.RootValue, item.Key, item.Value, item.Data, item.ImagePath, item.Name, item.Scope, item.Id));

                }
                RemoveItems();
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("RegistryCleaner.cs", "fixRegistryClean", "", ex.Message, ex.StackTrace, "ERROR");
                throw ex;
            }
        }
        #endregion

        #region Do Restore Operation
        /// <summary>
        /// Restore Progress Start
        /// Do Asyn Background worker
        /// Completed Assign Background worker
        /// </summary>
        private void RestoreProgressStart()
        {
            _dTime = DateTime.Now;
            _bRestoreComplete = false;
            restoreTimer.Enabled = true;
            // launch restore on a new thread
            _oProcessAsyncBackgroundWorker = new BackgroundWorker();
            _oProcessAsyncBackgroundWorker.WorkerSupportsCancellation = true;
            _oProcessAsyncBackgroundWorker.DoWork += new DoWorkEventHandler(_oProcessAsyncBackgroundWorker_DoWork);
            _oProcessAsyncBackgroundWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(_oProcessAsyncBackgroundWorker_RunWorkerCompleted);
            _oProcessAsyncBackgroundWorker.RunWorkerAsync();

            double safe = 0;
            do
            {
                DoEvents();
                _tTimeElapsed = DateTime.Now.Subtract(_dTime);
                safe = _tTimeElapsed.TotalSeconds;
                // break at 5 minutes, something has gone wrong
                if (safe > 300)
                {
                    break;
                }
            } while (_bRestoreComplete != true);
        }

        #region DoEvents
        /// <summary>
        /// Do Async Events Using Dispatcher Frame
        /// </summary>
        private static void DoEvents()
        {

            DispatcherFrame frame = new DispatcherFrame(true);
            Dispatcher.CurrentDispatcher.BeginInvoke(
            DispatcherPriority.Background, (SendOrPostCallback)delegate(object arg)
            {
                var f = arg as DispatcherFrame;
                f.Continue = false;
            },
            frame
            );
            Dispatcher.PushFrame(frame);
        }
        #endregion

        private void _oProcessAsyncBackgroundWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            _bRestoreComplete = true;
        }

        private void _oProcessAsyncBackgroundWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            _bRestoreComplete = false;
            _bRestoreSucess = _Restore.StartRestore("Scan-X Restore Point");

        }
        #endregion

        #region Remove Item from Registry
        /// <summary>
        /// Remove Registry Items with Restore
        /// </summary>
        private void RemoveItems()
        {
                bool res = false;
                bool val = false;
                bool ret = false;
                int items = 0;

                // test for checked items first
                foreach (ScanData o in _Results)
                {
                    if (o.Check == true)
                    {
                        val = true;
                        break;
                    }
                }
                if (val)
                {
                    //set a restore point

                    //res = chkRestore.Checked;
                    res = isSysRestoreScan;

                    if (res)
                    {
                        DialogResult chc = new DialogResult();
                        this.Invoke(new MethodInvoker(delegate
                        {
                            chc = GearHeadMessageBox.Instance.Show("Would you like to create a System Restore Point before proceeding? The Restore process may take several minutes to complete",
                                        "System Restore", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                        }));
                        if (chc == DialogResult.Yes)
                        {
                            // restore visual
                            RestoreProgressStart();
                            if (!_bRestoreSucess)
                            {
                                RestoreProgressStop();
                                res = false;
                                DialogResult msg = new DialogResult();
                                this.Invoke(new MethodInvoker(delegate
                                {
                                     msg = GearHeadMessageBox.Instance.Show("System Restore is either disabled or unavailable on this computer. " +
                                        "Do you wish to set up System Restore before proceeding? Without System Restore, changes to your system can Not be Undone",
                                                "Restore Disabled!", MessageBoxButtons.YesNoCancel, MessageBoxIcon.Warning);
                                }));
                                if (msg == DialogResult.Yes)
                                {
                                    if (!ShowProtection())
                                    {
                                        //chkRestore.Checked = false;
                                        isSysRestoreScan = false;
                                        showRegistryCleaner();
                                    }
                                    return;
                                }
                                else if (msg == DialogResult.No)
                                {
                                    //chkRestore.Checked = false;
                                    isSysRestoreScan = false;
                                    showRegistryCleaner();
                                }
                                else
                                {
                                    return;
                                }
                            }
                            else
                            {
                                RestoreProgressStop();
                            }
                        }
                    }

                    cLightning lightning = new cLightning();

                    // iterate through and remove
                    foreach (ScanData o in _Results)
                    {
                        if (o.Check == true)
                        {
                            switch (o.Id)
                            {
                                // delete value
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 7:
                                case 9:
                                case 10:
                                case 11:
                                case 12:
                                case 13:
                                case 14:
                                case 15:
                                case 16:
                                case 17:
                                case 18:
                                case 19:
                                case 21:
                                case 22:
                                case 23:
                                case 24:
                                case 25:
                                case 26:
                                case 27:
                                    {
                                        if (o.Value == "Default")
                                        {
                                            o.Value = "";
                                        }
                                        ret = lightning.DeleteValue(o.Root, o.Key, o.Value);
                                        if (ret == false)
                                        {
                                            ModSecVal(o.Root, o.Key, cSecurity.eInheritenceFlags.Child_Inherit_Level);
                                            ret = lightning.DeleteValue(o.Root, o.Key, o.Value);
                                        }
                                        items += 1;
                                        break;
                                    }
                                // delete key
                                case 6:
                                case 8:
                                    {
                                        ret = (lightning.DeleteKey(o.Root, o.Key));
                                        if (ret == false)
                                        {
                                            ModSecVal(o.Root, o.Key, cSecurity.eInheritenceFlags.Container_Inherit);
                                            ret = lightning.DeleteValue(o.Root, o.Key, o.Value);
                                        }
                                        items += 1;
                                        break;
                                    }
                                // recreate value
                                case 20:
                                    {
                                        ret = (lightning.DeleteValue(o.Root, o.Key, o.Value));
                                        lightning.WriteMulti(o.Root, o.Key, "VDD", "");
                                        items += 1;
                                        break;
                                    }

                            }
                        }
                    }
                    // finalize restore
                    if (res)
                    {
                        _Restore.EndRestore(false);
                    }
                    showRegistryCleaner();
                }
                else
                {
                    DialogResult can = new DialogResult();
                    this.Invoke(new MethodInvoker(delegate
                    {
                         can = GearHeadMessageBox.Instance.Show("You haven't selected any items for removal. To Reset the Scan Results, select Cancel",
                                    "No Items Selected", MessageBoxButtons.OKCancel, MessageBoxIcon.Exclamation);
                    }));
                    if (can == DialogResult.Cancel)
                    {
                        showRegistryCleaner();
                    }
                }
        }

        private void ModSecVal(cLightning.ROOT_KEY RootKey, string SubKey, cSecurity.eInheritenceFlags flags)
        {
            string sKey = RootKey.ToString();
            cSecurity sec = new cSecurity();
            string name = sec.UserName(cSecurity.EXTENDED_NAME_FORMAT.NameSamCompatible);

            if (name == null)
            {
                name = sec.UserName();
            }
            sKey += @"\" + SubKey;
            sec.ChangeObjectOwnership(sKey, cSecurity.SE_OBJECT_TYPE.SE_REGISTRY_KEY);
            sec.ChangeKeyPermissions((cSecurity.ROOT_KEY)RootKey, SubKey, name, cSecurity.eRegistryAccess.Registry_Full_Control, cSecurity.eAccessType.Access_Allowed, flags);
        }

        private void RestoreProgressStop()
        {
            restoreTimer.Enabled = false;
            _iRestoreCounter = 0;
        }

        private bool ShowProtection()
        {
            string path = Environment.GetFolderPath(Environment.SpecialFolder.System) + @"\SystemPropertiesProtection.exe";
            if (_RegScan.FileExists(path))
            {
                if (Process.Start(path) != null)
                {
                    return true;
                }
            }
            return false;
        }
        #endregion

        #region btnRestoreRegistry_Click
        /// <summary>
        /// Do Restore Registry File
        /// </summary>
        /// <param name="sender">Items Object Sender</param>
        /// <param name="e">Event Object Sender</param>
        public void restoreRegistry()
        {
            ShowRestore();
        }

        private void ShowRestore()
        {
            string path = Environment.GetFolderPath(Environment.SpecialFolder.System) + @"\rstrui.exe";
            if (_RegScan.FileExists(path))
            {
                Process.Start(path);
            }
        }
        #endregion

        //private void InitializeComponent()
        //{
        //    this.components = new System.ComponentModel.Container();
            //this.regScanTimer = new System.Windows.Forms.Timer(this.components);
            //this.restoreTimer = new System.Windows.Forms.Timer(this.components);
            //this.SuspendLayout();
            //// 
            //// regScanTimer
            //// 
            //this.regScanTimer.Interval = 1000;
            //// 
            //// restoreTimer
            //// 
            //this.restoreTimer.Interval = 1000;
            //// 
            //// MainWindow
        //    // 
        //    this.ClientSize = new System.Drawing.Size(284, 261);
        //    this.Name = "MainWindow";
        //    this.ResumeLayout(false);

        //}
        #endregion
    }
}

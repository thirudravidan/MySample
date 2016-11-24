using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.ComponentModel;
using System.Threading;
using System.IO;
using System.Configuration;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Runtime.InteropServices;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Text.RegularExpressions;
using Microsoft.Win32.TaskScheduler;
using Microsoft.Win32;
using System.Security.AccessControl;
using System.Net;
using Activei.Defragmentation;
using Activei.Tracker;
using System.Globalization;


namespace Activei
{
    public partial class MainWindow : IDefragmentation
    {
        public static bool isJunkFile { get; set; }
        public static bool isInternetOptimizer { get; set; }
        public static bool isDiskperformancr { get; set; }
        public static int completedCnt = 1;
        CommandObj commandObj = null;
        bool isDeleteSelectedFiles = false;

        public string formattedAnalysisReport;

        public string scanHistory;

        public string getHistory()
        {
            return scanHistory;
        }

        public void doPCOptimization(bool chkJunkFiles, bool chkInternetOpt, bool chkDiskPerf)
        {
            try
            {
                //isScanningInprogress = true;


                if (chkJunkFiles == false && chkInternetOpt == false && chkDiskPerf == false)
                {
                    chkJunkFiles = true;
                    chkInternetOpt = true;
                }
                isJunkFile = chkJunkFiles;
                isInternetOptimizer = chkInternetOpt;
                isDiskperformancr = chkDiskPerf;
                if (!chkJunkFiles || !chkInternetOpt)
                {
                    if (junkFileSpecificationsList != null)
                    {
                        junkFileSpecificationsList.Clear();
                    }
                }


                if (chkJunkFiles || chkInternetOpt)
                {
                    if (pcoptBackgroundWorker.IsBusy == false)
                    {
                        pcoptBackgroundWorker.RunWorkerAsync();
                    }
                }
                else if (chkDiskPerf)
                {
                    StartDefragmentation();
                }


            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "doPCOptimization", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }


        public void StartDefragmentation()
        {
            try
            {
                List<String> arguments = new List<string>();
                String argument = String.Empty;

                //Now.. Lets build our command with its arguments...
                /*
                 * -a : Analyse
                 * -f : Force defragment even if free space is lower than required
                 * -v : Get the verbose output (Detailed Analysis Report)
                 */
                List<string> selectedDrives = SystemToolsProxy.GetSystemDrives();

                for (int index = 0; index < selectedDrives.Count; index++)
                {
                    argument = selectedDrives[index].ToString().Replace("\\", "").ToLower();

                    argument = argument + " -a ";
                    //argument = argument + " -v ";

                    arguments.Add(argument);
                }


                Dictionary<String, object> objArgument = new Dictionary<string, object>();
                objArgument.Add("DefragArguements", arguments);

                //Let's defragment in the background...
                BackgroundWorker uxBGProcess1 = new BackgroundWorker();
                uxBGProcess1.WorkerSupportsCancellation = true;
                uxBGProcess1.RunWorkerCompleted += new RunWorkerCompletedEventHandler(uxBGProcess_RunWorkerCompleted);
                uxBGProcess1.DoWork += new DoWorkEventHandler(uxBGProcess_DoWork);
                //LogMessage.WriteLogInfo("DefragmentationService.cs : PerformOperation() :: uxBGProcess background worker was initiated to start the Analyze/Defragmentation process.");

                //Trigger the worker thread...
                uxBGProcess1.RunWorkerAsync((object)objArgument);
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationService.cs : uxBGProcess_DoWork() :: " + ex.Message);
                ErrorTracker.WriteErrorLog("PCOptimization.cs", "StartDefragmentation()", "", ex.Message, ex.StackTrace, "Error");
            }
            //uxScanScheduleButton.Visible = false;
        }

        private void uxBGProcess_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                Dictionary<String, object> objArgument = (Dictionary<String, object>)e.Argument;
                List<String> arguements = (List<String>)objArgument["DefragArguements"];

                StringBuilder output = new StringBuilder();
                output.AppendLine();

                foreach (String argument in arguements)
                {
                    string driveName = argument.Substring(0, 1).ToUpper();
                    output.AppendLine("Drive Name :" + driveName.ToUpper());
                    output.AppendLine("-----------------------------------");
                    commandObj = new CommandObj();
                    commandObj.ProcessName = DefragmentationConstants.PROCESS_NAME;
                    String result = commandObj.Run(DefragmentationConstants.DEFRAGMENTATION, argument, DefragmentationConstants.DEFRAGMENTATION + ".out", "");
                    output.AppendLine(result);
                    output.AppendLine(); output.AppendLine();

                    if (commandObj.IsCancelled) return;
                    //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_DoWork() : Analyze/Defragmentation process was completed for " + argument.Substring(0, 1).ToUpper() + "' Drive");
                }

                e.Result = output.ToString();
                //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_DoWork() : Analyze/Defragmentation process was completed for all selected drives.");
            }
            catch (Exception ex)
            {
                e.Cancel = true;
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "uxBGProcess_DoWork", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        private void uxBGProcess_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {
                string junkfilelistCount = string.Empty;
                //isScanningInprogress = false;
                //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() method invoked.");
                if (commandObj.IsCancelled)
                {
                    //uxDPSStatusPictureBox.Enabled = false;
                    //uxDPSStatusPictureBox.Image = Properties.Resources.red;
                    junkfilelistCount = (junkFileSpecificationsList != null) ? junkFileSpecificationsList.Count.ToString() : "0";
                    chromiumBrowser.ExecuteScript("javascript:diskPerformanceShow('" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "','" + junkfilelistCount + "','False','" + commandObj.IsCancelled + "')");
                    //StopDefragmentation();

                    //uxStatusPanel.Visible = true;
                    //uxJunkFilesProblemStatus.Visible = true;
                    //if (string.IsNullOrEmpty(uxJunkFilesProblemStatus.Text) == false)
                    //{
                    //    uxFixAllButton.Visible = true;
                    //    uxShowDetailsButton.Visible = true;
                    //}
                    //uxJunkFilesProblemStatus.Text = string.IsNullOrEmpty(uxJunkFilesProblemStatus.Text) ? "Disk Analysis cancelled by user" : uxJunkFilesProblemStatus.Text + " " + " Disk Analysis cancelled by user";
                }
                else if (e.Cancelled)
                {
                    //String message = String.Empty;
                    //message = defragModel.Analyse ? DefragmentationConstants.ERROR_ANALYSE : DefragmentationConstants.ERROR_DEFRAGMENT;
                    //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() : " + message);
                    //defragModel.Report = message;
                }
                else if (e.Result != null)
                {
                    if (commandObj.Result.Contains("The disk defragmenter cannot start because you have insufficient priveleges to perform this operation"))
                    {
                        //uxDPSStatusPictureBox.Enabled = false;
                        //uxDPSStatusPictureBox.Image = Properties.Resources.red;
                        //uxStatusPanel.Visible = true;
                        //uxJunkFilesProblemStatus.Visible = true;
                        //if (string.IsNullOrEmpty(uxJunkFilesProblemStatus.Text) == false)
                        //{
                        //    uxFixAllButton.Visible = true;
                        //    uxShowDetailsButton.Visible = true;
                        //}
                        //uxJunkFilesProblemStatus.Text = string.IsNullOrEmpty(uxJunkFilesProblemStatus.Text) ? "Insufficient priveleges to perform Disk Analysis" : uxJunkFilesProblemStatus.Text + " " + " Insufficient priveleges to perform Disk Analysis";
                        junkfilelistCount = (junkFileSpecificationsList != null) ? junkFileSpecificationsList.Count.ToString() : "0";
                        chromiumBrowser.ExecuteScript("javascript:diskPerformanceShow('" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "','" + junkfilelistCount + "','False','" + commandObj.IsCancelled + "')");
                    }
                    else
                    {

                        //uxDPSStatusPictureBox.Enabled = false;
                        //uxDPSStatusPictureBox.Image = Properties.Resources.green;
                        //uxDiskPerformanceScanLinkLabel.Visible = true;
                        formattedAnalysisReport = BuildAnalysisReport(e.Result.ToString());
                        junkfilelistCount = (junkFileSpecificationsList == null) ? "0" : junkFileSpecificationsList.Count.ToString();
                        chromiumBrowser.ExecuteScript("javascript:diskPerformanceShow('" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "','" + junkfilelistCount + "','True','" + commandObj.IsCancelled + "')");
                        //uxDiskPerformanceScanReportWebBrowser.DocumentText = formattedAnalysisReport;
                        //uxStatusPanel.Visible = true;
                        //uxJunkFilesProblemStatus.Visible = true;
                        //if (string.IsNullOrEmpty(uxJunkFilesProblemStatus.Text) == false)
                        //{
                        //    uxFixAllButton.Visible = true;
                        //    uxShowDetailsButton.Visible = true;
                        //}
                        //uxJunkFilesProblemStatus.Text = string.IsNullOrEmpty(uxJunkFilesProblemStatus.Text) ? "Disk performance analysis completed." : uxJunkFilesProblemStatus.Text + " " + " Disk performance analysis completed.";
                    }
                }
                else
                {
                    if (commandObj.Result.Contains("The disk defragmenter cannot start because you have insufficient priveleges to perform this operation"))
                    {
                        //uxDPSStatusPictureBox.Enabled = false;
                        //uxDPSStatusPictureBox.Image = Properties.Resources.red;
                        //uxStatusPanel.Visible = true;
                        //uxJunkFilesProblemStatus.Visible = true;
                        //uxJunkFilesProblemStatus.Text = string.IsNullOrEmpty(uxJunkFilesProblemStatus.Text) ? "Insufficient priveleges to perform Disk Analysis" : uxJunkFilesProblemStatus.Text + " " + " Insufficient priveleges to perform Disk Analysis";
                        chromiumBrowser.ExecuteScript("javascript:diskPerformanceShow('" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "','" + junkFileSpecificationsList.Count.ToString() + "','False','" + commandObj.IsCancelled + "')");
                    }
                }

                commandObj = null;

                //uxJunkFilesFoldersCheckBox.Enabled = true;
                //uxInternetOptimizerCheckBox.Enabled = true;
                //uxDiskPerformanceCheckBox.Enabled = true;
                //uxScanPanel.Visible = false;
                //uxScanningLabel.Text = "Scanning...";
                //uxJunkFileScanButton.Visible = true;
                //uxStopScanButton.Visible = false;
                //uxJunkFileScanButton.Enabled = true;
            }
            catch (Exception ex)
            {
                commandObj = null;
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "uxBGProcess_RunWorkerCompleted", "", ex.Message, ex.StackTrace, "ERROR");
                //LogMessage.WriteErrorInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() :: " + ex.Message);
            }
        }

        public string getDiscPerformanceDetails()
        {
            return formattedAnalysisReport;
        }


        private string BuildAnalysisReport(string analysisResult)
        {
            string returnValue = string.Empty;

            try
            {
                string analysisTemplate = Settings.Default.DiskAnalysisTemplate;
                string driveTemplate = Settings.Default.DriveTemplate;
                using (StringReader reader = new StringReader(analysisResult))
                {
                    string line;
                    string driveContent = driveTemplate;
                    string completeContent = string.Empty;
                    bool isLastLine = false;
                    while ((line = reader.ReadLine()) != null)
                    {
                        if (string.IsNullOrEmpty(line)) continue;

                        line = line.Replace("\t", "");
                        if (line.Contains("Drive Name"))
                        {
                            driveContent = driveContent.Replace(Settings.Default.DriveName, line);
                        }
                        else if (line.StartsWith("Volume size") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.VolumeSize, line.Split('=')[1]);
                        }
                        else if (line.StartsWith("Free space") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.FreeSpace, line.Split('=')[1]);
                        }
                        else if (line.StartsWith("Total fragmented space") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.FragmentedSpace, line.Split('=')[1]);
                        }
                        else if (line.StartsWith("Largest free space size") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.LargestFreeSpace, line.Split('=')[1]);
                        }
                        else if (line.StartsWith("Note:"))
                        {
                            isLastLine = true;
                        }
                        else if (isLastLine)
                        {
                            if (line.Contains("You do not need to defragment this volume."))
                            {
                                driveContent = driveContent.Replace(Settings.Default.Status, "No Need to defragment this drive.");
                            }
                            else
                            {
                                driveContent = driveContent.Replace(Settings.Default.Status, "Need to defragment this drive.");
                            }
                            completeContent = completeContent + driveContent;
                            driveContent = driveTemplate;
                            isLastLine = false;
                        }
                    }

                    returnValue = analysisTemplate.Replace(Settings.Default.DriveInfo, completeContent);
                }
            }
            catch (Exception) { }

            return returnValue;
        }


        /// <summary>
        /// To Build the junk files list for cleaning up
        /// </summary>
        /// <returns></returns>
        private BindingList<JunkFileSpecifications> RetrieveJunkFiles()
        {
            try
            {
                List<string> junkFilePaths = new List<string>();
                if (isInternetOptimizer && !isJunkFile)
                {

                    junkFilePaths.Add(Settings.Default.DownloadedProgramFilesPath);
                    junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.InternetCache));
                    junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.History));
                }
                else if (!isInternetOptimizer && isJunkFile)
                {
                    junkFilePaths = Settings.Default.JunkFilePath.Split('|').ToList();
                    junkFilePaths.Add(Path.GetTempPath());
                    junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.InternetCache));
                    junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportArchive"));
                    junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportQueue"));
                }
                else
                {
                    junkFilePaths.Add(Settings.Default.DownloadedProgramFilesPath);
                    junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.History));
                    junkFilePaths = Settings.Default.JunkFilePath.Split('|').ToList();
                    junkFilePaths.Add(Path.GetTempPath());
                    junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.InternetCache));
                    junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportArchive"));
                    junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportQueue"));
                }

                BindingList<JunkFileSpecifications> fileInfoList = new BindingList<JunkFileSpecifications>();

                foreach (var path in junkFilePaths)
                {
                    Thread.Sleep(500);
                    try
                    {
                        foreach (string file in Directory.EnumerateFiles(path, "*.*", SearchOption.AllDirectories))
                        {
                            FileInfo fInfo = new FileInfo(file);
                            fileInfoList.Add(new JunkFileSpecifications() { FileName = fInfo.Name.Trim(), FilePath = fInfo.FullName.Trim(), FileSize = fInfo.Length.ToFileSize().Trim(), IsSelected = true });
                        }
                    }
                    catch { }
                }

                return fileInfoList;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Get Unreserved File List
        /// </summary>
        /// <param name="fileInfoList">JunkFileSpecifications File Info Object</param>
        /// <returns>BindingList<JunkFileSpecifications></returns>
        private BindingList<JunkFileSpecifications> getUnReservedFileList(BindingList<JunkFileSpecifications> fileInfoList)
        {
            BindingList<JunkFileSpecifications> unreservedFileList = new BindingList<JunkFileSpecifications>();
            try
            {
                foreach (JunkFileSpecifications junkFileList in fileInfoList)
                {
                    FileInfo file = new FileInfo(junkFileList.FilePath);

                    if (!IsFileLocked(file))
                    {
                        if (junkFileList.FileName != "desktop.ini" && junkFileList.FileName != "container.dat")
                        {
                            unreservedFileList.Add(junkFileList);
                        }
                    }
                }
            }
            catch (Exception ex) {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "getUnReservedFileList", "", ex.Message, ex.StackTrace, "ERROR");
            }
            return unreservedFileList;
        }

        #region IsFileLocked
        /// <summary>
        /// Checking File is Locked
        /// </summary>
        /// <param name="file">File Object</param>
        /// <returns>True/False</returns>
        protected virtual bool IsFileLocked(FileInfo file)
        {
            FileStream stream = null;

            try
            {
                stream = file.Open(FileMode.Open, FileAccess.ReadWrite, FileShare.None);
            }
            catch (IOException)
            {
                //the file is unavailable because it is:
                //still being written to
                //or being processed by another thread
                //or does not exist (has already been processed)
                return true;
            }
            catch (System.UnauthorizedAccessException)
            {
                //the file is unavailable because it is:
                //still being written to
                //or being processed by another thread
                //or does not exist (has already been processed)
                return true;
            }
            finally
            {
                if (stream != null)
                    stream.Close();
            }

            //file is not locked
            return false;
        }
        #endregion

        BindingList<JunkFileSpecifications> junkFileSpecificationsList;
        private BackgroundWorker pcoptBackgroundWorker;

        //private void InitializeComponent()
        //{
        //    this.uxBackgroundWorker = new System.ComponentModel.BackgroundWorker();
        //    this.SuspendLayout();
        //    // 
        //    // MainWindow
        //    // 
        //    this.ClientSize = new System.Drawing.Size(284, 261);
        //    this.Name = "MainWindow";
        //    this.ResumeLayout(false);

        //}

        private BackgroundWorker uxBackgroundWorker;


        private void pcoptBackgroundWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            pcoptBackgroundWorker.WorkerReportsProgress = true;
            BindingList<JunkFileSpecifications> fileInfoList = RetrieveJunkFiles();
            var chhkCount = 0;

            if (isJunkFile) { chhkCount = chhkCount + 1; }
            if (isInternetOptimizer) { chhkCount = chhkCount + 1; }
            if (isDiskperformancr) { chhkCount = chhkCount + 1; }
            //pcoptBackgroundWorker.ReportProgress((100/chhkCount));
            pcoptBackgroundWorker.ReportProgress(50);
            Thread.Sleep(2000);
            e.Result = fileInfoList;
        }

        private void pcoptBackgroundWorker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            if (isJunkFile && isInternetOptimizer)
            {
                chromiumBrowser.ExecuteScript("javascript:getStatus('" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "');");

            }
            completedCnt = completedCnt + 1;
        }

        private void pcoptBackgroundWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {
                BindingList<JunkFileSpecifications> fileInfoList = (BindingList<JunkFileSpecifications>)e.Result;
                //Added for checking weather the file is acessed by system 
                fileInfoList = getUnReservedFileList(fileInfoList);
                if (fileInfoList != null && fileInfoList.Count > 0)
                {
                    junkFileSpecificationsList = fileInfoList;
                }

                //if (!isDiskperformancr)
                //{
                //    //isScanningInprogress = false;
                //    //uxJunkFilesFoldersCheckBox.Enabled = true;
                //    //uxInternetOptimizerCheckBox.Enabled = true;
                //    //uxDiskPerformanceCheckBox.Enabled = true;

                //    //uxScanPanel.Visible = false;
                //    //uxJunkFileScanButton.Enabled = true;
                //}
                if (isDiskperformancr)
                {
                    //uxDPSStatusPictureBox.Image = Properties.Resources.LoadingCircle;
                    //uxDPSStatusPictureBox.Enabled = true;

                    //uxFixAllButton.Visible = false;
                    //uxShowDetailsButton.Visible = false;
                    //uxJunkFilesProblemStatus.Visible = false;

                    //uxJunkFileScanButton.Visible = false;
                    //uxStopScanButton.Visible = true;
                    //uxScanningLabel.Text = "Analyzing...";
                    chromiumBrowser.ExecuteScript("javascript:checkDiscPerformance();");
                    StartDefragmentation();
                }
                var jsonJunkFiles = JsonConvert.SerializeObject(junkFileSpecificationsList);

                scanHistory = jsonJunkFiles;

                chromiumBrowser.ExecuteScript("javascript:getStatusList(" + jsonJunkFiles.ToString() + ",'" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "');");
                //if (Convert.ToBoolean(Settings.Default.IsNetwork))
                //{
                //    MessageBox.Show(Settings.Default.IsNetwork);
                //    chromiumBrowser.ExecuteScript("javascript:getStatusList(" + jsonJunkFiles.ToString() + ",'" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "');");
                //}
                //else
                //{
                //    MessageBox.Show(Settings.Default.IsNetwork);
                //    uxWebBrowserCtrl.Document.InvokeScript("javascript:getStatusList(" + jsonJunkFiles.ToString() + ",'" + isJunkFile + "','" + isInternetOptimizer + "','" + isDiskperformancr + "');");
                //}

            }
            catch (Exception)
            {
            }
        }

        public void deleteAllJunkFiles()
        {
            //bool retValue = false;
            try
            {

                DeleteJunkFiles(junkFileSpecificationsList);
                //uxShowDetailsButton.Visible = false;

                if (isJunkFile && !isInternetOptimizer)
                {
                    //retValue = true;
                    chromiumBrowser.ExecuteScript("javascript:changeJunkCompleted();");
                    //GearHeadMessageBox.Instance.Show("Optimization Complete", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else if (isInternetOptimizer)
                {
                    //uxScanPanel.Visible = true;
                    //uxScanningLabel.Text = "Optimizing your PC";
                    isDeleteSelectedFiles = false;
                    uxInternetOptimizerBackgroundWorker.RunWorkerAsync();
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "deleteAllJunkFiles", "", ex.Message, ex.StackTrace, "ERROR");
            }
            //return retValue;
            //uxScanScheduleButton.Visible = false;
        }

        [DllImport("user32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto)]
        private static extern bool ShowWindow(IntPtr hwnd, int nCmdShow);

        [DllImport("user32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto)]
        private static extern bool EnableWindow(IntPtr hwnd, bool enabled);

        private BackgroundWorker uxInternetOptimizerBackgroundWorker;
        private void uxInternetOptimizerBackgroundWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                uxInternetOptimizerBackgroundWorker.WorkerReportsProgress = true;
                //Delete Temporary Internet Files
                //ProcessStartInfo oInfo = new ProcessStartInfo("RunDll32.exe", "InetCpl.cpl,ClearMyTracksByProcess 8");
                //oInfo.WindowStyle = ProcessWindowStyle.Hidden;
                //oInfo.CreateNoWindow = true;
                //oInfo.UseShellExecute = false;
                //oInfo.RedirectStandardOutput = true;
                //oInfo.RedirectStandardError = true;
                //Process m_oProc = new Process();
                //m_oProc.StartInfo = oInfo;

                //m_oProc.Start();

                System.Diagnostics.ProcessStartInfo psi = new System.Diagnostics.ProcessStartInfo("RunDll32.exe");
                psi.UseShellExecute = false;
                psi.RedirectStandardOutput = true;
                psi.RedirectStandardInput = true;
                psi.RedirectStandardError = true;
                psi.WorkingDirectory = Environment.GetFolderPath(Environment.SpecialFolder.System);
                // Start the process
                System.Diagnostics.Process proc = System.Diagnostics.Process.Start(psi);
                // Open the batch file for reading
                //System.IO.StreamReader strm = System.IO.File.OpenText(BatFilePath);
                // Attach the output for reading
                System.IO.StreamReader sOut = proc.StandardOutput;
                // Attach the in for writing
                System.IO.StreamWriter sIn = proc.StandardInput;

                sIn.WriteLine("InetCpl.cpl,ClearMyTracksByProcess 8");

                // Close the process
                proc.Close();
                string results = sOut.ReadToEnd().Trim();

                proc = System.Diagnostics.Process.Start(psi);
                sOut = proc.StandardOutput;
                sIn = proc.StandardInput;

                sIn.WriteLine("InetCpl.cpl,ClearMyTracksByProcess 1");
                // Read the sOut to a string.
                results = sOut.ReadToEnd().Trim();
                // Close the io Streams;
                sIn.Close();
                sOut.Close();

                //do
                //{
                //    IntPtr hwnd = m_oProc.MainWindowHandle;

                //    //SetWindowLong(hwnd, GWL_EXSTYLE, GetWindowLong(hwnd, GWL_EXSTYLE) ^ WS_EX_LAYERED);
                //    //SetLayeredWindowAttributes(hwnd, 0, 255, (uint)LWA_ALPHA);

                //    ShowWindow(hwnd, 0);
                //    EnableWindow(hwnd, false);
                //} while (m_oProc.HasExited == false);

                //Delete History
                //oInfo = new ProcessStartInfo("RunDll32.exe", "InetCpl.cpl,ClearMyTracksByProcess 1");
                //oInfo.WindowStyle = ProcessWindowStyle.Hidden;
                //oInfo.CreateNoWindow = true;
                //oInfo.UseShellExecute = false;
                //oInfo.RedirectStandardOutput = true;
                //oInfo.RedirectStandardError = true;
                //m_oProc = new Process();
                //m_oProc.StartInfo = oInfo;

                //m_oProc.Start();

                //do
                //{
                //    IntPtr hwnd = m_oProc.MainWindowHandle;

                //    //SetWindowLong(hwnd, GWL_EXSTYLE, GetWindowLong(hwnd, GWL_EXSTYLE) ^ WS_EX_LAYERED);
                //    //SetLayeredWindowAttributes(hwnd, 0, 255, (uint)LWA_ALPHA);

                //    ShowWindow(hwnd, 0);
                //    EnableWindow(hwnd, false);
                //} while (m_oProc.HasExited == false);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "uxInternetOptimizerBackgroundWorker_DoWork", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        private void uxInternetOptimizerBackgroundWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {
                //uxFixAllButton.Enabled = true;
                //uxJunkFileScanButton.Enabled = true;
                //uxJunkFilesFoldersCheckBox.Enabled = true;
                //uxInternetOptimizerCheckBox.Enabled = true;
                //uxDiskPerformanceCheckBox.Enabled = true;
                //uxFixAllButton.Visible = false;
                //uxShowDetailsButton.Visible = false;
                //uxScanPanel.Visible = false;
                //uxScanningLabel.Text = "Scanning...";
                //uxJunkFilesNoProblemStatus.Visible = true;
                //uxJunkFilesNoProblemStatus.Text = "Optimization Complete";
                //uxJunkFilesProblemStatus.Visible = false;
                //uxStatusPanel.Visible = true;
                //if (isJunkFile)
                //{
                //    //uxJunkFilesStatusPictureBox.Enabled = true;
                //    //uxJunkFilesStatusPictureBox.Image = Properties.Resources.green;
                //}
                //if (isInternetOptimizer)
                //{
                //    //uxIOStatusPictureBox.Enabled = true;
                //    //uxIOStatusPictureBox.Image = Properties.Resources.green;
                //}

                chromiumBrowser.ExecuteScript("javascript:changeInternetOptimizerCompleted('" + isJunkFile + "','" + isInternetOptimizer + "','" + isDeleteSelectedFiles + "')");

                //GearHeadMessageBox.Instance.Show("Optimization Complete", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception) { }
        }


        private void DeleteJunkFiles(BindingList<JunkFileSpecifications> junkFileSpecificationsList)
        {
            try
            {
                foreach (var item in junkFileSpecificationsList)
                {
                    try
                    {
                        if (item.IsSelected)
                        {
                            File.Delete(item.FilePath);
                        }
                    }
                    catch { }
                }

                //uxStatusPanel.Visible = false;
                //uxJunkFilesProblemStatus.Text = "Problems Found : ";
            }
            catch (Exception) { }
        }

        public void deleteSelectedJunkFiles(string selectedJunkFileLists)
        {
            try
            {

                junkFileSpecificationsList = JsonConvert.DeserializeObject<BindingList<JunkFileSpecifications>>(selectedJunkFileLists);

                DeleteJunkFiles(junkFileSpecificationsList);

                //uxJunkFileDetailsPanel.Visible = false;
                //uxShowDetailsButton.Visible = false;

                if (isJunkFile && !isInternetOptimizer)
                {
                    chromiumBrowser.ExecuteScript("javascript:changeSelectedFileJunkCompleted();");
                    //uxFixAllButton.Visible = false;
                    //uxJunkFileScanButton.Enabled = true;
                    ////uxJunkFilesNoProblemStatus.Visible = true;
                    ////uxJunkFilesNoProblemStatus.Text = "Optimization Complete";
                    //uxJunkFilesProblemStatus.Visible = false;
                    //uxStatusPanel.Visible = true;

                    //uxJunkFilesStatusPictureBox.Enabled = true;
                    //uxJunkFilesStatusPictureBox.Image = Properties.Resources.green;
                    //GearHeadMessageBox.Instance.Show("Optimization Complete", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else if (isInternetOptimizer)
                {
                    //uxScanPanel.Visible = true;
                    //uxScanningLabel.Text = "Optimizing your PC";
                    isDeleteSelectedFiles = true;
                    uxInternetOptimizerBackgroundWorker.RunWorkerAsync();
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "deleteSelectedJunkFiles", "", ex.Message, ex.StackTrace, "ERROR");
            }
            //uxScanScheduleButton.Visible = false;
        }

        private void StopDefragmentation()
        {
            try
            {
                commandObj.IsCancelled = true;
                //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() : Analyze/Defragmentation process cancelled.");
                Process[] processes = Process.GetProcessesByName(DefragmentationConstants.DEFRAGMENTATIONSUPPORT);
                // if there is one process...
                if (processes.Length > 0)
                {
                    processes[0].Kill();
                    //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() : 'dfrgntfs' process was killed.");
                }

            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "StopDefragmentation", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        public void stopScan()
        {
            try
            {
                StopDefragmentation();
                //uxJunkFileScanButton.Visible = true;
                //uxStopScanButton.Visible = false;
                //uxScanPanel.Visible = false;
                //uxScanningLabel.Text = "Scanning...";
                //uxStatusPanel.Visible = true;
                //uxJunkFilesProblemStatus.Visible = true;
            }
            catch (Exception) { }
        }

        //private object junkfileList;
        //public void UpdateContractDetails(object response)
        //{
        //    contractDetails = response;
        //}

        public object GetJunkFileDetails()
        {
            return junkFileSpecificationsList;
        }

        //private void InitializeComponent()
        //{
        //    this.uxInternetOptimizerBackgroundWorker = new System.ComponentModel.BackgroundWorker();
        //    this.SuspendLayout();
        //    // 
        //    // MainWindow
        //    // 
        //    this.ClientSize = new System.Drawing.Size(284, 261);
        //    this.Name = "MainWindow";
        //    this.ResumeLayout(false);

        //}

        public void writeTextToHost(string website)
        {
            //MessageBox.Show(website);
            try
            {
                string OS = Path.GetPathRoot(System.Environment.GetEnvironmentVariable("WINDIR"));

                // BlockDetls = (BindingList<BlockDetails>)uxBlockedSiteDataGridView.DataSource;
                //string website;
                string filepath = @"" + OS + "Windows\\System32\\drivers\\etc\\hosts";
                var content = string.Empty;
                using (StreamWriter writer = new StreamWriter(filepath, true))
                {
                    writer.WriteLine("127.0.0.1 " + website);
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "replaceTextInHost", "", ex.Message, ex.StackTrace, "ERROR");
            }
        }

        public void replaceTextInHost(string url)
        {
            try
            {
                string[] selectedRegistryDetails = JsonConvert.DeserializeObject<string[]>(url);

                string OS = Path.GetPathRoot(System.Environment.GetEnvironmentVariable("WINDIR"));
                string website = url;
                string filepath = @"" + OS + "\\Windows\\System32\\drivers\\etc\\hosts";
                string replaceText = string.Empty;
                var content = string.Empty;


                if (selectedRegistryDetails != null)
                {
                    using (StreamReader reader = new StreamReader(filepath))
                    {
                        content = reader.ReadToEnd();
                        reader.Close();
                    }
                    foreach (var item in selectedRegistryDetails)
                    {
                        content = Regex.Replace(content, "127.0.0.1 " + item, replaceText);
                    }

                    using (StreamWriter writer = new StreamWriter(filepath))
                    {
                        writer.Write(content);
                        writer.Close();
                    }


                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "replaceTextInHost", "", ex.Message, ex.StackTrace, "ERROR");
            } 
            //  BlockDetls = (BindingList<BlockDetails>)uxBlockedSiteDataGridView.DataSource; 
        }

        //Scheduled Activities

        public string createScheduleactivities(string daily, int recurdays, string date, string time, string weekdays, string monthdays)
        {
            string schedulerName = "";
            try
            {
                if (ConfigSettings.ClientName.ToUpper() == clientName)
                {
                    schedulerName = "ActiveiPCOptimizationScheduler";
                }
                else
                {
                    schedulerName = "GearHeadConnectPCOptimizationScheduler";
                }
                RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName(ConfigSettings.ClientName);
                String uninstallPath = UninstallRegistryKey.GetValue("UninstallString").ToString();
                String backupSchedulerPath = Path.Combine(uninstallPath.Replace("\"", "").Substring(0, uninstallPath.LastIndexOf("\\")), ConfigurationManager.AppSettings["PCOptimizationConsole"]);

                TaskService ts = new TaskService();


                TaskCollection taskCollection = ts.RootFolder.GetTasks(new System.Text.RegularExpressions.Regex(schedulerName));
                if (taskCollection != null && taskCollection.Count > 0)
                {
                    ts.RootFolder.DeleteTask(taskCollection[0].Name);
                }
                TaskDefinition td = ts.NewTask();
                td.RegistrationInfo.Description = schedulerName;
                Int16 days = Convert.ToInt16(recurdays);


                //DateTime combinedDate = Convert.ToDateTime(date + " " + time,new CultureInfo("en-US"));
                //DateTime combinedDate1 = Convert.ToDateTime("Apr-30-2015 02:12 PM",new CultureInfo("en-US"));
                //DateTime combinedDate2 = Convert.ToDateTime("04-30-2015 02:12 PM", new CultureInfo("en-US"));
                //DateTime combinedDate = Convert.ToDateTime(date + " " + time, new CultureInfo("en-GB",true));

                //string dateFormat = CultureInfo.CurrentUICulture.DateTimeFormat.LongDatePattern;
                ////string dt = "04/30/2015 02:12:00 PM";
                //string dt = date + " "+time;
                //IFormatProvider culture = new System.Globalization.CultureInfo("en-US", true);
                //DateTime combinedDate = DateTime.Parse(dt, culture, DateTimeStyles.AssumeLocal);


                string dateString = date + " " + time;
                string format = "MM/dd/yyyy h:mm tt";

                DateTime combinedDate = DateTime.ParseExact(dateString, format,CultureInfo.InvariantCulture);
                

                if (daily == "onetime")
                {
                    td.Triggers.Add(new TimeTrigger(combinedDate));
                }

                if (daily == "daily")
                {
                    DailyTrigger dailyTrigger = new DailyTrigger(days);
                    dailyTrigger.StartBoundary = combinedDate;
                    td.Triggers.Add(dailyTrigger);
                }

                if (daily == "weekly")
                {
                    days = Convert.ToInt16(recurdays);

                    string[] strArray = weekdays.Split(',');

                    foreach (string item in strArray)
                    {
                        DaysOfTheWeek daysofWeek = (DaysOfTheWeek)Enum.Parse(typeof(DaysOfTheWeek), item);
                        WeeklyTrigger weekTrigger = new WeeklyTrigger(daysofWeek, days);
                        weekTrigger.StartBoundary = combinedDate;
                        td.Triggers.Add(weekTrigger);
                    }
                }

                if (daily == "monthly")
                {
                    MonthlyTrigger monthlyTrigger = new MonthlyTrigger();
                    //MonthsOfTheYear selectedMonth= ((MonthsOfTheYear)Convert.ToInt32(monthdays));
                    monthlyTrigger.MonthsOfYear = MonthsOfTheYear.AllMonths;

                    //monthlyTrigger.MonthsOfYear = (monthdays == "01") ? MonthsOfTheYear.January : (monthdays == "02") ? MonthsOfTheYear.February : (monthdays == "03") ? MonthsOfTheYear.March : (monthdays == "04") ? MonthsOfTheYear.April : (monthdays == "05") ? MonthsOfTheYear.May : (monthdays == "06") ? MonthsOfTheYear.June : (monthdays == "07") ? MonthsOfTheYear.July : (monthdays == "08") ? MonthsOfTheYear.August : (monthdays == "09") ? MonthsOfTheYear.September : (monthdays == "10") ? MonthsOfTheYear.October : (monthdays == "11") ? MonthsOfTheYear.November : MonthsOfTheYear.December;

                    //monthlyTrigger.MonthsOfYear = (mon == "01") ? MonthsOfTheYear.January : (mon == "02") ? MonthsOfTheYear.February : (mon == "03") ? MonthsOfTheYear.March : (mon == "04") ? MonthsOfTheYear.April : (mon == "05") ? MonthsOfTheYear.May : (mon == "06") ? MonthsOfTheYear.June : (mon == "07") ? MonthsOfTheYear.July : (mon == "08") ? MonthsOfTheYear.August : (mon == "09") ? MonthsOfTheYear.September : (mon == "10") ? MonthsOfTheYear.October : (mon == "11") ? MonthsOfTheYear.November : MonthsOfTheYear.December;

                    // monthlyTrigger.MonthsOfYear = (MonthsOfTheYear)Enum.Parse(typeof(MonthsOfTheYear), monthdays);
                    monthlyTrigger.StartBoundary = combinedDate;

                    //foreach (var day in monthdays)
                    //{
                    //    daysList.Add(Convert.ToInt16(day));
                    //}
                    List<int> daysList = new List<int>();
                    foreach (var mon in monthdays.Split(','))
                    {
                        daysList.Add(Convert.ToInt16(mon));

                    }
                    monthlyTrigger.DaysOfMonth = daysList.ToArray();
                    td.Triggers.Add(monthlyTrigger);

                }

                td.Actions.Add(new ExecAction(backupSchedulerPath, null));
                ts.RootFolder.RegisterTaskDefinition(schedulerName, td);
                return "PC Optimization scheduled successfully !!";
                //GearHeadMessageBox.Instance.Show("PC Optimization scheduled successfully", "Active-I", MessageBoxButtons.OK, MessageBoxIcon.Information, GearHeadMessageBox.ModuleEnum.Router);
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("PCOptimizaton.cs", "createScheduleactivities", "", ex.Message, ex.StackTrace, "ERROR");
                return "Failed";
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

    }
}

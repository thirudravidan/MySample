using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.ComponentModel;
using System.Diagnostics;
using System.Threading;
//using Antlr.StringTemplate;
using System.Runtime.InteropServices;
//using Activei.Tracker;
using Activei;
using CefSharp;
using CefSharp.WinForms;

namespace Activei.Defragmentation
{
    class DefragmentationService
    {
       
        //To instruct the GUI to hide the progress bar..
        public delegate void StopOperationDelegate(string report);
        public StopOperationDelegate StopOperation = null;

        //To instruct the GUI to clear the contents of the Deframentation Report Rich Textbox..
        public delegate void ClearReportDelegate(string report);
        public ClearReportDelegate ClearReport = null;

        IDefragmentation defragModel = null;
        CommandObj commandObj = null;

        /// <summary>
        /// Gets the list of the logical drives in the system
        /// </summary>
        /// <param name="_defragModel"></param>
        public void GetSystemDrives(ref IDefragmentation _defragModel)
        {
            try
            {
                _defragModel.Drives = SystemToolsProxy.GetSystemDrives();
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationService.cs : GetSystemDrives() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("DefragmentationService.cs", "GetSystemDrives()", "", ex.Message, ex.StackTrace, "Error");
            }
        }


        /// <summary>
        /// Start / Stop the defragmentation process based on the event triggerred from the GUI
        /// </summary>
        /// <param name="_defragModel"></param>
        public void StartDefragmentation(IDefragmentation _defragModel)
        {
            try
            {
                defragModel = _defragModel;
                //LogMessage.WriteLogInfo("DefragmentationService.cs : PerformOperation() method invoked.");

                //Start the defragmentation coz the user has clicked on Start
                //LogMessage.WriteLogInfo("DefragmentationService.cs : PerformOperation() :: Requested operation is going to start.");

                if (_defragModel.SelectedDrives.Count == 0)
                {
                    //No drives selected? Throw an exception...
                    String message = String.Empty;
                    message = _defragModel.Analyse ? "Select a drive to analyze" : "Select a drive to defragment";
                    //LogMessage.WriteLogInfo("DefragmentationService.cs : PerformOperation() :: " + message);
                    throw new Exception(message);
                }
                else
                {
                    //Good job! We've got something to defragment...

                    _defragModel.Report = String.Empty;

                    if (ClearReport != null)
                    {
                        ClearReport(_defragModel.Report);
                    }

                    List<String> arguments = new List<string>();
                    String argument = String.Empty;

                    //LogMessage.WriteLogInfo("DefragmentationService.cs : PerformOperation() :: Building arguements.");

                    //Now.. Lets build our command with its arguments...
                    /*
                     * -a : Analyse
                     * -f : Force defragment even if free space is lower than required
                     * -v : Get the verbose output (Detailed Analysis Report)
                     */

                    for (int index = 0; index < _defragModel.SelectedDrives.Count; index++)
                    {
                        argument = _defragModel.SelectedDrives[index].ToString().Replace("\\", "").ToLower();

                        if (_defragModel.Analyse)
                        {
                            argument = argument + " -a ";
                        }
                        else if (_defragModel.Defragment && !_defragModel.ForceDefragment)
                        {
                            argument = argument + " ";
                        }
                        else if (_defragModel.Defragment && _defragModel.ForceDefragment)
                        {
                            argument = argument + " -f ";
                        }

                        argument = argument + " -v ";

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
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationService.cs : uxBGProcess_DoWork() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("DefragmentationService.cs", "StartDefragmentation()", "", ex.Message, ex.StackTrace, "Error");
            }
        }

        private void uxBGProcess_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                Dictionary<String, object> objArgument =(Dictionary<String, object>)e.Argument;
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
                    defragModel.AlignedReport += output.ToString();
                    
                    if (commandObj.IsCancelled) return;
                    //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_DoWork() : Analyze/Defragmentation process was completed for " + argument.Substring(0, 1).ToUpper() + "' Drive");
                }

                e.Result = output.ToString();
                //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_DoWork() : Analyze/Defragmentation process was completed for all selected drives.");
            }
            catch (Exception)
            {
                e.Cancel = true;
                //LogMessage.WriteErrorInfo("DefragmentationService.cs : uxBGProcess_DoWork() :: " + ex.Message);
            }
        }

        public static string AnalysisReport;
        public static string GetAnalysisReport()
        {
            return AnalysisReport;
        }

        private void uxBGProcess_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            
            try
            {

                AnalysisReport = string.Empty;
                //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() method invoked.");
                defragModel.SelectedDrives.Clear();
                if (commandObj.IsCancelled)
                {
                    StopDefragmentation(defragModel);
                }
                else if (e.Cancelled)
                {
                    String message = String.Empty;
                    message = defragModel.Analyse ? DefragmentationConstants.ERROR_ANALYSE : DefragmentationConstants.ERROR_DEFRAGMENT;
                    //LogMessage.WriteLogInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() : " + message);
                    defragModel.Report = message;
                }
                else if (e.Result != null)
                {
                    String driveName = String.Empty;
                    for (int index = 0; index < defragModel.SelectedDrives.Count; index++)
                    {
                        driveName += defragModel.SelectedDrives[index].ToString().Replace("\\", "").ToUpper().Replace(":", "") + "-";
                    }

                    String reportType = defragModel.Analyse ? "Analysis" : "Defrag";

                    if (e.Result.ToString().Contains("The disk defragmenter cannot start because you have insufficient priveleges to perform this operation"))
                    {
                        defragModel.Report = Settings.Default.defragerrortemplate.Replace("{$error$}", "The disk defragmenter cannot start because you have insufficient priveleges to perform this operation");
                    }
                    else
                    {
                        defragModel.Report = defragModel.Analyse ? BuildAnalysisReport(e.Result.ToString()) : BuildDefragReport(e.Result.ToString());
                    }
                }
                else
                {
                    if (commandObj.Result.Contains("The disk defragmenter cannot start because you have insufficient priveleges to perform this operation"))
                    {
                        defragModel.Report = "The disk defragmenter cannot start because you have insufficient priveleges to perform this operation";
                    }
                }
                AnalysisReport = defragModel.Report;
                commandObj = null;
                if (StopOperation != null)
                {
                    StopOperation(defragModel.Report);
                }
                MainWindow.chromiumBrowser.ExecuteScript("javascript:showDefragmentReportData()");

            }
            catch (Exception)
            {
                commandObj = null;
                if (StopOperation != null)
                {
                    StopOperation(defragModel.Report);
                }

                //LogMessage.WriteErrorInfo("DefragmentationService.cs : uxBGProcess_RunWorkerCompleted() :: " + ex.Message);
            }
        }


        private string BuildDefragReport(string defragResult)
        {
            string returnValue = string.Empty;

            try
            {
                string analysisTemplate = Settings.Default.DefragTemplate;
                string driveTemplate = Settings.Default.DefragDriveTemplate;
                using (StringReader reader = new StringReader(defragResult))
                {
                    string line;
                    string driveContent = driveTemplate;
                    string completeContent = string.Empty;
                    bool isLastLine = false;
                    bool isPreDefragReport = false;
                    bool isPostDefragReport = false;

                    while ((line = reader.ReadLine()) != null)
                    {
                        if (string.IsNullOrEmpty(line)) continue;

                        line = line.Replace("\t", "");

                        if (line.Contains("Pre-Defragmentation Report:") || line.Contains("Pre-Optimization Report:"))
                        {
                            isPreDefragReport = true;
                        }
                        else if (line.Contains("Post Defragmentation Report:"))
                        {
                            isPostDefragReport = true;
                        }

                        if (line.Contains("Drive Name"))
                        {
                            driveContent = driveContent.Replace(Settings.Default.DriveName, line);
                        }

                        if (isPreDefragReport)
                        {

                            if (line.StartsWith("Volume size") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.VolumeSize, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Cluster size") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.ClusterSize, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Used space") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.UsedSpace, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Free space") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.FreeSpace, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Total fragmented space") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.FragmentedSpace, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Note:"))
                            {
                                isPreDefragReport = false;
                            }
                        }
                        else if (isPostDefragReport)
                        {
                            if (line.StartsWith("Volume size") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.AfterVolumeSize, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Cluster size") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.AfterClusterSize, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Used space") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.AfterUsedSpace, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Free space") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.AfterFreeSpace, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Total fragmented space") && line.Contains("="))
                            {
                                driveContent = driveContent.Replace(Settings.Default.AfterFragmentedSpace, line.Split('=')[1]);
                            }
                            else if (line.StartsWith("Note:"))
                            {
                                isLastLine = true;
                                isPostDefragReport = false;
                            }
                        }

                        if (isLastLine)
                        {
                            completeContent = completeContent + driveContent;
                            driveContent = driveTemplate;
                            isLastLine = false;
                        }
                    }

                    returnValue = analysisTemplate.Replace(Settings.Default.DriveInfo, completeContent);
                }
            }
            catch (Exception)
            {
            }

            return returnValue;
        }

        private string BuildAnalysisReport(string analysisResult)
        {
            string returnValue = string.Empty;

            try
            {
                string analysisTemplate = Settings.Default.DefragAnalysisTemplate;
                string driveTemplate = Settings.Default.DefragAnalysisDriveTemplate;
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
                        else if (line.StartsWith("Cluster size") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.ClusterSize, line.Split('=')[1]);
                        }
                        else if (line.StartsWith("Used space") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.UsedSpace, line.Split('=')[1]);
                        }
                        else if (line.StartsWith("Free space") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.FreeSpace, line.Split('=')[1]);
                        }
                        else if (line.StartsWith("Total fragmented space") && line.Contains("="))
                        {
                            driveContent = driveContent.Replace(Settings.Default.FragmentedSpace, line.Split('=')[1]);
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
            catch (Exception)
            {
            }

            return returnValue;
        }

        internal void StopDefragmentation(IDefragmentation _defragModel)
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
                StringBuilder message = new StringBuilder();
                string strMessage = _defragModel.Analyse ? defragModel.Report = Settings.Default.defragerrortemplate.Replace("{$error$}", "Disk analysis was cancelled by the user") : defragModel.Report = Settings.Default.defragerrortemplate.Replace("{$error$}", "Disk defragmentation was cancelled by the user");
                message.AppendLine();
                message.Append(strMessage);
                _defragModel.Report = message.ToString();
            }
            catch (Exception)
            {
                //LogMessage.WriteErrorInfo("DefragmentationService.cs : StopCleanup() :: " + ex.Message);
            }
        }
    }
}
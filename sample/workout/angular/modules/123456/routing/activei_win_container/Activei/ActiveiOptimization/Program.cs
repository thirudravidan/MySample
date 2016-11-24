using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Threading;
using System.ComponentModel;
using System.Security.Principal;
using CustomizedClickOnce.Common;
using System.Diagnostics;
using System.Reflection;
using System.Windows.Forms;
using System.Configuration;
using nClam;
using System.Collections.Specialized;
using System.Runtime.InteropServices;

namespace PCOptimizationConsole
{
    class Program
    {

        public const string PROCESS_NAME = "Drive Analysis / Defragmentation";
        public const string DEFRAGMENTATION = "defrag";
        static CommandObj commandObj = null;
        static string hostname ="localhost";
        static int portno = 3310;
        static string[] FileNames;        
        static List<string> infectedFiles = new List<string>();
        static List<string> Drives = null;
        static bool clamAVScanChecked = true;


        static void Main(string[] args)
        {

            bool junkFilesChecked = true;
            bool internetChecked = true;
            bool diskSpaceChecked = true;
            
            
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
                    GearHeadMessageBox.Instance.Show("Sorry, this application must be run as Administrator.", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }

                // Shut down the current process
                Environment.Exit(0);
            }
            else
            {
               
                try
                {
                    List<string> junkFilePaths = new List<string>();
                    if (internetChecked == true && junkFilesChecked == false)
                    {

                        junkFilePaths.Add(Properties.Settings.Default.DownloadedProgramFilesPath);
                        junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.InternetCache));
                        junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.History));
                    }
                    else if (internetChecked == false && junkFilesChecked == true)
                    {
                        junkFilePaths = Properties.Settings.Default.JunkFilePath.Split('|').ToList();
                        junkFilePaths.Add(Path.GetTempPath());
                        junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.InternetCache));
                        junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportArchive"));
                        junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportQueue"));
                    }
                    else
                    {
                        junkFilePaths.Add(Properties.Settings.Default.DownloadedProgramFilesPath);
                        junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.History));
                        junkFilePaths = Properties.Settings.Default.JunkFilePath.Split('|').ToList();
                        junkFilePaths.Add(Path.GetTempPath());
                        junkFilePaths.Add(Environment.GetFolderPath(Environment.SpecialFolder.InternetCache));
                        junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportArchive"));
                        junkFilePaths.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Windows\WER\ReportQueue"));
                    }

                    foreach (var item in junkFilePaths)
                    {
                        try
                        {

                            File.Delete(item);
                        }
                        catch { }
                        Console.WriteLine("Junk Files : " + item.ToString() + " Deleted");

                    }
                    if (diskSpaceChecked == true)
                    {
                        Console.WriteLine("Disk Defragmentation is started...");
                        StartDefragmentation();

                       
                    }

                    Console.ReadLine();
                    Console.WriteLine("Disk Preformance analysis complete.");

                }
                catch { }
            }
        }

        private static bool IsRunAsAdministrator()
        {
            var wi = WindowsIdentity.GetCurrent();
            var wp = new WindowsPrincipal(wi);

            return wp.IsInRole(WindowsBuiltInRole.Administrator);
        }

        public static void StartDefragmentation()
        {
            commandObj = new CommandObj();
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
                List<string> selectedDrives = GetSystemDrives();

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
                uxBGProcess1.DoWork += new DoWorkEventHandler(uxBGProcess_DoWork);
                uxBGProcess1.RunWorkerCompleted += new RunWorkerCompletedEventHandler(uxBGProcess_RunWorkerCompleted);
                //Trigger the worker thread...
                uxBGProcess1.RunWorkerAsync((object)objArgument);
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationService.cs : uxBGProcess_DoWork() :: " + ex.Message);
                throw ex;
            }
          
        }
        static void uxBGProcess_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            //do the code when Backgroundwork completes its work                       
            Console.Write("Defragmentation Completed Sucessfully \n");
            Console.WriteLine("Antivirus Scan is started...");
            if (clamAVScanChecked == true)
            {
                doVirusScan();
            }
            Console.ReadLine();
            Console.Write("Scan Completed Sucessfully \n");
            Console.Write("[any key to exit]");
            Console.ReadKey();
        }
    
        private static void uxBGProcess_DoWork(object sender, DoWorkEventArgs e)
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
                    commandObj.ProcessName = PROCESS_NAME;
                    String result = commandObj.Run(DEFRAGMENTATION, argument, DEFRAGMENTATION + ".out", "");
                    output.AppendLine(result);
                    output.AppendLine(); output.AppendLine();

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
            catch (Exception)
            {
                ////LogMessage.WriteErrorInfo("SystemToolsProxy.cs :: GetSystemDrives() : " + ex.Message);
                //throw ex;
            }
            return drives;
        }
       
        public static void doVirusScan()
        {
            
            try
            {
                BackgroundWorker uxAntivirusScanWorker = new BackgroundWorker();
                Drives = null;
                Drives = GetSystemDrives();
                if (Drives.Count>0)
                {
                    uxAntivirusScanWorker.DoWork += new DoWorkEventHandler(bgw_DoWork);
                    uxAntivirusScanWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(bgw_RunWorkerCompleted);
                    uxAntivirusScanWorker.WorkerReportsProgress = true;
                    uxAntivirusScanWorker.RunWorkerAsync();
                }
                else
                {
                    // GearHeadMessageBox.Instance.Show("Please Select a drive to scan", "Activei", MessageBoxButtons.OK, MessageBoxIcon.Error);                 
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
       
        public static IEnumerable<string> GetFiles(string root, string searchPattern)
        {
            Stack<string> pending = new Stack<string>();
            pending.Push(root);
            while (pending.Count != 0)
            {
                var path = pending.Pop();
                string[] next = null;
                try
                {
                    next = Directory.GetFiles(path, searchPattern);
                }
                catch { }
                if (next != null && next.Length != 0)
                    foreach (var file in next) yield return file;
                try
                {
                    next = Directory.GetDirectories(path);
                    foreach (var subdir in next) pending.Push(subdir);
                }
                catch { }
            }
        }
        static void bgw_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            //do the code when Backgroundwork completes its work           
            if (infectedFiles.Count > 0)
            {
                foreach (string file in infectedFiles)
                {
                    if (File.Exists(file))
                    {
                        File.Delete(file);
                    }
                }
            }
        }
        private static void bgw_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {

                for (int i = 0; i < Drives.Count; i++)
                {
                    FileNames = GetFiles(Drives[i], "*").ToArray();
                    var clamVir = new ClamClient(hostname, portno);
                    foreach (string path in FileNames)
                    {
                        ClamScanResult scanResult = clamVir.ScanFileOnServer(path);
                        if (scanResult.Result == ClamScanResults.VirusDetected)
                        {
                            infectedFiles.Add(path);
                        }
                    }
                }
            }
            catch (Exception)
            {
               // throw ex;
            }
        }
    }
}

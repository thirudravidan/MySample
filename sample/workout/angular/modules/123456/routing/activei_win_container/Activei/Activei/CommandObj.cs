using System;
using System.Diagnostics;
using System.Threading;
using System.ComponentModel;
using System.Runtime.InteropServices;


namespace Activei
{
    /// <summary>
    /// The library that holds the call to a windows event and returns when the event ends.
    /// </summary>
    public class CommandObj
    {
        private string m_sResult;

        public string Result
        {
            get { return m_sResult; }
            set { m_sResult = value; }
        }
        Process m_oProc;

        public CommandObj()
        {
        }

        private Boolean isCancelled = false;

        public Boolean IsCancelled
        {
            get { return isCancelled; }
            set { isCancelled = value; }
        }

        private string processName = string.Empty;

        public string ProcessName
        {
            get { return processName; }
            set { processName = value; }
        }

        BackgroundWorker outputWorker;
        BackgroundWorker errorWorker;

        public string Run(string sFilePath, string sArgs, string sInput, string sWorkingDir)
        {
            bool isWOW64RedirectionDisabled = false;
            try
            {
                isWOW64RedirectionDisabled = WOW64RedirectionManipulator.DisableWOW64Redirection();

                ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : invoked.");
                ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : Going to perform " + processName);

                outputWorker = new BackgroundWorker();
                outputWorker.DoWork += new DoWorkEventHandler(outputWorker_DoWork);
                outputWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(outputWorker_RunWorkerCompleted);

                errorWorker = new BackgroundWorker();
                errorWorker.DoWork += new DoWorkEventHandler(errorWorker_DoWork);
                errorWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(errorWorker_RunWorkerCompleted);

                m_sResult = "";
                m_oProc = new Process();
                ProcessStartInfo oInfo;
                if (sArgs == null || sArgs == "") oInfo = new ProcessStartInfo(sFilePath);
                else oInfo = new ProcessStartInfo(sFilePath, sArgs);

                ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : sFilePath : " + sFilePath);
                ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : oInfo file name : " + oInfo.FileName);

                if (sWorkingDir != null && sWorkingDir != "")
                {
                    oInfo.WorkingDirectory = sWorkingDir;
                }
                oInfo.WindowStyle = ProcessWindowStyle.Hidden;
                oInfo.CreateNoWindow = true;
                oInfo.UseShellExecute = false;
                oInfo.RedirectStandardOutput = true;
                oInfo.RedirectStandardError = true;
                if (sInput != null && sInput != "")
                {
                    oInfo.RedirectStandardInput = true;
                }
                m_oProc.StartInfo = oInfo;

                ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : Starting the " + processName + " process.");

                if (m_oProc.Start())
                {
                    if (sInput != null && sInput != "")
                    {
                        m_oProc.StandardInput.Write(sInput);
                        m_oProc.StandardInput.Close();
                    }
                    ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : errorWorker background process was initiated.");
                    errorWorker.RunWorkerAsync();
                    ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : outputWorker background process was initiated.");
                    outputWorker.RunWorkerAsync();

                    int nPause = 50;
                    while (outputWorker.IsBusy || errorWorker.IsBusy)
                    {
                        Thread.Sleep(nPause);
                        if (isCancelled)
                        {
                            ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : Worker cancelled");
                            break;
                        }
                    }
                    ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : errorWorker and outputWorker background process was completed.");
                    errorWorker.DoWork -= new DoWorkEventHandler(this.errorWorker_DoWork);
                    outputWorker.DoWork -= new DoWorkEventHandler(this.outputWorker_DoWork);

                    errorWorker.RunWorkerCompleted -= new RunWorkerCompletedEventHandler(this.errorWorker_RunWorkerCompleted);
                    outputWorker.RunWorkerCompleted -= new RunWorkerCompletedEventHandler(this.outputWorker_RunWorkerCompleted);

                    outputWorker = null;
                    errorWorker = null;
                    if (m_oProc.HasExited == false)
                    {
                        ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : " + processName + " was terminated.");
                        oInfo = null;
                        isCancelled = true;
                        m_oProc.Kill();
                        m_sResult = "\r\nError: Hung process terminated ...\r\n";
                    }
                    else
                    {
                        ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : " + processName + " process completed successfully.");
                    }
                    m_oProc.Close();
                    m_oProc.Dispose();
                    m_oProc = null;

                    return m_sResult;
                }
                else
                {
                    ////LogMessage.WriteLogInfo("CommandObj.cs : Run() : stopped.");
                    return null;
                }
            }
            catch (Exception ex)
            {
                ////LogMessage.WriteErrorInfo("CommandObj.cs : Run() : " + ex.Message);
                //ErrorTracker.WriteErrorLog("CommandObj.cs", "Run()", "", ex.Message, ex.StackTrace, "Error");
            }
            finally
            {
                if (isWOW64RedirectionDisabled)
                    WOW64RedirectionManipulator.RevertWOW64Redirection();
            }
            return m_sResult;
        }

        void errorWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e) { }

        void errorWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                ////LogMessage.WriteLogInfo("CommandObj.cs : errorWorker_DoWork() : invoked.");
                ////LogMessage.WriteLogInfo("CommandObj.cs : outputWorker_DoWork() : Calling GetError() method.");
                GetError();

                ////LogMessage.WriteLogInfo("CommandObj.cs : errorWorker_DoWork() : stopped.");
            }
            catch (Exception)
            {
                ////LogMessage.WriteErrorInfo("CommandObj.cs : errorWorker_DoWork() :: " + ex.Message);
            }
        }

        void outputWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e) { }

        void outputWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                ////LogMessage.WriteLogInfo("CommandObj.cs : outputWorker_DoWork() : invoked.");
                ////LogMessage.WriteLogInfo("CommandObj.cs : outputWorker_DoWork() : Calling GetOutput() method.");
                GetOutput();

                ////LogMessage.WriteLogInfo("CommandObj.cs : outputWorker_DoWork() : stopped.");

            }
            catch (Exception)
            {
                ////LogMessage.WriteErrorInfo("CommandObj.cs : outputWorker_DoWork() :: " + ex.Message);
            }
        }
        private void GetError()
        {
            if (m_oProc != null && m_oProc.StandardError != null)
            {
                string sError = "";
                lock (m_oProc.StandardError)
                {
                    sError = m_oProc.StandardError.ReadToEnd();
                }
                if (sError != "")
                {
                    lock (this)
                    {
                        m_sResult += "\r\nError:" + sError + "\r\n";
                    }
                }
                ////LogMessage.WriteLogInfo("m_sResult : " + m_sResult);
                ////LogMessage.WriteLogInfo("sError : " + sError);
            }
        }
        private void GetOutput()
        {
            if (m_oProc != null && m_oProc.StandardOutput != null)
            {
                string sOutput = "";
                lock (m_oProc.StandardOutput)
                {
                    sOutput = m_oProc.StandardOutput.ReadToEnd();
                }
                if (sOutput != "")
                {
                    lock (this)
                    {
                        m_sResult += "\r\n" + sOutput;
                    }
                }

                ////LogMessage.WriteLogInfo("m_sResult : " + m_sResult);
                ////LogMessage.WriteLogInfo("sOutput : " + sOutput);

            }
        }



    }
}

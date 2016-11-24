#region Namespace
using System;
using System.Configuration;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Web;
using System.IO;
using System.Deployment.Application;
#endregion

namespace Activei.Tracker
{
    #region Tracker
    public class ErrorTracker
    {
        /// <summary>
        /// Write the Tracker
        /// </summary>
        //Declarations                
        //string logmessage = string.Empty;
        /// <summary>
        /// Write Log Web/ Windows Log
        /// </summary>
        /// <param name="Message"></param>
        /// <param name="cardtype"></param>
        /// <param name="transtype"></param>
        /// <param name="errorlog"></param>
        /// <param name="datetime"></param>
        /// <param name="status"></param>
        public static void WriteLog(string message)
        {
            try
            {
                //Getting Log Path for Web App/ Win App                                
                //string logpath = ApplicationDeployment.CurrentDeployment.DataDirectory + (@"ErrorLog_" + System.DateTime.Now.ToString("dd_MM_yyyy") + ".csv");

                string fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                fileName = fileName + "\\ErrorLog\\Server";
                Directory.CreateDirectory(fileName);
                string logpath = fileName + (@"\ErrorLog_" + System.DateTime.Now.ToString("dd_MM_yyyy") + ".csv");
                //Calling StreamWriter Function
                StreamWriter mFWriter = default(StreamWriter);
                //Logging the Message
                //logmessage = message;
                //Checking Weather the Log File Exists
                mFWriter = (File.Exists(logpath)) ? File.AppendText(logpath) : File.CreateText(logpath);
                //Writing Log File
                mFWriter.WriteLine(message);
                //Clearing the Stream Writer Object
                mFWriter.Flush();
                mFWriter.Close();
                mFWriter.Dispose();
                mFWriter = null;
            }
            catch (Exception)
            {
                //throw ex;
            }

        }

        #region Write Error Log
        /// <summary>
        /// Write Error Log
        /// </summary>
        /// <param name="operationName">Opertaion Name is Module Name</param>
        /// <param name="operationType">Operation Type is Function Name inside the Module</param>
        /// <param name="customerEmail">Customer Email Id</param>
        /// <param name="exMessage">Exception Message</param>
        /// <param name="exStack">Stack trace</param>
        /// <param name="status">Status Message</param>
        public static void WriteErrorLog(string operationName, string operationType, string customerEmail, string exMessage, string exStack, string status)
        {
            WriteLog("===========================================");
            WriteLog("Operation/Page Name : " + operationName);
            WriteLog("-------------------------------------- ");
            WriteLog("Method/Function Name : " + operationType);
            WriteLog("-------------------------------------- ");
            WriteLog("Customer Email Id : " + customerEmail);
            WriteLog("-------------------------------------- ");
            WriteLog("Exception Message : " + exMessage);
            WriteLog("-------------------------------------- ");
            WriteLog("Stack Trace :" + exStack);
            WriteLog("-------------------------------------- ");
            WriteLog("Date of Exception : " + DateTime.Now.ToString());
            WriteLog("-------------------------------------- ");
            WriteLog("Process Status : " + status);
            WriteLog("===========================================");
        }
        #endregion
        #region Write Message
        /// <summary>
        /// Write Message
        /// </summary>
        /// <param name="operationName">Operation Name</param>
        /// <param name="operationType">Operation Type</param>
        /// <param name="customerEmail">Customer Email</param>
        /// <param name="exMessage">Exception Message</param>
        /// <param name="exStack">Stack Trace</param>
        /// <param name="status">Status</param>
        /// <returns>String Error Msg</returns>
        private static string writeMessage(string operationName, string operationType, string customerEmail, string exMessage, string exStack, string status)
        {
            //string errorMsg = string.Empty;
            //string splitter="-------------------------------------- ";
            //string border="===========================================";
            //errorMsg = border + "<br/>" + "Operation/Page Name : " + operationName + "<br/>" + splitter + "<br/>" + "Method/Function Name : ";
            //errorMsg += operationType + "<br/>" + splitter + "<br/>" + "Customer Email Id : " + customerEmail + "<br/>" + splitter;
            //errorMsg += "<br/>" + "Exception Message : " + exMessage + "<br/>" + splitter + "<br/>" + "Stack Trace :" + exStack;
            //errorMsg += "<br/>" + splitter + "<br/>" + "Date of Exception : " + DateTime.Now.ToString() + "<br/>" + splitter;
            //errorMsg += "<br/>" + "Process Status : " + status + "<br/>" + border;
            return "===========================================" + "<br/>" + "Operation/Page Name : " + operationName + "<br/>" + "-------------------------------------- " + "<br/>" + "Method/Function Name : " + operationType + "<br/>" + "-------------------------------------- " + "<br/>" + "Customer Email Id : " + customerEmail + "<br/>" + "-------------------------------------- " + "<br/>" + "Exception Message : " + exMessage + "<br/>" + "-------------------------------------- " + "<br/>" + "Stack Trace :" + exStack + "<br/>" + "-------------------------------------- " + "<br/>" + "Date of Exception : " + DateTime.Now.ToString() + "<br/>" + "-------------------------------------- " + "<br/>" + "Process Status : " + status + "<br/>" + "===========================================";
        }

        public static void WriteClientErrorLog(string operationName, string operationType, string exMessage, string clientName)
        {
            WriteClientLog(clientName,"===========================================");
            WriteClientLog(clientName, "Controller Name : " + operationName);
            WriteClientLog(clientName, "-------------------------------------- ");
            WriteClientLog(clientName, "Method/Function Name : " + operationType);
            WriteClientLog(clientName, "-------------------------------------- ");
            //WriteClientLog(clientName, "Customer Email Id : " + customerEmail);
            //WriteClientLog(clientName, "-------------------------------------- ");
            WriteClientLog(clientName, "Exception Message : " + exMessage);
            WriteClientLog(clientName, "-------------------------------------- ");
            //WriteClientLog(clientName, "Stack Trace :" + exStack);
            //WriteClientLog(clientName, "-------------------------------------- ");
            WriteClientLog(clientName, "Date of Exception : " + DateTime.Now.ToString());
            WriteClientLog(clientName, "-------------------------------------- ");
            WriteClientLog(clientName, "Process Status : Error" );
            WriteClientLog(clientName, "===========================================");
        }

        public static void WriteClientLog(string clientName, string message)
        {
            try
            {
                string fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                //string client = (clientName.ToUpper() == "ACTIVEI") ? "ActiveiClientLog" : "GearHeadConnectClientLog";
                fileName = fileName + "\\ErrorLog\\Client";
                //fileName = fileName + "\\" + client + "\\Log";
                Directory.CreateDirectory(fileName);
                string logpath = fileName + (@"\ErrorLog_" + System.DateTime.Now.ToString("dd_MM_yyyy") + ".csv");
                //Calling StreamWriter Function
                StreamWriter mFWriter = default(StreamWriter);
                //Logging the Message
                //Checking Weather the Log File Exists
                mFWriter = (File.Exists(logpath)) ? File.AppendText(logpath) : File.CreateText(logpath);
                //Writing Log File
                mFWriter.WriteLine(message);
                //Clearing the Stream Writer Object
                mFWriter.Flush();
                mFWriter.Close();
            }
            catch (Exception)
            {
                //throw ex;
            }

        }
        #endregion
    }
}
    #endregion

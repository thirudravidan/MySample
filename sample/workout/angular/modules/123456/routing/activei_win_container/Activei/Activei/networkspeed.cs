using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Amazon.S3;
using Amazon.S3.Model;
using System.Configuration;
using System.Collections.Specialized;
using System.ComponentModel;
using System.IO;
using System.Net;
using Microsoft.Win32;
using Activei.Tracker;
using System.Threading;
namespace Activei
{
    public partial class MainWindow
    {
        public static double transfered;
        public static double dowloadrate;
        public string filepath;
        BackgroundWorker uxuploadWorker, uxdownloadWorker;
        public static string extractionPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "\\FileUpload";
        public void getUploadTransferRate()
        {
            if (Directory.Exists(extractionPath))
            {
                if (Directory.GetFiles(extractionPath).Count() > 0)
                {
                    foreach (var item in Directory.GetFiles(extractionPath))
                    {
                        FileInfo imgInfo = new FileInfo(item);
                        if (!IsFileLocked(imgInfo))
                        {
                            File.Delete(item);
                        }

                    }
                }
            }

            uxuploadWorker = new BackgroundWorker();
            uxuploadWorker.WorkerSupportsCancellation = true;
            uxuploadWorker.DoWork += new DoWorkEventHandler(bgw_DoWork);
            //uxuploadWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(bgw_RunWorkerCompleted);
            uxuploadWorker.WorkerReportsProgress = true;
            uxuploadWorker.RunWorkerAsync();

            uxdownloadWorker = new BackgroundWorker();
            uxdownloadWorker.WorkerSupportsCancellation = true;
            uxdownloadWorker.DoWork += new DoWorkEventHandler(uxdownloadWorker_DoWork);
            //uxdownloadWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(uxdownloadWorker_RunWorkerCompleted);
            uxdownloadWorker.WorkerReportsProgress = true;
            uxdownloadWorker.RunWorkerAsync();
        }

        //protected virtual bool IsFileLocked(FileInfo file)
        //{
        //    FileStream stream = null;

        //    try
        //    {
        //        stream = file.Open(FileMode.Open, FileAccess.ReadWrite, FileShare.None);
        //    }
        //    catch (IOException)
        //    {
        //        //the file is unavailable because it is:
        //        //still being written to
        //        //or being processed by another thread
        //        //or does not exist (has already been processed)
        //        return true;
        //    }
        //    finally
        //    {
        //        if (stream != null)
        //            stream.Close();
        //    }

        //    //file is not locked
        //    return false;
        //}

        public double getUploadingrate()
        {
            Thread.Sleep(1000);
            uxuploadWorker.CancelAsync();
            return transfered;
        }
        public double getDownloadingrate()
        {
            Thread.Sleep(1000);
            uxdownloadWorker.CancelAsync();
            return dowloadrate;

        }

        public bool isNetWorkStopped = false;
        public void resetNetworkSpeed()
        {
            if (uxuploadWorker != null || uxdownloadWorker != null)
            {
                isNetWorkStopped = true;
                uxuploadWorker.CancelAsync();
                uxdownloadWorker.CancelAsync();
            }
        }

        void bgw_DoWork(object sender, DoWorkEventArgs e)
        {

            try
            {
                if (uxuploadWorker.CancellationPending && isNetWorkStopped)
                {
                    isNetWorkStopped = false;
                    e.Cancel = true;
                    return;
                }
                double starttime = Environment.TickCount;

                //Code Commmented on 03/11/2015 start
                //AmazonS3 client;
                //AWS_start(source, fileName);
                //NameValueCollection appConfig = ConfigurationManager.AppSettings;
                //using (client = Amazon.AWSClientFactory.CreateAmazonS3Client("AKIAJPSOLEVW3CMPKP7Q", "FqpOdFoVxpdRtUV837qb7lBkQBJEHa7uMuqkEIUi"))
                //{
                //    string uploadImgPath = string.Empty;

                //RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName(ConfigSettings.ClientName);
                //if (UninstallRegistryKey != null)
                //{
                //    String uninstallPath = UninstallRegistryKey.GetValue("UninstallString").ToString();
                //    uploadImgPath = Path.Combine(uninstallPath.Replace("\"", "").Substring(0, uninstallPath.LastIndexOf("\\")), ConfigurationManager.AppSettings["UploadImage"]);
                //}
                //    PutObjectRequest request = new PutObjectRequest()
                //    {
                //        //FilePath = System.Reflection.Assembly.GetExecutingAssembly().Location + "//..//..//..//Resources/uploadimg.png",
                //        FilePath = uploadImgPath,
                //        BucketName = "jack2",
                //        Key = "FileUpload/uploadimg_" + DateTime.Now + ".png"
                //    };
                //    WebProxy ss = new WebProxy() { UseDefaultCredentials = true };

                //    PutObjectResponse response = client.PutObject(request);

                //}
                //Code Commmented on 03/11/2015 End
                string uploadFilePath = string.Empty;
                RegistryKey UninstallRegistryKey = GetUninstallRegistryKeyByProductName(ConfigSettings.ClientName);
                if (UninstallRegistryKey != null)
                {
                    String uninstallPath = UninstallRegistryKey.GetValue("UninstallString").ToString();
                    uploadFilePath = Path.Combine(uninstallPath.Replace("\"", "").Substring(0, uninstallPath.LastIndexOf("\\")), ConfigurationManager.AppSettings["UploadFile"]);
                }

                //UploadFilesToRemoteUrl(@"D:\Thiru\Upload.txt");
                UploadFilesToRemoteUrl(uploadFilePath);
                double endtime = Environment.TickCount;
                double secs = Math.Floor(endtime - starttime) / 1000;
                double secs2 = Math.Round(secs, 0);
                double kbsec = (secs != 0.0) ? Math.Round(120 / secs) : 0.0;
                double mbsec = Math.Round(kbsec / 100, 2);
                transfered = mbsec;
            }
            catch (AmazonS3Exception amazonS3Exception)
            {
                uxuploadWorker.CancelAsync();
                if (amazonS3Exception.ErrorCode != null &&
                    (amazonS3Exception.ErrorCode.Equals("InvalidAccessKeyId") ||
                    amazonS3Exception.ErrorCode.Equals("InvalidSecurity")))
                {
                    Console.WriteLine("Please check the provided AWS Credentials.");
                    Console.WriteLine("If you haven't signed up for Amazon S3, please visit http://aws.amazon.com/s3");
                }
                else
                {
                    Console.WriteLine("An error occurred with the message '{0}' when writing an object", amazonS3Exception.Message);
                }
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("networkspeed.cs", "bgw_DoWork", "", ex.Message, ex.StackTrace, "ERROR");
                uxuploadWorker.CancelAsync();
            }
        }


        public static void UploadFilesToRemoteUrl(string fileUrl)
        {
            WebRequest request = WebRequest.Create(ConfigurationManager.AppSettings["UploadRequest"]);
            // Set the Method property of the request to POST.
            request.Method = "POST";
            // Create POST data and convert it to a byte array.
            string postData = "This is a test that posts this string to a Web server.";
            //byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            byte[] byteArray = System.IO.File.ReadAllBytes(fileUrl);
            // Set the ContentType property of the WebRequest.
            request.ContentType = "application/x-www-form-urlencoded";
            // Set the ContentLength property of the WebRequest.
            request.ContentLength = byteArray.Length;
            // Get the request stream.
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.
            dataStream.Close();
            // Get the response.
            WebResponse response = request.GetResponse();
            // Display the status.
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.
            string responseFromServer = reader.ReadToEnd();
            // Display the content.
            Console.WriteLine(responseFromServer);
            // Clean up the streams.
            reader.Close();
            dataStream.Close();
            response.Close();
        }

        void uxdownloadWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                if (uxdownloadWorker.CancellationPending && isNetWorkStopped)
                {
                    isNetWorkStopped = false;
                    e.Cancel = true;
                    return;
                }

                double startdownloadtime = Environment.TickCount;
                //Code Commented on 03/11/2015 start
                //AmazonS3 clientdown;
                //using (clientdown = Amazon.AWSClientFactory.CreateAmazonS3Client("AKIAJPSOLEVW3CMPKP7Q", "FqpOdFoVxpdRtUV837qb7lBkQBJEHa7uMuqkEIUi"))
                //{

                //    GetObjectRequest downrequest = new GetObjectRequest();
                //    downrequest.BucketName = "jack2";
                //    downrequest.Key = "FileDownload/uploadimg.png";
                //    GetObjectResponse response = clientdown.GetObject(downrequest);
                //    //string extractionPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "//FileUpload";
                //    //foreach (var item in Directory.GetFiles(extractionPath))
                //    //{
                //    //    File.Delete(item);
                //    //}
                //    filepath = extractionPath + "//uploadimg_" + startdownloadtime + ".png";
                //    if (!Directory.Exists(extractionPath))  // Create the default extraction path directory, if it does not exist
                //    {
                //        Directory.CreateDirectory(extractionPath);
                //    }
                //    response.WriteResponseStreamToFile(filepath, false);
                //}

                //Code Commented on 03/11/2015 End

                //Code Added on 03/11/2015 Start
                filepath = extractionPath + "//uploadimg_" + startdownloadtime + ".txt";
                if (!Directory.Exists(extractionPath))  // Create the default extraction path directory, if it does not exist
                {
                    Directory.CreateDirectory(extractionPath);
                }
                System.Net.WebClient webClient = new System.Net.WebClient();
                webClient.DownloadFile(ConfigurationManager.AppSettings["DownloadImage"], filepath);
                //Code Added on 03/11/2015 End

                double enddownloadtime = Environment.TickCount;
                double seconds = Math.Floor(enddownloadtime - startdownloadtime) / 1000;
                double rndseconds = Math.Round(seconds, 0);
                //double kbssec = Math.Round(2280 / seconds);
                double kbssec = (seconds != 0.0) ? Math.Round(120 / seconds) : 0.0;

                double mbssec = Math.Round(kbssec / 100, 2);
                dowloadrate = mbssec;
            }
            catch (Exception ex)
            {
                ErrorTracker.WriteErrorLog("networkspeed.cs", "uxdownloadWorker_DoWork", "", ex.Message, ex.StackTrace, "ERROR");
                uxdownloadWorker.CancelAsync();
            }
        }
    }
}

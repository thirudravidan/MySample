using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using System.Data;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.AccessControl;
using NetgearGearHeadBootstrap.Tracker;
using System.IO.Compression;


namespace NetgearGearHeadBootstrap
{
    static class Program
    {
        #region "Declarations"
        public const string ClientName = "Activei";
        //public const string ClientName = "GearHead Connect";
        //Local

        //public static string ghurlPath = "http://10.20.28.29/gearhead/";
        //public static string activeiurlPath = "http://10.20.28.29/activeilocal/";

        //public static string ghurlPath = "http://devis.csscorp.com/activeu/";
        //public static string activeiurlPath = "http://devis.csscorp.com/activeu/";

        //Development
        //public static string ghurlPath = "http://is-dev.csscorp.com/gearhead/";
        //public static string activeiurlPath = "http://is-dev.csscorp.com/activei/";

        ////Live
        public static string ghurlPath = "http://gc.gearheadsupport.com/";
        public static string activeiurlPath = "https://activei.csscorp.com/";

        //Staging
        //public static string ghurlPath = "https://ghstaging.csscorp.com/";
        //public static string activeiurlPath = "http://devis.csscorp.com/activeu/";

        //Staging_Live
        //public static string ghurlPath = "http://ghstaging.csscorp.com/ghlive/";
        //public static string activeiurlPath = "http://activei.csscorp.com/";



        //"C:\Program Files (x86)\Microsoft SDKs\Windows\v7.0A\bin\signtool.exe" sign /f $(ProjectDir)NetgearCodeSignCert.pfx /p N3tg3aR! $(TargetPath)"


        //"C:\Program Files (x86)\Microsoft SDKs\Windows\v7.0A\bin\signtool.exe" sign /f $(ProjectDir)Activeicertificate.pfx /p PASSWORD $(TargetPath)"
       

        public static string path = string.Empty;

        public const string ghCetrfileName = "NetgearCodeSignCert.pfx";
        public const string activeiCertfileName = "Activeicertificate.pfx";
        public static string certificateFileName = string.Empty;


        public const string ghcertificatePassword = "N3tg3aR!";
        //public const string activeicertificatePassword = "csscorp121";
        public const string activeicertificatePassword = "PASSWORD";
        public static string certificatePassword = string.Empty; 
        #endregion

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            certificateFileName = (ClientName == "GearHead Connect") ? ghCetrfileName : activeiCertfileName;
            path = (ClientName == "GearHead Connect") ? ghurlPath : activeiurlPath;
            certificatePassword = (ClientName == "GearHead Connect") ? ghcertificatePassword : activeicertificatePassword;

            ErrorTracker errorTracker = new ErrorTracker();
            errorTracker.WriteLog("=================================================");
            errorTracker.WriteLog("Program.Main() method was invoked.");
            errorTracker.WriteLog("=================================================");

            string directoryName = string.Empty;
            errorTracker.WriteLog("Going to Add the certificate....");
            AddCert(loadCertificate(out directoryName, path), directoryName);

            //errorTracker.WriteLog("Downloading Offline pages...");
            //downloadOfflinePage();

            //errorTracker.WriteLog("Downloading NetgearHTMLOffline.zip ...");
            //UnZipFiles();

            errorTracker.WriteLog("Going to invoke the Bootstarp UI....");
            errorTracker = null;

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Bootstrap());
        }


        private static string loadCertificate(out string directoryName, string urlPath)
        {
            string fileName = string.Empty;

            try
            {
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteLog("=================================================");
                errorTracker.WriteLog("Program.loadCertificate() method was invoked.");
                errorTracker.WriteLog("=================================================");

                directoryName = string.Empty;
                System.Net.WebClient webClient = new System.Net.WebClient();

                fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                errorTracker.WriteLog("MyDocuments Path :: " + fileName);

                fileName = Path.Combine(fileName, ((ClientName == "GearHead Connect") ? "GearHeadConnect" : "CssConnect"));
                errorTracker.WriteLog("GearHeadConnect Path :: " + fileName);

                errorTracker.WriteLog("Going to create " + ClientName + "directory:: " + fileName);
                Directory.CreateDirectory(fileName);

                errorTracker.WriteLog("Going to AddDirectorySecurity to " + ClientName + " directory:: " + fileName);
                AddDirectorySecurity(fileName, @"Users", FileSystemRights.FullControl, AccessControlType.Allow);

                directoryName = fileName;
                fileName = Path.Combine(directoryName, certificateFileName);

                errorTracker.WriteLog("Dowloading" + certificateFileName + "file (" + urlPath + certificateFileName + ") :: " + fileName);
                webClient.DownloadFile(urlPath + certificateFileName, fileName);
                errorTracker.WriteLog("Dowloading" + certificateFileName + "file (" + urlPath + certificateFileName + ") :: " + fileName + " was Completed");
                errorTracker.WriteLog("==Program.loadCertificate() method invokation was completed.==");
                errorTracker.WriteLog("==============================================================");
                errorTracker = null;
            }
            catch (Exception ex)
            {
                directoryName = fileName;
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteErrorLog("Program.cs", "loadCertificate", "", ex.Message, ex.StackTrace, "ERROR");
                if (ex.InnerException != null)
                {
                    errorTracker.WriteErrorLog("Program.cs", "loadCertificate", "", ex.InnerException.Message, ex.InnerException.StackTrace, "ERROR - InnerException");
                }
                errorTracker = null;
            }

            return fileName;
        }


        //Loading offline html pages
        //private static void downloadOfflinePage()
        //{
        //    try
        //    {
        //        ErrorTracker errorTracker = new ErrorTracker();
        //        errorTracker.WriteLog("=================================================");
        //        errorTracker.WriteLog("Program.downloadOfflinePage() method was invoked.");
        //        errorTracker.WriteLog("=================================================");
        //        System.Net.WebClient webClient = new System.Net.WebClient();
        //        string fileName = string.Empty;
        //        fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        //        errorTracker.WriteLog("MyDocuments Path :: " + fileName);

        //        fileName = fileName + "\\GearHeadConnect";
        //        errorTracker.WriteLog("GearHeadConnect Path :: " + fileName);

        //        errorTracker.WriteLog("Going to create GearHeadConnect directory:: " + fileName);
        //        Directory.CreateDirectory(fileName);

        //        errorTracker.WriteLog("Going to AddDirectorySecurity to GearHeadConnect directory:: " + fileName);
        //        AddDirectorySecurity(fileName, @"Users", FileSystemRights.FullControl, AccessControlType.Allow);

        //        fileName = fileName + "\\noconnection.htm";
        //        errorTracker.WriteLog("Dowloading noconnection.htm file (" + urlPath + "offline/noconnection.htm) :: " + fileName);
        //        webClient.DownloadFile(urlPath + "offline/noconnection.htm", fileName);
        //        errorTracker.WriteLog("Dowloading noconnection.htm file (" + urlPath + "offline/noconnection.htm) :: " + fileName + " was Completed");


        //        fileName = string.Empty;
        //        fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        //        fileName = fileName + "\\GearHeadConnect";
        //        fileName = fileName + "\\error.png";
        //        errorTracker.WriteLog("Dowloading error.png file (" + urlPath + "offline/error.png) :: " + fileName);
        //        webClient.DownloadFile(urlPath + "offline/error.png", fileName);
        //        errorTracker.WriteLog("Dowloading error.png file (" + urlPath + "offline/error.png) :: " + fileName + " was Completed");

        //        fileName = string.Empty;
        //        fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        //        fileName = fileName + "\\GearHeadConnect";
        //        fileName = fileName + "\\generalerror.htm";
        //        errorTracker.WriteLog("Dowloading generalerror.htm file (" + urlPath + "offline/generalerror.htm) :: " + fileName);
        //        webClient.DownloadFile(urlPath + "offline/generalerror.htm", fileName);
        //        errorTracker.WriteLog("Dowloading generalerror.htm file (" + urlPath + "offline/generalerror.htm) :: " + fileName + " was Completed");

        //        fileName = string.Empty;
        //        fileName = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        //        fileName = fileName + "\\GearHeadConnect";
        //        fileName = fileName + "\\innerscreenbg.png";
        //        errorTracker.WriteLog("Dowloading innerscreenbg.png file (" + urlPath + "offline/innerscreenbg.png) :: " + fileName);
        //        webClient.DownloadFile(urlPath + "offline/innerscreenbg.png", fileName);
        //        errorTracker.WriteLog("Dowloading innerscreenbg.png file (" + urlPath + "offline/innerscreenbg.png) :: " + fileName + " was Completed");

        //        errorTracker.WriteLog("==Program.downloadOfflinePage() method invokation was completed.==");
        //        errorTracker.WriteLog("==================================================================");
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorTracker errorTracker = new ErrorTracker();
        //        errorTracker.WriteErrorLog("Program.cs", "downloadOfflinePage", "", ex.Message, ex.StackTrace, "ERROR");
        //        if (ex.InnerException != null)
        //        {
        //            errorTracker.WriteErrorLog("Program.cs", "downloadOfflinePage", "", ex.InnerException.Message, ex.InnerException.StackTrace, "ERROR - InnerException");
        //        }
        //        errorTracker = null;
        //    }
        //}

        // Adds an ACL entry on the specified directory for the specified account. 
        public static void AddDirectorySecurity(string FileName, string Account, FileSystemRights Rights, AccessControlType ControlType)
        {
            try
            {
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteLog("=================================================");
                errorTracker.WriteLog("Program.AddDirectorySecurity() method was invoked.");
                errorTracker.WriteLog("=================================================");

                // Create a new DirectoryInfo object.
                errorTracker.WriteLog("Create a new DirectoryInfo object");
                DirectoryInfo dInfo = new DirectoryInfo(FileName);

                // Get a DirectorySecurity object that represents the  
                // current security settings.
                errorTracker.WriteLog("Get a DirectorySecurity object that represents the current security settings.");
                DirectorySecurity dSecurity = dInfo.GetAccessControl();

                // Add the FileSystemAccessRule to the security settings. 
                errorTracker.WriteLog("Add the FileSystemAccessRule to the security settings.");
                //dSecurity.AddAccessRule(new FileSystemAccessRule(Account, Rights, ControlType));
                CanonicalizeDacl(dSecurity);

                // Set the new access settings.
                errorTracker.WriteLog("Set the new access settings.");
                dInfo.SetAccessControl(dSecurity);

                errorTracker.WriteLog("==Program.AddDirectorySecurity() method invokation was completed.==");
                errorTracker.WriteLog("===================================================================");
                errorTracker = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteErrorLog("Program.cs", "AddDirectorySecurity", "", ex.Message, ex.StackTrace, "ERROR");
                if (ex.InnerException != null)
                {
                    errorTracker.WriteErrorLog("Program.cs", "AddDirectorySecurity", "", ex.InnerException.Message, ex.InnerException.StackTrace, "ERROR - InnerException");
                }
                errorTracker = null;
            }
        }

        public static void AddCert(string cerFileName, string directoryName)
        {
            try
            {
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteLog("=====================================");
                errorTracker.WriteLog("Program.AddCert() method was invoked.");
                errorTracker.WriteLog("=====================================");

                
                
                string certificateLocation = cerFileName;
                errorTracker.WriteLog("certificateLocation :: " + cerFileName);
                errorTracker.WriteLog("Installing the certificate....");
                InstallCertificate(certificateLocation, certificatePassword);
                errorTracker.WriteLog("certificate installation was completed.");

                if (Directory.Exists(directoryName))
                {
                    errorTracker.WriteLog("certificate directory : " + directoryName);
                    File.Delete(Path.Combine(directoryName, certificateFileName));
                    errorTracker.WriteLog("certificate file deleted : " + directoryName);
                }
                errorTracker.WriteLog("==Program.AddCert() method invokation was completed.==");
                errorTracker.WriteLog("======================================================");
                errorTracker = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteErrorLog("Program.cs", "AddCert", "", ex.Message, ex.StackTrace, "ERROR");
                if (ex.InnerException != null)
                {
                    errorTracker.WriteErrorLog("Program.cs", "AddCert", "", ex.InnerException.Message, ex.InnerException.StackTrace, "ERROR - InnerException");
                }
                errorTracker = null;
            }
        }
        private static void InstallCertificate(string certificatePath, string certificatePassword)
        {
            try
            {
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteLog("================================================");
                errorTracker.WriteLog("Program.InstallCertificate() method was invoked.");
                errorTracker.WriteLog("================================================");

                var serviceRuntimeUserCertificateStore = new X509Store(StoreName.TrustedPublisher);
                serviceRuntimeUserCertificateStore.Open(OpenFlags.ReadWrite);
                X509Certificate2 cert;
                try
                {
                    cert = new X509Certificate2(System.IO.File.ReadAllBytes(certificatePath), certificatePassword, X509KeyStorageFlags.MachineKeySet |
                                     X509KeyStorageFlags.PersistKeySet |
                                     X509KeyStorageFlags.Exportable);
                }
                catch (Exception ex)
                {
                    errorTracker.WriteLog("ERROR :: Failed to load certificate " + certificatePath);
                    errorTracker.WriteLog("ERROR :: Certificate appeared to load successfully but also seems to be null.");
                    errorTracker.WriteErrorLog("Program.cs", "InstallCertificate", "", ex.Message, ex.StackTrace, "ERROR");
                    if (ex.InnerException != null)
                    {
                        errorTracker.WriteErrorLog("Program.cs", "InstallCertificate", "", ex.InnerException.Message, ex.InnerException.StackTrace, "ERROR - InnerException");
                    }
                    throw new DataException("Certificate appeared to load successfully but also seems to be null.", ex);
                }

                serviceRuntimeUserCertificateStore.Add(cert);
                serviceRuntimeUserCertificateStore.Close();

                errorTracker.WriteLog("==Program.InstallCertificate() method invokation was completed.==");
                errorTracker.WriteLog("=================================================================");
                errorTracker = null;
            }
            catch (Exception ex)
            {
                ErrorTracker errorTracker = new ErrorTracker();
                errorTracker.WriteLog("ERROR :: Failed to install {0}.  Check the certificate index entry and verify the certificate file exists. " + certificatePath);
                errorTracker.WriteErrorLog("Program.cs", "InstallCertificate", "", ex.Message, ex.StackTrace, "ERROR");
                if (ex.InnerException != null)
                {
                    errorTracker.WriteErrorLog("Program.cs", "InstallCertificate", "", ex.InnerException.Message, ex.InnerException.StackTrace, "ERROR - InnerException");
                }
                errorTracker = null;
            }
        }

        static void CanonicalizeDacl(NativeObjectSecurity objectSecurity)
        {
            if (objectSecurity == null) { throw new ArgumentNullException("objectSecurity"); }
            if (objectSecurity.AreAccessRulesCanonical) { return; }

            // A canonical ACL must have ACES sorted according to the following order:
            //   1. Access-denied on the object
            //   2. Access-denied on a child or property
            //   3. Access-allowed on the object
            //   4. Access-allowed on a child or property
            //   5. All inherited ACEs 
            RawSecurityDescriptor descriptor = new RawSecurityDescriptor(objectSecurity.GetSecurityDescriptorSddlForm(AccessControlSections.Access));

            List<CommonAce> implicitDenyDacl = new List<CommonAce>();
            List<CommonAce> implicitDenyObjectDacl = new List<CommonAce>();
            List<CommonAce> inheritedDacl = new List<CommonAce>();
            List<CommonAce> implicitAllowDacl = new List<CommonAce>();
            List<CommonAce> implicitAllowObjectDacl = new List<CommonAce>();

            foreach (CommonAce ace in descriptor.DiscretionaryAcl)
            {
                if ((ace.AceFlags & AceFlags.Inherited) == AceFlags.Inherited) { inheritedDacl.Add(ace); }
                else
                {
                    switch (ace.AceType)
                    {
                        case AceType.AccessAllowed:
                            implicitAllowDacl.Add(ace);
                            break;

                        case AceType.AccessDenied:
                            implicitDenyDacl.Add(ace);
                            break;

                        case AceType.AccessAllowedObject:
                            implicitAllowObjectDacl.Add(ace);
                            break;

                        case AceType.AccessDeniedObject:
                            implicitDenyObjectDacl.Add(ace);
                            break;
                    }
                }
            }

            Int32 aceIndex = 0;
            RawAcl newDacl = new RawAcl(descriptor.DiscretionaryAcl.Revision, descriptor.DiscretionaryAcl.Count);
            implicitDenyDacl.ForEach(x => newDacl.InsertAce(aceIndex++, x));
            implicitDenyObjectDacl.ForEach(x => newDacl.InsertAce(aceIndex++, x));
            implicitAllowDacl.ForEach(x => newDacl.InsertAce(aceIndex++, x));
            implicitAllowObjectDacl.ForEach(x => newDacl.InsertAce(aceIndex++, x));
            inheritedDacl.ForEach(x => newDacl.InsertAce(aceIndex++, x));

            if (aceIndex != descriptor.DiscretionaryAcl.Count)
            {
                System.Diagnostics.Debug.Fail("The DACL cannot be canonicalized since it would potentially result in a loss of information");
                return;
            }

            descriptor.DiscretionaryAcl = newDacl;
            objectSecurity.SetSecurityDescriptorSddlForm(descriptor.GetSddlForm(AccessControlSections.Access), AccessControlSections.Access);
        }

        //private static void UnZipFiles()
        //{
        //    try
        //    {
        //        ErrorTracker errorTracker = new ErrorTracker();
        //        errorTracker.WriteLog("UnZipFiles() was initiated....");
        //        string sourceFile = urlPath + "NetgearHTMLOffline.zip";

        //        String gearheadFolder = string.Empty;
        //        gearheadFolder = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        //        gearheadFolder = Path.Combine(gearheadFolder, "GearHead Connect");

        //        if (Directory.Exists(gearheadFolder))
        //        {
        //            Directory.Delete(gearheadFolder, true);
        //            Directory.CreateDirectory(gearheadFolder);
        //        }
        //        else
        //        {
        //            Directory.CreateDirectory(gearheadFolder);
        //        }

        //        string zipFileName = Path.Combine(gearheadFolder, "NetgearHTMLOffline.zip");
        //        errorTracker.WriteLog("Downloading NetgearHTMLOffline.zip file (" + sourceFile + ") :: " + zipFileName);
        //        System.Net.WebClient webClient = new System.Net.WebClient();
        //        webClient.DownloadFile(sourceFile, zipFileName);
        //        errorTracker.WriteLog("Successfully Downloaded NetgearHTMLOffline.zip file (" + sourceFile + ") :: " + zipFileName);

        //        errorTracker.WriteLog("Going to extract NetgearHTMLOffline.zip file :: " + zipFileName);
        //        ArchiveManager.UnArchive(zipFileName, gearheadFolder);
        //        errorTracker.WriteLog("NetgearHTMLOffline.zip file :: " + zipFileName + " was successfully extracted");

        //        errorTracker.WriteLog("Going to delete NetgearHTMLOffline.zip file :: " + zipFileName);
        //        File.Delete(zipFileName);
        //        errorTracker.WriteLog("NetgearHTMLOffline.zip file :: " + zipFileName + " was successfully deleted");

        //        errorTracker = null;
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorTracker errorTracker = new ErrorTracker();
        //        errorTracker.WriteErrorLog("Program.cs", "UnZipFiles", "", ex.Message, ex.StackTrace, "ERROR");
        //        if (ex.InnerException != null)
        //        {
        //            errorTracker.WriteErrorLog("Program.cs", "UnZipFiles", "", ex.InnerException.Message, ex.InnerException.StackTrace, "ERROR - InnerException");
        //        }
        //        errorTracker = null;
        //    }
        //}
    }
}

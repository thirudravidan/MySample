using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Activei.Defragmentation;
using System.IO;
using Newtonsoft.Json;

namespace Activei
{
    public partial class MainWindow
    {
        DefragmentationPresenter _defragPresenter;
        BindingList<DefragDriveSpecifications> defragDriveSpecifications = null;
        List<string> selectedDrives = new List<string>();
        DefragmentationService defragService = new DefragmentationService();
        public bool analyse;
        public bool defragment;
        public bool forceDefragmentation;

        public string defragmentationInit(bool blnanalyse, bool blndefragmentVal,bool blnForceDefragmentation)
        {
            analyse = blnanalyse;
            defragment = blndefragmentVal;
            forceDefragmentation = blnForceDefragmentation;
            _defragPresenter.InitializeView();
            var driverList = JsonConvert.SerializeObject((BindingList<DefragDriveSpecifications>)GetDeriversList());
            return driverList;

        }

        public BindingList<DefragDriveSpecifications> driversDetails;
        public BindingList<DefragDriveSpecifications> GetDeriversList()
        {
            return driversDetails;
        }

        public class SelectedDriveDetails
        {
            public bool IsSelected { get; set; }
            public string DriveName { get; set; }
        }

        List<SelectedDriveDetails> lstSeledtedDrivedetails = new List<SelectedDriveDetails>();
        public void startDefragmentationProcess(string selectedDriveList, bool blnanalyse, bool blndefragmentVal, bool blnForceDefragmentation)
        {
            try
            {
                analyse = blnanalyse;
                defragment = blndefragmentVal;
                forceDefragmentation = blnForceDefragmentation;
                lstSeledtedDrivedetails = JsonConvert.DeserializeObject<List<SelectedDriveDetails>>(selectedDriveList);
                _defragPresenter.StartDefragmentation();
                
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string getAnalysisReport()
        {
            string val=DefragmentationService.GetAnalysisReport();
            return val;
        }

        public void stopDefragmentationProcess()
        {
            _defragPresenter.StopCleanup();
            //StopProcess();
        }


        List<string> drivesList;
        public List<string> Drives
        {
            get
            {
               
                drivesList = (drivesList == null) ? new List<string>() : drivesList;               
                return drivesList;
            }
            set
            {
                drivesList = value;
                if (drivesList != null)
                {
                    //uxDrivesDataGridView.AutoGenerateColumns = false;
                    BindingList<DefragDriveSpecifications> defragDriveSpecifications = new BindingList<DefragDriveSpecifications>();
                    foreach (string drive in drivesList)
                    {
                        ListViewItem driveItem = new ListViewItem();
                        driveItem.SubItems.Add(drive);
                        string driveLabel = new DriveInfo(drive).VolumeLabel;
                        driveItem.SubItems.Add(driveLabel);

                        defragDriveSpecifications.Add(new DefragDriveSpecifications() { IsSelected = false, DriveName = drive, DriveLabel = driveLabel });
                        driversDetails = defragDriveSpecifications;
                    }
                    //uxDrivesDataGridView.DataSource = defragDriveSpecifications;
                }
            }
        }


        public bool Analyse
        {
            get
            {
                return analyse;

            }
            set { }
        }

        public bool Defragment
        {
            get
            {
                return defragment;
                //uxDefragmentRadioButton.Checked; 
            }
            set { }
        }

        public bool ForceDefragment
        {
            get
            {
                return forceDefragmentation;
            }
            set { }
        }

        
        public string Report
        {
            get
            {

                return string.Empty;
                //uxReportRichTextBox.Text;
            }
            set
            {
                
            }
        }




        public List<string> SelectedDrives
        {
            get
            {
                try
                {
                    //for (int i = 0; i < uxDrivesDataGridView.Rows.Count; i++)
                    //{
                    //    Boolean isSelected = (Boolean)uxDrivesDataGridView[0, i].Value;
                    //    if (isSelected)
                    //    {
                    //        selectedDrives.Add(uxDrivesDataGridView[1, i].Value.ToString());
                    //    }
                    //}
                    foreach (var item in lstSeledtedDrivedetails)
                    {
                        if (item.IsSelected)
                        {
                            selectedDrives.Add(item.DriveName);
                        }
                    }
                    return selectedDrives;
                }
                catch (Exception)
                {
                    return selectedDrives;
                }
            }
            set { }
        }

        public bool OperationComplete
        {
            get
            {
                return false;
            }
            set
            {
                if (value)
                {
                    //StopProcess();
                }
            }
        }

        string alignedReport = string.Empty;
        public string AlignedReport
        {
            get
            {
                return alignedReport;
            }
            set
            {
                //uxReportRichTextBox.Text = value;
                //uxReportWebBrowser.DocumentText = value;
            }
        }

    }
}

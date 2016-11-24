using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace Activei.Defragmentation
{
    public class DefragmentationModel : IDefragmentation
    {
        #region IDefragmentation Members

        List<string> drives;
        List<string> selectedDrives;
        bool analyse = false;
        bool defragment = false;
        bool forceDefragment = false;
        string report = string.Empty;
        string imagePath = string.Empty;
        bool start = false;
        bool operationComplete = false;

        public List<string> Drives
        {
            get { return drives; }
            set { drives = value; }
        }

        public bool Analyse
        {
            get { return analyse; }
            set { analyse = value; }

        }

        public bool Defragment
        {
            get { return defragment; }
            set { defragment = value; }

        }

        public bool ForceDefragment
        {
            get { return forceDefragment; }
            set { forceDefragment = value; }
        }

        public string Report
        {
            get { return report; }
            set { report = value; }
        }

        public string ImagePath
        {
            get { return imagePath; }
            set { imagePath = value; }
        }

        public List<string> SelectedDrives
        {
            get { return selectedDrives; }
            set { selectedDrives = value; }
        }

        public bool Start
        {
            get { return start; }
            set { start = value; }
        }

        public bool OperationComplete
        {
            get
            {
                return operationComplete;
            }
            set
            {
                operationComplete = value;
            }
        }

        #endregion

        #region IDefragmentation Members
        string alignedReport = string.Empty;

        public string AlignedReport
        {
            get { return alignedReport; }
            set { alignedReport = value; }
        }

        #endregion
    }
}

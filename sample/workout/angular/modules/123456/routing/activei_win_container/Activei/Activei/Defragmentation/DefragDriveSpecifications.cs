using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Activei.Defragmentation
{
    public class DefragDriveSpecifications
    {
        string driveName = string.Empty;

        public string DriveName
        {
            get { return driveName; }
            set { driveName = value; }
        }

        string driveLabel = string.Empty;

        public string DriveLabel
        {
            get { return driveLabel; }
            set { driveLabel = value; }
        }

        bool isSelected;

        public bool IsSelected
        {
            get { return isSelected; }
            set { isSelected = value; }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Activei.DiskCleanup
{
    public class JunkFileSpecifications
    {
        string fileName = string.Empty;

        public string FileName
        {
            get { return fileName; }
            set { fileName = value; }
        }

        string filePath = string.Empty;

        public string FilePath
        {
            get { return filePath; }
            set { filePath = value; }
        }

        string fileSize = string.Empty;

        public string FileSize
        {
            get { return fileSize; }
            set { fileSize = value; }
        }

        bool isSelected;

        public bool IsSelected
        {
            get { return isSelected; }
            set { isSelected = value; }
        }

        
    }
}

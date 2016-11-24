using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Activei
{
    class DefragmentationConstants
    {
        public const string OPERATION_INPROGRESS = "In Progress...";
        public const int PROGRESSBAR_MINVALUE = 0;
        public const int PROGRESSBAR_MAXVALUE = 500000;
        public const int PROGRESSBAR_INCREMENT_VALUE = 1000;
        public const string OPERATION_STOP = "Stop";
        public const string OPERATION_START = "Start";
        public const string OPERATION_COMPLETED = "Completed";
        public const string PROCESS_NAME = "Drive Analysis / Defragmentation";
        public const string TITLE = "Defragmentation";
        public const string DEFRAGMENTATIONSUPPORT = "dfrgntfs";
        public const string DEFRAGMENTATION = "defrag";
        public const string ERROR_ANALYSE = "Problem in analyzing one or more drives. Please try again";
        public const string ERROR_DEFRAGMENT = "Problem in defragmentating one or more drives. Please try again";
        public const string REPORT_DIVIDER = "===================================";
    }
}

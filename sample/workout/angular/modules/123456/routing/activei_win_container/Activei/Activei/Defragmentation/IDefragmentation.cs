using System;
using System.Collections.Generic;
using System.Text;

namespace Activei.Defragmentation
{
    public interface IDefragmentation
    {
        List<string> Drives { get;set;}
        List<string> SelectedDrives { get; set; }
        bool Analyse { get;set;}
        bool Defragment { get; set; }
        bool ForceDefragment { get; set; }
        string Report { get; set; }
        bool OperationComplete { get; set; }
        string AlignedReport { get; set; }
        
    }
}

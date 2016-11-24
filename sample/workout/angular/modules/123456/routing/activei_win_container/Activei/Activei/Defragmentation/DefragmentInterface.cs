using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace Activei.Defragmentation
{
    public class DefragmentInterface 
    {
        IDefragmentation _defragView = null;

        public IDefragmentation DefragView
        {
            get { return _defragView; }
            set { _defragView = value; }
        }


        private DefragmentationService _defragService;
        private IDefragmentation _defragModel;

        public DefragmentInterface()
        {

            _defragModel = new DefragmentationModel();
            _defragService = new DefragmentationService();
            
            _defragService.GetSystemDrives(ref _defragModel);
            _defragView.Drives = _defragModel.Drives;
           
            //return "234";

            //MainWindow.chromiumBrowser.ExecuteScript("javascript:getDriverDetails('" + driversList + "')");
        }
                
    }
}

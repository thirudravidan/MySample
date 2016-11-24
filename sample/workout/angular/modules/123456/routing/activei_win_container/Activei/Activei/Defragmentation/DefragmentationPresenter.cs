using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;
using System.IO;


namespace Activei.Defragmentation
{
  public  class DefragmentationPresenter
    {
        IDefragmentation _defragView = null;
        private DefragmentationService _defragService;
        private IDefragmentation _defragModel;

        public DefragmentationPresenter(IDefragmentation defragView)
        {
            try
            {
                _defragView = defragView;
                _defragService = new DefragmentationService();
                _defragService.StopOperation = new DefragmentationService.StopOperationDelegate(StopOperation);
                _defragService.ClearReport = new DefragmentationService.ClearReportDelegate(ClearReport);
                _defragModel = new DefragmentationModel();
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationPresenter.cs : DefragmentationPresenter() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("DefragmentationPresenter.cs", "DefragmentationPresenter()", "", ex.Message, ex.StackTrace, "Error");
            }
        }

        public void InitializeView()
        {
            try
            {
                //LogMessage.WriteLogInfo("DefragmentationPresenter.cs : InitializeView() method invoked.");

                //LogMessage.WriteLogInfo("DefragmentationPresenter.cs : InitializeView(): Retrieving Drives List.");
                
                _defragService.GetSystemDrives(ref _defragModel);
                _defragView.Drives = _defragModel.Drives;
                //LogMessage.WriteLogInfo("DefragmentationPresenter.cs : InitializeView(): Updating Drives List in uxDrivesCheckedListBox.");
            }
            catch (Exception)
            {
                //LogMessage.WriteErrorInfo("DefragmentationPresenter.cs : InitializeView() :: " + ex.Message);
            }
        }

        public void StartDefragmentation()
        {
            try
            {
                _defragModel.Analyse = _defragView.Analyse;
                _defragModel.Defragment = _defragView.Defragment;
                _defragModel.ForceDefragment = _defragView.ForceDefragment;
                _defragModel.Drives = _defragView.Drives;
                _defragModel.Report = _defragView.Report;
                _defragModel.SelectedDrives = _defragView.SelectedDrives;

                _defragService.StartDefragmentation(_defragModel);
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationPresenter.cs : StartDefragmentation() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("StartDefragmentation.cs", "StartDefragmentation()", "", ex.Message, ex.StackTrace, "Error");
            }
        }

        public void StopOperation(string report)
        {
            try
            {
                _defragView.Report = report;
                //ReportData=
                //_defragView.AlignedReport = _defragModel.AlignedReport;
                _defragView.OperationComplete = true;
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationPresenter.cs : StopOperation() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("StartDefragmentation.cs", "StopOperation()", "", ex.Message, ex.StackTrace, "Error");
            }
        }

        public string ReportData;
        public string AnalysisReport()
        {
            return ReportData;
        }

        public void ClearReport(string report)
        {
            try
            {
                _defragView.Report = report;
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationPresenter.cs : ClearReport() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("StartDefragmentation.cs", "ClearReport()", "", ex.Message, ex.StackTrace, "Error");
            }
        }


        public void DeRegisterDelegates()
        {
            try
            {
                if (_defragService != null)
                {
                    if (_defragService.ClearReport != null)
                        _defragService.ClearReport -= new DefragmentationService.ClearReportDelegate(ClearReport);
                    
                    if (_defragService.StopOperation != null)
                        _defragService.StopOperation -= new DefragmentationService.StopOperationDelegate(StopOperation);
                }
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationPresenter.cs : DeRegisterDelegates() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("StartDefragmentation.cs", "DeRegisterDelegates()", "", ex.Message, ex.StackTrace, "Error");
            }
        }

        internal void StopCleanup()
        {
            try
            {
                _defragModel.Analyse = _defragView.Analyse;
                _defragModel.Defragment = _defragView.Defragment;
                _defragModel.ForceDefragment = _defragView.ForceDefragment;
                _defragModel.Drives = _defragView.Drives;
                _defragModel.Report = _defragView.Report;
                _defragModel.SelectedDrives = _defragView.SelectedDrives;
                _defragService.StopDefragmentation(_defragModel);
            }
            catch (Exception ex)
            {
                //LogMessage.WriteErrorInfo("DefragmentationPresenter.cs : StopCleanup() :: " + ex.Message);
                //ErrorTracker.WriteErrorLog("StartDefragmentation.cs", "StopCleanup()", "", ex.Message, ex.StackTrace, "Error");
            }
        }
    }
}

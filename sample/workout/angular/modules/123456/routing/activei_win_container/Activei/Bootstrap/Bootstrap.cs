using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using NetgearGearHeadBootstrap.Tracker;

namespace NetgearGearHeadBootstrap
{
    public partial class Bootstrap : Form
    {
        public Bootstrap()
        {
            InitializeComponent();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            ErrorTracker errorTracker = new ErrorTracker();
            errorTracker.WriteLog("=================================================");
            errorTracker.WriteLog("timer1_Tick()  was invoked.");
            errorTracker.WriteLog("=================================================");
            errorTracker.WriteLog("Going to exit the Application.");
            Application.Exit();
            errorTracker.WriteLog("Application Exited.");
            errorTracker = null;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            ErrorTracker errorTracker = new ErrorTracker();
            errorTracker.WriteLog("=================================================");
            errorTracker.WriteLog("Bootstrap.Form1_Load() method was invoked.");
            errorTracker.WriteLog("=================================================");
            errorTracker.WriteLog("timer1 was started.....");
            errorTracker = null;
            timer1.Start();
        }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Diagnostics;

namespace CustomizedClickOnce.Common
{
    public partial class RouterMessageBox : Form
    {
        public const string clientName = "ACTIVEI";
        public RouterMessageBox()
        {
            InitializeComponent();
            InitializePanels();
        }

        public enum ModuleEnum
        {
            Router = 1,
            RemoteSupport = 2,
            Uninstall = 3,
            None
        }

        private void InitializePanels()
        {
            try
            {
                uxMessageBoxHeaderLabel.Text = Properties.Resources.ClientName;
                pnlHeader.BackColor = uxMessageBoxHeaderLabel.BackColor = (Properties.Resources.ClientName.ToUpper() == clientName) ? Color.FromArgb(232, 128, 85) : Color.FromArgb(111, 44, 141);
                pnlBody.BackColor = uxDescriptionlabel.BackColor = uxStatusPictureBox.BackColor = Color.FromArgb(73, 72, 73);
                //this.Width = ((Screen.PrimaryScreen.WorkingArea.Width / 4) * 3);
                //this.Height = ((Screen.PrimaryScreen.WorkingArea.Height / 3));
                //uxContainerNGPanel.Width = this.Width + 100;
                //uxOkNGPanel.Location = new Point(this.Width - uxOkNGPanel.Width - 10, uxOkNGPanel.Location.Y);
                //uxOKCancelNGPanel.Location = new Point(this.Width - uxOKCancelNGPanel.Width - 10, uxOKCancelNGPanel.Location.Y);
                //uxYesNoNGPanel.Location = new Point(this.Width - uxYesNoNGPanel.Width - 10, uxYesNoNGPanel.Location.Y);
                //uxDescriptionlabel.Width = this.Width - 160;
                //uxDescriptionlabel.Location = new Point(uxStatusPictureBox.Width + 50, uxDescriptionlabel.Location.Y);
            }
            catch (Exception) { }
        }

        private static RouterMessageBox instance;

        public static RouterMessageBox Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new RouterMessageBox();
                }
                return instance;
            }
        }

        DialogResult returnValue = System.Windows.Forms.DialogResult.Cancel;

        public DialogResult Show(string text, string caption, MessageBoxButtons buttons, MessageBoxIcon icon, string OkMsg = null, string YesMsg = null, string NoMsg = null)
        {
            try
            {
                uxDescriptionlabel.Text = text;

                switch (icon)
                {
                    case MessageBoxIcon.Error:
                        uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.error;
                        break;
                    case MessageBoxIcon.Exclamation:
                        uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.Exclamation;
                        break;
                    case MessageBoxIcon.Information:
                        uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.information;
                        break;
                    case MessageBoxIcon.None:
                        break;
                    case MessageBoxIcon.Question:
                        uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.question;
                        break;
                    default:
                        break;
                }

                switch (buttons)
                {
                    case MessageBoxButtons.AbortRetryIgnore:
                        break;
                    case MessageBoxButtons.OK:
                        uxOkButton.Text = string.IsNullOrEmpty(OkMsg) ? uxOkButton.Text : OkMsg;
                        this.AcceptButton = uxOkOnlyButton;
                        uxOkNGPanel.Visible = true;
                        uxOKCancelNGPanel.Visible = false;
                        uxYesNoNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.OKCancel:
                        uxOkButton.Text = string.IsNullOrEmpty(OkMsg) ? uxOkButton.Text : OkMsg;
                        this.AcceptButton = uxOkButton;
                        uxOKCancelNGPanel.Visible = true;
                        uxOkNGPanel.Visible = false;
                        uxYesNoNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.RetryCancel:
                        break;
                    case MessageBoxButtons.YesNo:
                        uxYesButton.Text = string.IsNullOrEmpty(YesMsg) ? uxYesButton.Text : YesMsg;
                        uxNoButton.Text = string.IsNullOrEmpty(NoMsg) ? uxNoButton.Text : NoMsg;
                        this.AcceptButton = uxYesButton;
                        uxYesNoNGPanel.Visible = true;
                        uxOKCancelNGPanel.Visible = false;
                        uxOkNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.YesNoCancel:
                        uxYesButton.Text = string.IsNullOrEmpty(YesMsg) ? uxYesButton.Text : YesMsg;
                        uxNoButton.Text = string.IsNullOrEmpty(NoMsg) ? uxNoButton.Text : NoMsg;
                        break;
                    default:
                        break;
                }

                this.ShowDialog();
            }
            catch (Exception ex) { throw ex; }

            return returnValue;
        }

        public DialogResult Show(string text, string caption, MessageBoxButtons buttons, MessageBoxIcon icon, ModuleEnum moduleEnum, string OkMsg = null, string YesMsg = null, string NoMsg = null)
        {
            try
            {
                uxDescriptionlabel.Text = text;
                switch (moduleEnum)
                {
                    case ModuleEnum.Router:
                        uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.RouterConfigBackup;
                        break;
                    case ModuleEnum.RemoteSupport:
                        uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.RemoteSupport;
                        break;
                    case ModuleEnum.Uninstall:
                        uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.close;
                        break;
                    case ModuleEnum.None:
                        {
                            switch (icon)
                            {
                                case MessageBoxIcon.Error:
                                    uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.error;
                                    break;
                                case MessageBoxIcon.Exclamation:
                                    uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.Exclamation;
                                    break;
                                case MessageBoxIcon.Information:
                                    uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.information;
                                    break;
                                case MessageBoxIcon.None:
                                    break;
                                case MessageBoxIcon.Question:
                                    uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.question;
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    default:
                        break;
                }

                switch (buttons)
                {
                    case MessageBoxButtons.AbortRetryIgnore:
                        break;
                    case MessageBoxButtons.OK:
                        uxOkButton.Text = string.IsNullOrEmpty(OkMsg) ? uxOkButton.Text : OkMsg;
                        this.AcceptButton = uxOkOnlyButton;
                        uxOkNGPanel.Visible = true;
                        uxOKCancelNGPanel.Visible = false;
                        uxYesNoNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.OKCancel:
                        uxOkButton.Text = string.IsNullOrEmpty(OkMsg) ? uxOkButton.Text : OkMsg;
                        this.AcceptButton = uxOkButton;
                        uxOKCancelNGPanel.Visible = true;
                        uxOkNGPanel.Visible = false;
                        uxYesNoNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.RetryCancel:
                        break;
                    case MessageBoxButtons.YesNo:
                        uxYesButton.Text = string.IsNullOrEmpty(YesMsg) ? uxYesButton.Text : YesMsg;
                        uxNoButton.Text = string.IsNullOrEmpty(NoMsg) ? uxNoButton.Text : NoMsg;
                        this.AcceptButton = uxYesButton;
                        uxYesNoNGPanel.Visible = true;
                        uxOKCancelNGPanel.Visible = false;
                        uxOkNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.YesNoCancel:
                        uxYesButton.Text = string.IsNullOrEmpty(YesMsg) ? uxYesButton.Text : YesMsg;
                        uxNoButton.Text = string.IsNullOrEmpty(NoMsg) ? uxNoButton.Text : NoMsg;
                        break;
                    default:
                        break;
                }

                this.ShowDialog();
            }
            catch (Exception) { }

            return returnValue;
        }

        public DialogResult Show(string text, string caption, MessageBoxButtons buttons, string OkMsg = null, string YesMsg = null, string NoMsg = null, bool isWanimg = false, bool isShowClose = false)
        {
            try
            {
                uxDescriptionlabel.Text = text;                
                uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.information;
                uxMessageBoxHeaderLabel.Text = caption;
                btnClose.Visible = isShowClose;
                switch (buttons)
                {
                    case MessageBoxButtons.AbortRetryIgnore:
                        break;
                    case MessageBoxButtons.OK:
                        pxLan.Visible = false;
                        uxOkOnlyButton.Text = string.IsNullOrEmpty(OkMsg) ? "Ok" : OkMsg;
                        this.AcceptButton = uxOkOnlyButton;
                        uxOkNGPanel.Visible = true;
                        uxOKCancelNGPanel.Visible = false;
                        uxYesNoNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.OKCancel:
                        uxOkButton.Text = string.IsNullOrEmpty(OkMsg) ? "Ok" : OkMsg;
                        this.AcceptButton = uxOkButton;
                        uxOKCancelNGPanel.Visible = true;
                        uxOkNGPanel.Visible = false;
                        uxYesNoNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.RetryCancel:
                        break;
                    case MessageBoxButtons.YesNo:
                        //uxYesNoNGPanel.AutoSize = true;
                        //uxYesButton.AutoSize = true;
                        //uxNoButton.AutoSize = true;
                        //uxYesButton.MaximumSize = new Size(150, 50);
                        //uxNoButton.MaximumSize = new Size(150, 50);
                        if (isWanimg)
                        {
                            pxLan.Visible = true;
                        }
                        else
                        {
                            pxLan.Visible = false;
                        }
                        uxYesButton.Text = string.IsNullOrEmpty(YesMsg) ? "Yes" : YesMsg;
                        uxNoButton.Text = string.IsNullOrEmpty(NoMsg) ? "No" : NoMsg;
                        this.AcceptButton = uxYesButton;
                        uxYesNoNGPanel.Visible = true;
                        uxOKCancelNGPanel.Visible = false;
                        uxOkNGPanel.Visible = false;
                        break;
                    case MessageBoxButtons.YesNoCancel:
                        uxYesButton.Text = string.IsNullOrEmpty(YesMsg) ? "Yes" : YesMsg;
                        uxNoButton.Text = string.IsNullOrEmpty(NoMsg) ? "No" : NoMsg;
                        break;
                    default:
                        break;
                }

                this.ShowDialog();

            }
            catch (Exception ex)
            {
                throw ex;
            }

            return returnValue;
        }

        public DialogResult Show(string text, string caption, int waitSeconds, string OkMsg = null)
        {
            try
            {
                btnClose.Visible = false;
                //    Timer ssw = new Timer();
                //    ssw.Interval = 1000;
                //    ssw.Tick += new EventHandler(tmrPowerCycle_Tick);
                tmrReset.Start();
                // Timer tmr = new Timer();
                tmrcount = waitSeconds;
                uxDescriptionlabel.Text = text;
                uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.information;
                uxMessageBoxHeaderLabel.Text = caption;

                //uxOkButton.Text = string.IsNullOrEmpty(OkMsg) ? "Ok" : OkMsg;
                //this.AcceptButton = uxOkOnlyButton;
                uxOkNGPanel.Visible = true;
                uxOKCancelNGPanel.Visible = false;
                uxYesNoNGPanel.Visible = false;
                uxOkOnlyButton.Enabled = false;
                uxOkOnlyButton.BackColor = Color.White;

                //uxOkOnlyButton.Text = "Approximately wait time " + ssw.Elapsed.Seconds.ToString() + " seconds...";
                this.ShowDialog();
                //while (true)
                //{
                //    if (ssw.ElapsedMilliseconds > 5000)
                //    {
                //        this.Close();
                //    }
                //    else
                //    {
                //        uxOkOnlyButton.Text = "Approximately wait time " + ssw.Elapsed.Seconds.ToString() + " seconds...";
                //    }
                //}                

            }
            catch (Exception ex)
            {
                throw ex;
            }

            return returnValue;
        }

        private void uxYesButton_Click(object sender, EventArgs e)
        {
            returnValue = System.Windows.Forms.DialogResult.Yes;
            this.Close();
        }

        private void uxNoButton_Click(object sender, EventArgs e)
        {
            returnValue = System.Windows.Forms.DialogResult.No;
            this.Close();
        }

        private void uxOkOnlybutton_Click(object sender, EventArgs e)
        {
            returnValue = System.Windows.Forms.DialogResult.OK;
            this.Close();
        }

        private void uxOkButton_Click(object sender, EventArgs e)
        {
            returnValue = System.Windows.Forms.DialogResult.OK;
            this.Close();
        }

        private void uxCancelButton_Click(object sender, EventArgs e)
        {
            returnValue = System.Windows.Forms.DialogResult.Cancel;
            this.Close();
        }

        // RouterMessageBox msgTimer;
        int tmrcount = 0;
        private void tmrPowerCycle_Tick(object sender, EventArgs e)
        {
            tmrcount--;

            uxOkOnlyButton.Text = "Approximate wait time " + tmrcount.ToString() + " seconds...";
            if (tmrcount == 0)
            {
                tmrReset.Stop();
                this.Close();
                uxOkOnlyButton.Text = "Ok";
                uxOkOnlyButton.Enabled = true;
                uxOkOnlyButton.BackColor = Color.FromArgb(98, 93, 99);
            }
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}

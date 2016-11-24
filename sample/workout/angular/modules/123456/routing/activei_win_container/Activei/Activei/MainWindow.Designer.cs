namespace Activei
{
    partial class MainWindow
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainWindow));
            this.uxWebBrowserPannel = new System.Windows.Forms.Panel();
            this.pnlLoading = new System.Windows.Forms.Panel();
            this.tblloading = new System.Windows.Forms.TableLayoutPanel();
            this.pnlinside = new System.Windows.Forms.Panel();
            this.picboxload = new System.Windows.Forms.PictureBox();
            this.lblloading = new System.Windows.Forms.Label();
            this.openFileDialogFirewall = new System.Windows.Forms.OpenFileDialog();
            this.dbmTimmer = new System.Windows.Forms.Timer(this.components);
            this.openFolderDialogAntivirus = new System.Windows.Forms.FolderBrowserDialog();
            this.logTimer = new System.Windows.Forms.Timer(this.components);
            this.uxWebBrowserPannel.SuspendLayout();
            this.pnlLoading.SuspendLayout();
            this.tblloading.SuspendLayout();
            this.pnlinside.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picboxload)).BeginInit();
            this.SuspendLayout();
            // 
            // uxWebBrowserPannel
            // 
            this.uxWebBrowserPannel.BackColor = System.Drawing.Color.Transparent;
            this.uxWebBrowserPannel.Controls.Add(this.pnlLoading);
            this.uxWebBrowserPannel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.uxWebBrowserPannel.Location = new System.Drawing.Point(0, 0);
            this.uxWebBrowserPannel.Name = "uxWebBrowserPannel";
            this.uxWebBrowserPannel.Size = new System.Drawing.Size(284, 261);
            this.uxWebBrowserPannel.TabIndex = 0;
            // 
            // pnlLoading
            // 
            this.pnlLoading.BackColor = System.Drawing.Color.Transparent;
            this.pnlLoading.Controls.Add(this.tblloading);
            this.pnlLoading.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlLoading.Location = new System.Drawing.Point(0, 0);
            this.pnlLoading.Name = "pnlLoading";
            this.pnlLoading.Size = new System.Drawing.Size(284, 261);
            this.pnlLoading.TabIndex = 1;
            // 
            // tblloading
            // 
            this.tblloading.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.tblloading.BackColor = System.Drawing.Color.Transparent;
            this.tblloading.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.tblloading.ColumnCount = 3;
            this.tblloading.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 31F));
            this.tblloading.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tblloading.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 19F));
            this.tblloading.Controls.Add(this.pnlinside, 1, 1);
            this.tblloading.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tblloading.Location = new System.Drawing.Point(0, 0);
            this.tblloading.Name = "tblloading";
            this.tblloading.RowCount = 3;
            this.tblloading.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 40F));
            this.tblloading.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 40F));
            this.tblloading.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 20F));
            this.tblloading.Size = new System.Drawing.Size(284, 261);
            this.tblloading.TabIndex = 2;
            // 
            // pnlinside
            // 
            this.pnlinside.Controls.Add(this.picboxload);
            this.pnlinside.Controls.Add(this.lblloading);
            this.pnlinside.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlinside.Location = new System.Drawing.Point(91, 107);
            this.pnlinside.Name = "pnlinside";
            this.pnlinside.Size = new System.Drawing.Size(136, 98);
            this.pnlinside.TabIndex = 0;
            // 
            // picboxload
            // 
            this.picboxload.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.picboxload.Location = new System.Drawing.Point(274, 26);
            this.picboxload.Name = "picboxload";
            this.picboxload.Size = new System.Drawing.Size(50, 72);
            this.picboxload.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picboxload.TabIndex = 0;
            this.picboxload.TabStop = false;
            // 
            // lblloading
            // 
            this.lblloading.Font = new System.Drawing.Font("Microsoft Sans Serif", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblloading.Location = new System.Drawing.Point(3, 97);
            this.lblloading.Name = "lblloading";
            this.lblloading.Size = new System.Drawing.Size(606, 36);
            this.lblloading.TabIndex = 1;
            this.lblloading.Text = "Your Intelligent && Intuitive Support Platform is Initializing...";
            // 
            // openFileDialogFirewall
            // 
            this.openFileDialogFirewall.FileName = "openFileDialogFirewall";
            // 
            // dbmTimmer
            // 
            this.dbmTimmer.Interval = 10000;
            this.dbmTimmer.Tick += new System.EventHandler(this.dbmTimmer_Tick);
            // 
            // logTimer
            // 
            this.logTimer.Interval = 5000;
            this.logTimer.Tick += new System.EventHandler(this.logTimer_Tick);
            // 
            // MainWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 261);
            this.ControlBox = false;
            this.Controls.Add(this.uxWebBrowserPannel);
            this.DoubleBuffered = true;
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "MainWindow";
            this.Text = "Activei";
            this.Load += new System.EventHandler(this.MainWindow_Load);
            this.uxWebBrowserPannel.ResumeLayout(false);
            this.pnlLoading.ResumeLayout(false);
            this.tblloading.ResumeLayout(false);
            this.pnlinside.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.picboxload)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel uxWebBrowserPannel;
        private System.Windows.Forms.OpenFileDialog openFileDialogFirewall;
        private System.Windows.Forms.PictureBox picboxload;
        private System.Windows.Forms.Panel pnlLoading;
        private System.Windows.Forms.Label lblloading;
        private System.Windows.Forms.TableLayoutPanel tblloading;
        private System.Windows.Forms.Panel pnlinside;
        private System.Windows.Forms.Timer dbmTimmer;
        private System.Windows.Forms.FolderBrowserDialog openFolderDialogAntivirus;
        private System.Windows.Forms.Timer logTimer;
    }
}


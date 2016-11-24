﻿namespace CustomizedClickOnce.Common
{
    partial class GearHeadMessageBox
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
            this.uxContainerNGPanel = new CustomizedClickOnce.Common.NGPanel();
            this.uxMessageBoxHeaderLabel = new System.Windows.Forms.Label();
            this.pnlHeader = new System.Windows.Forms.Panel();
            this.uxStatusPictureBox = new System.Windows.Forms.PictureBox();
            this.pnlBody = new System.Windows.Forms.Panel();
            this.uxYesNoNGPanel = new System.Windows.Forms.FlowLayoutPanel();
            this.uxYesButton = new System.Windows.Forms.Button();
            this.uxNoButton = new System.Windows.Forms.Button();
            this.uxDescriptionlabel = new System.Windows.Forms.Label();
            this.uxOKCancelNGPanel = new CustomizedClickOnce.Common.NGPanel();
            this.uxCancelButton = new System.Windows.Forms.Button();
            this.uxOkButton = new System.Windows.Forms.Button();
            this.uxOkNGPanel = new CustomizedClickOnce.Common.NGPanel();
            this.uxOkOnlyButton = new System.Windows.Forms.Button();
            this.uxContainerNGPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.uxStatusPictureBox)).BeginInit();
            this.pnlBody.SuspendLayout();
            this.uxYesNoNGPanel.SuspendLayout();
            this.uxOKCancelNGPanel.SuspendLayout();
            this.uxOkNGPanel.SuspendLayout();
            this.SuspendLayout();
            // 
            // uxContainerNGPanel
            // 
            this.uxContainerNGPanel.AutoSize = true;
            this.uxContainerNGPanel.BackColor = System.Drawing.Color.Transparent;
            this.uxContainerNGPanel.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.uxContainerNGPanel.Controls.Add(this.uxMessageBoxHeaderLabel);
            this.uxContainerNGPanel.Controls.Add(this.pnlHeader);
            this.uxContainerNGPanel.Controls.Add(this.uxStatusPictureBox);
            this.uxContainerNGPanel.Controls.Add(this.pnlBody);
            this.uxContainerNGPanel.Location = new System.Drawing.Point(-9, 0);
            this.uxContainerNGPanel.Name = "uxContainerNGPanel";
            this.uxContainerNGPanel.Size = new System.Drawing.Size(1248, 550);
            this.uxContainerNGPanel.TabIndex = 0;
            // 
            // uxMessageBoxHeaderLabel
            // 
            this.uxMessageBoxHeaderLabel.AutoSize = true;
            this.uxMessageBoxHeaderLabel.Font = new System.Drawing.Font("Segoe UI", 11F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.uxMessageBoxHeaderLabel.ForeColor = System.Drawing.Color.White;
            this.uxMessageBoxHeaderLabel.Location = new System.Drawing.Point(12, 9);
            this.uxMessageBoxHeaderLabel.Name = "uxMessageBoxHeaderLabel";
            this.uxMessageBoxHeaderLabel.Size = new System.Drawing.Size(60, 20);
            this.uxMessageBoxHeaderLabel.TabIndex = 90;
            this.uxMessageBoxHeaderLabel.Text = "Active-I";
            // 
            // pnlHeader
            // 
            this.pnlHeader.Location = new System.Drawing.Point(11, 1);
            this.pnlHeader.Name = "pnlHeader";
            this.pnlHeader.Size = new System.Drawing.Size(716, 33);
            this.pnlHeader.TabIndex = 100;
            // 
            // uxStatusPictureBox
            // 
            this.uxStatusPictureBox.Image = global::CustomizedClickOnce.Common.Properties.Resources.information;
            this.uxStatusPictureBox.Location = new System.Drawing.Point(26, 44);
            this.uxStatusPictureBox.Name = "uxStatusPictureBox";
            this.uxStatusPictureBox.Size = new System.Drawing.Size(100, 107);
            this.uxStatusPictureBox.TabIndex = 99;
            this.uxStatusPictureBox.TabStop = false;
            // 
            // pnlBody
            // 
            this.pnlBody.Controls.Add(this.uxYesNoNGPanel);
            this.pnlBody.Controls.Add(this.uxDescriptionlabel);
            this.pnlBody.Controls.Add(this.uxOKCancelNGPanel);
            this.pnlBody.Controls.Add(this.uxOkNGPanel);
            this.pnlBody.Location = new System.Drawing.Point(11, 35);
            this.pnlBody.Name = "pnlBody";
            this.pnlBody.Size = new System.Drawing.Size(716, 156);
            this.pnlBody.TabIndex = 101;
            // 
            // uxYesNoNGPanel
            // 
            this.uxYesNoNGPanel.Controls.Add(this.uxNoButton);
            this.uxYesNoNGPanel.Controls.Add(this.uxYesButton);
            this.uxYesNoNGPanel.FlowDirection = System.Windows.Forms.FlowDirection.RightToLeft;
            this.uxYesNoNGPanel.Location = new System.Drawing.Point(121, 97);
            this.uxYesNoNGPanel.Name = "uxYesNoNGPanel";
            this.uxYesNoNGPanel.Size = new System.Drawing.Size(545, 50);
            this.uxYesNoNGPanel.TabIndex = 99;
            this.uxYesNoNGPanel.Visible = false;
            // 
            // uxYesButton
            // 
            this.uxYesButton.AutoSize = true;
            this.uxYesButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(98)))), ((int)(((byte)(93)))), ((int)(((byte)(99)))));
            this.uxYesButton.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.uxYesButton.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.uxYesButton.ForeColor = System.Drawing.Color.White;
            this.uxYesButton.Location = new System.Drawing.Point(344, 3);
            this.uxYesButton.Name = "uxYesButton";
            this.uxYesButton.Size = new System.Drawing.Size(96, 32);
            this.uxYesButton.TabIndex = 6;
            this.uxYesButton.Text = "Yes";
            this.uxYesButton.UseVisualStyleBackColor = false;
            this.uxYesButton.Click += new System.EventHandler(this.uxYesButton_Click);
            // 
            // uxNoButton
            // 
            this.uxNoButton.Anchor = System.Windows.Forms.AnchorStyles.Right;
            this.uxNoButton.AutoSize = true;
            this.uxNoButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(98)))), ((int)(((byte)(93)))), ((int)(((byte)(99)))));
            this.uxNoButton.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.uxNoButton.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.uxNoButton.ForeColor = System.Drawing.Color.White;
            this.uxNoButton.Location = new System.Drawing.Point(446, 3);
            this.uxNoButton.Name = "uxNoButton";
            this.uxNoButton.Size = new System.Drawing.Size(96, 32);
            this.uxNoButton.TabIndex = 7;
            this.uxNoButton.Text = "No";
            this.uxNoButton.UseVisualStyleBackColor = false;
            this.uxNoButton.Click += new System.EventHandler(this.uxNoButton_Click);
            // 
            // uxDescriptionlabel
            // 
            this.uxDescriptionlabel.Font = new System.Drawing.Font("Segoe UI Semibold", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.uxDescriptionlabel.ForeColor = System.Drawing.Color.White;
            this.uxDescriptionlabel.Location = new System.Drawing.Point(144, 18);
            this.uxDescriptionlabel.Name = "uxDescriptionlabel";
            this.uxDescriptionlabel.Size = new System.Drawing.Size(517, 54);
            this.uxDescriptionlabel.TabIndex = 96;
            this.uxDescriptionlabel.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // uxOKCancelNGPanel
            // 
            this.uxOKCancelNGPanel.Controls.Add(this.uxCancelButton);
            this.uxOKCancelNGPanel.Controls.Add(this.uxOkButton);
            this.uxOKCancelNGPanel.Location = new System.Drawing.Point(346, 97);
            this.uxOKCancelNGPanel.Name = "uxOKCancelNGPanel";
            this.uxOKCancelNGPanel.Size = new System.Drawing.Size(338, 50);
            this.uxOKCancelNGPanel.TabIndex = 97;
            this.uxOKCancelNGPanel.Visible = false;
            // 
            // uxCancelButton
            // 
            this.uxCancelButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(98)))), ((int)(((byte)(93)))), ((int)(((byte)(99)))));
            this.uxCancelButton.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.uxCancelButton.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.uxCancelButton.ForeColor = System.Drawing.Color.White;
            this.uxCancelButton.Location = new System.Drawing.Point(239, 9);
            this.uxCancelButton.Name = "uxCancelButton";
            this.uxCancelButton.Size = new System.Drawing.Size(96, 32);
            this.uxCancelButton.TabIndex = 5;
            this.uxCancelButton.Text = "Cancel";
            this.uxCancelButton.UseVisualStyleBackColor = false;
            this.uxCancelButton.Click += new System.EventHandler(this.uxCancelButton_Click);
            // 
            // uxOkButton
            // 
            this.uxOkButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(98)))), ((int)(((byte)(93)))), ((int)(((byte)(99)))));
            this.uxOkButton.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.uxOkButton.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.uxOkButton.ForeColor = System.Drawing.Color.White;
            this.uxOkButton.Location = new System.Drawing.Point(137, 9);
            this.uxOkButton.Name = "uxOkButton";
            this.uxOkButton.Size = new System.Drawing.Size(96, 32);
            this.uxOkButton.TabIndex = 4;
            this.uxOkButton.Text = "OK";
            this.uxOkButton.UseVisualStyleBackColor = false;
            this.uxOkButton.Click += new System.EventHandler(this.uxOkButton_Click);
            // 
            // uxOkNGPanel
            // 
            this.uxOkNGPanel.Controls.Add(this.uxOkOnlyButton);
            this.uxOkNGPanel.Location = new System.Drawing.Point(346, 94);
            this.uxOkNGPanel.Name = "uxOkNGPanel";
            this.uxOkNGPanel.Size = new System.Drawing.Size(338, 50);
            this.uxOkNGPanel.TabIndex = 98;
            this.uxOkNGPanel.Visible = false;
            // 
            // uxOkOnlyButton
            // 
            this.uxOkOnlyButton.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(98)))), ((int)(((byte)(93)))), ((int)(((byte)(99)))));
            this.uxOkOnlyButton.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.uxOkOnlyButton.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.uxOkOnlyButton.ForeColor = System.Drawing.Color.White;
            this.uxOkOnlyButton.Location = new System.Drawing.Point(239, 9);
            this.uxOkOnlyButton.Name = "uxOkOnlyButton";
            this.uxOkOnlyButton.Size = new System.Drawing.Size(96, 32);
            this.uxOkOnlyButton.TabIndex = 4;
            this.uxOkOnlyButton.Text = "OK";
            this.uxOkOnlyButton.UseVisualStyleBackColor = false;
            this.uxOkOnlyButton.Click += new System.EventHandler(this.uxOkOnlybutton_Click);
            // 
            // GearHeadMessageBox
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(719, 193);
            this.Controls.Add(this.uxContainerNGPanel);
            this.DoubleBuffered = true;
            this.Font = new System.Drawing.Font("Segoe UI", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "GearHeadMessageBox";
            this.Opacity = 0.95D;
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "GearHeadMessageBox";
            this.uxContainerNGPanel.ResumeLayout(false);
            this.uxContainerNGPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.uxStatusPictureBox)).EndInit();
            this.pnlBody.ResumeLayout(false);
            this.uxYesNoNGPanel.ResumeLayout(false);
            this.uxYesNoNGPanel.PerformLayout();
            this.uxOKCancelNGPanel.ResumeLayout(false);
            this.uxOkNGPanel.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private NGPanel uxContainerNGPanel;
        private System.Windows.Forms.Label uxMessageBoxHeaderLabel;
        private NGPanel uxOKCancelNGPanel;
        private System.Windows.Forms.Label uxDescriptionlabel;
        private NGPanel uxOkNGPanel;
        private System.Windows.Forms.Button uxOkOnlyButton;
        private System.Windows.Forms.Button uxCancelButton;
        private System.Windows.Forms.Button uxOkButton;
        private System.Windows.Forms.PictureBox uxStatusPictureBox;
        private System.Windows.Forms.Panel pnlHeader;
        private System.Windows.Forms.Panel pnlBody;
        private System.Windows.Forms.FlowLayoutPanel uxYesNoNGPanel;
        private System.Windows.Forms.Button uxNoButton;
        private System.Windows.Forms.Button uxYesButton;
    }
}
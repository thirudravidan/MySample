using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace CustomizedClickOnce.Common
{
    public class NGPanel : System.Windows.Forms.Panel
    {
        public NGPanel()
        {
            this.SetStyle(
                System.Windows.Forms.ControlStyles.UserPaint | 
                System.Windows.Forms.ControlStyles.AllPaintingInWmPaint | 
                System.Windows.Forms.ControlStyles.OptimizedDoubleBuffer, 
                true);
            this.SetStyle(ControlStyles.ResizeRedraw, true);

            DoubleBuffered = true;
        }
    }
}

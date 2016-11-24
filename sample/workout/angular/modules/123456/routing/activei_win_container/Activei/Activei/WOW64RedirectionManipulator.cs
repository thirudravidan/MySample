using System;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;

namespace Activei
{
    public class WOW64RedirectionManipulator
    {
        public static bool DisableWOW64Redirection()
        {
            try
            {
                ////LogMessage.WriteErrorInfo("WOW64RedirectionManipulator.cs : DisableWOW64Redirection() :: Going to disable WOWRedirection");
                IntPtr ptr = new IntPtr();
                bool isWow64FsRedirectionDisabled = Wow64DisableWow64FsRedirection(ref ptr);
                ////LogMessage.WriteErrorInfo("WOW64RedirectionManipulator.cs : DisableWOW64Redirection() :: Is WOWRedirection Disabled : " + isWow64FsRedirectionDisabled);

                return isWow64FsRedirectionDisabled;
            }
            catch (Exception)
            {
                ////LogMessage.WriteErrorInfo("WOW64RedirectionManipulator.cs : DisableWOW64Redirection() :: " + ex.Message);
                return false;
            }
        }

        public static bool RevertWOW64Redirection()
        {
            try
            {
                IntPtr ptr = new IntPtr();
                bool isWow64FsRedirectionReverted = Wow64RevertWow64FsRedirection(ptr);
                return isWow64FsRedirectionReverted;
            }
            catch (Exception)
            {
                ////LogMessage.WriteErrorInfo("WOW64RedirectionManipulator.cs : RevertWOW64Redirection() :: " + ex.Message);
                return false;
            }
        }


        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool Wow64DisableWow64FsRedirection(ref IntPtr ptr);

        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool Wow64RevertWow64FsRedirection(IntPtr ptr);
    }
}

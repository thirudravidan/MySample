using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;

namespace Activei
{
    static class NetworkAlive
    {
        [DllImport("sensapi.dll")]
        static extern bool IsNetworkAlive(out int flags);
        public static bool GetEtherNetStatus()
        {
            int flags;
            return IsNetworkAlive(out flags);
        }
    }
}

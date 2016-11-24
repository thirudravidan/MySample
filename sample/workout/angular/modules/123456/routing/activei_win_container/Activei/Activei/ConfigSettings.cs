using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace Activei
{
    public static class ConfigSettings
    {
        /// <summary>
        /// Get the Client Name
        /// </summary>
        public static string ClientName
        {
            get { return ConfigurationManager.AppSettings["ClientName"]; }
        }

        public static string GetCurrentVersion { get; set; }
        
    }
}

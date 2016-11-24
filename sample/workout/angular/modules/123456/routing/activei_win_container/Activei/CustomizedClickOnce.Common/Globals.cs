using System.Configuration;
using CustomizedClickOnce.Common;
namespace CustomizedClickOnce.Common
{

    //These parameters should be read from some config in real applciation
    //Here they're just hard coded
    public class Globals
    {
        public static string PublisherName
        {
            get { return Properties.Resources.ClientName; }
        }

        public static string ProductName
        {
            get { return Properties.Resources.ClientName; }
        }

        public static string Host
        {
            get { return "http://localhost/"; }
        }

        public static string HelpLink
        {
            get { return "http://localhost/help"; }
        }

        public static string AboutLink
        {
            get { return "http://localhost/about"; }
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace Activei.RouterManager
{
    public class Gateway
    {
        string soapURL = string.Empty;
        SoapAction soapAction = SoapAction.NO_ACTION;
        XmlDocument soapString = new XmlDocument();

        public string SoapURL
        {
            get { return soapURL; }
            set { soapURL = value; }
        }

        public XmlDocument SoapString
        {
            get { return soapString; }
            set { soapString = value; }
        }


        internal SoapAction SoapAction
        {
            get { return soapAction; }
            set { soapAction = value; }
        }

        public Gateway()
        {
        }

        public Gateway(string _soapURL)
        {
            this.soapURL = _soapURL;
        }

        public XmlDocument DoAction(SoapAction _soapAction)
        {
            this.soapAction = _soapAction;
            string _xmlResponse = Common.GetRouterSoapResponse(this);
            XmlDocument xmlResponse = new XmlDocument();
            xmlResponse.LoadXml(_xmlResponse);
            return xmlResponse;
        }

    }
}

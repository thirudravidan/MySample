using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Xml;
using System.IO;

namespace Activei.RouterManager
{

    public static class Common
    {

        /// <summary>
        /// Functionality to post web soap request and get response
        /// </summary>
        /// <param name="doc"></param>
        /// <param name="soapAction"></param>
        /// <returns></returns>
        public static string GetRouterSoapResponse(Gateway gw)
        {
            try
            {
                HttpWebRequest requestau = (HttpWebRequest)WebRequest.Create(gw.SoapURL);
                // add the headers
                // the SOAPACtion determines what action the web service should use
                // YOU MUST KNOW THIS and SET IT HERE
                requestau.Headers.Add("SOAPAction", gw.SoapAction.ToString());

                // set the request type
                // we user utf-8 but set the content type here
                requestau.ContentType = "text/xml;charset=\"utf-8\"";
                requestau.Accept = "text/xml";
                requestau.Method = "POST";

                // add our body to the request
                Stream streamau = requestau.GetRequestStream();
                streamau.Close();
                string strRes = string.Empty;

                // get the response back
                using (HttpWebResponse response = (HttpWebResponse)requestau.GetResponse())
                {
                    // do something with the response here
                    Stream responsedata = response.GetResponseStream();
                    StreamReader responsereader = new StreamReader(responsedata);
                    strRes = responsereader.ReadToEnd();
                }//end using
                return strRes;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    public enum SoapAction
    {
        NO_ACTION = 1,
        GET_ROUTER_CONFIG = 2,
        SET_ROUTER_CONFIG = 3
    }
}

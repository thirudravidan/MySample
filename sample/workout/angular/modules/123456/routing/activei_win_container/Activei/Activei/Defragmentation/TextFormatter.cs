using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace TextFormatterLibrary
{
    public class TextFormatter
    {
        const string FONT_START = "<Font face=\"Arial\" size=\"2\">";
        const string UNDERLINE_START = "<u>";
        const string UNDERLINE_END = "</u>";
        const string FONT_END = "</Font>";
        const string LINEBREAK = "<br>";
        const string BOLD_START = "<b>";
        const string BOLD_END = "</b>";
        const string TABLE_START = "<Table>";
        const string TABLE_END = "</Table>";
        const string ROW_START = "<TR>";
        const string ROW_END = "</TR>";
        const string COLUMN_END = "</TD>";
        const string SINCLE_COLUMN_START = "<TD WIDTH=\"100%\">";
        const string COLUMN_START = "<TD>";
        const string COLUMN_START_TOPALIGN = "<TD VALIGN='TOP'>";
        const string COLUMN_RIGHT_START = "<TD WIDTH=\"30%\">";
        const string COLUMN_LEFT_START = "<TD  WIDTH=\"70%\">";
        const string COLUMN_NOWRAP = "<TD NOWRAP=\"nowrap\">";
        const string FONT_GREEN = "<Font face=\"Arial\" size=\"2\" color=\"Green\">";
        const string FONT_RED = "<Font face=\"Arial\" size=\"2\" color=\"Red\">";
        const string FONT_BLACK = "<Font face=\"Arial\" size=\"2\" color=\"Black\">";
        const string NO_DEFRAGMENT = "You do not need to defragment this volume.";
        const string DEFRAGMENT = "You should defragment this volume.";
        const string HTML_BEGIN = "<HTML><BODY>";
        const string HTML_END = "</BODY></HTML>";
        const string DEFRAG_NOTOPTIMIZED = FONT_RED + "This drive is not optimized for performance." + FONT_END + LINEBREAK + LINEBREAK + FONT_BLACK + "It is necessary to defragment this drive." + FONT_END;
        const string DEFRAG_OPTIMIZED = FONT_GREEN + "This drive is optimized for performance." + FONT_END + LINEBREAK + LINEBREAK + FONT_BLACK + "Defragmenting this drive is not currently necessary." + FONT_END;
        const string REPORT_HEADER = FONT_GREEN + "The following volume is optimized for performance." + FONT_END + LINEBREAK + LINEBREAK + FONT_BLACK + "Defragmenting this volume is not currently necessary." + FONT_END;
        
        public static string FormatText(string filePath, string reportEnd)
        {
            try
            {
                string table = TABLE_START;
                StreamReader sr = new StreamReader(filePath);
                while (!sr.EndOfStream)
                {
                    string currentLine = sr.ReadLine();
                    if (currentLine.StartsWith("Report"))
                    {
                        table += UNDERLINE_START + FONT_START + BOLD_START + currentLine + BOLD_END + FONT_END + UNDERLINE_END;
                        table += LINEBREAK;
                    }
                    else if (currentLine.Contains(NO_DEFRAGMENT))
                    {
                        table += LINEBREAK;
                        table += BOLD_START + DEFRAG_OPTIMIZED + BOLD_END;
                        table += LINEBREAK + LINEBREAK;
                        continue;
                    }
                    else if (currentLine.Contains(DEFRAGMENT))
                    {
                        table += LINEBREAK;
                        table += BOLD_START + DEFRAG_NOTOPTIMIZED + BOLD_END;
                        table += LINEBREAK + LINEBREAK;
                        continue;
                    }
                }
                string note = string.Empty;
                sr.BaseStream.Seek(0, SeekOrigin.Begin);
                while (!sr.EndOfStream)
                {
                    string currentLine = sr.ReadLine();
                    if (string.IsNullOrEmpty(currentLine)) continue;
                    if (currentLine.Contains(NO_DEFRAGMENT)) continue;
                    else if (currentLine.Contains(DEFRAGMENT)) continue;
                    else if (currentLine.Contains("Invoking")) continue;
                    else if (currentLine.Contains("The operation")) continue;

                    if (currentLine.Contains("Microsoft")) continue;
                    if (currentLine.Contains("Copyright")) continue;
                    if (currentLine.Contains("Note:"))
                    {
                        note = currentLine;
                        continue;
                    }
                    if (currentLine.Contains("="))
                    {
                        table += ROW_START + COLUMN_LEFT_START + FONT_START + currentLine.Substring(0, currentLine.IndexOf("=")) + FONT_END + COLUMN_END + COLUMN_START + " " + COLUMN_END + COLUMN_RIGHT_START + FONT_START + currentLine.Substring(currentLine.IndexOf("=") + 1) + FONT_END + COLUMN_END + ROW_END;
                    }
                    else if (currentLine.Contains(":)"))
                    {
                        table += ROW_START + FONT_START + currentLine + FONT_END + ROW_END;
                    }
                    else if (currentLine.Contains(":"))
                    {
                        table += ROW_START + COLUMN_NOWRAP + FONT_START + BOLD_START + currentLine.Substring(0, currentLine.IndexOf(":") + 1) + BOLD_END + FONT_END + COLUMN_END + COLUMN_START + COLUMN_END + COLUMN_START + FONT_START + currentLine.Substring(currentLine.IndexOf(":") + 1) + FONT_END + COLUMN_END + ROW_END;
                    }
                    else if (currentLine.Contains("Report"))
                    {
                        //table += ROW_START + COLUMN_NOWRAP + string.Empty + COLUMN_END + ROW_END + ROW_START + ROW_END;
                    }
                    else
                    {
                        table += ROW_START + COLUMN_START + BOLD_START + FONT_START + currentLine + FONT_END + BOLD_END + COLUMN_END + ROW_END;
                    }
                }
                table += TABLE_END;
                string noteTable = string.Empty;
                if (!string.IsNullOrEmpty(note) && note.Contains(":"))
                {
                    noteTable = TABLE_START + ROW_START + COLUMN_START_TOPALIGN + BOLD_START + FONT_START + note.Substring(0, note.IndexOf(":") + 1) + FONT_END + BOLD_END + COLUMN_END + COLUMN_START + COLUMN_END + COLUMN_START + COLUMN_END + COLUMN_START + FONT_START + note.Substring(note.IndexOf(":") + 1) + FONT_END + COLUMN_END + ROW_END + TABLE_END;
                }
                string reportEndTable = string.Empty;
                if (!string.IsNullOrEmpty(reportEnd))
                    reportEndTable = TABLE_START + ROW_START + SINCLE_COLUMN_START + reportEnd + COLUMN_END + ROW_END + TABLE_END;
                sr.Close();
                String returnValue = HTML_BEGIN + table + noteTable + reportEndTable + LINEBREAK + HTML_END;

                return returnValue;
            }
            catch (Exception)
            {
                //LogMessage.WriteErrorInfo("DefragmentationService.cs :: FormatText() : " + ex.Message);
                return "There was an error while we tried to process the report. Please try again later";
            }
        }
    }
}

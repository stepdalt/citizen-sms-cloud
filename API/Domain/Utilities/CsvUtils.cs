using System.Linq;
using System.Text.RegularExpressions;

namespace Domain.Utilities
{
    /// <summary>
    /// Based on http://stackoverflow.com/questions/4685705/good-csv-writer-for-c
    /// </summary>
    public static class CsvUtils
    {
        public static string PrepareCSVLine(string[] columns)
        {
            return string.Join(",", columns.Select(CsvUtils.Escape));
        }

        public static string[] ReadCSVLine(string line)
        {
            // regex: https://github.com/jgarcia77/CommonLibraries/blob/master/Common.Helpers/IO/CsvReaderHelper.cs
            var rexCsvSplitter = new Regex(@",(?=(?:[^""]*""[^""]*"")*(?![^""]*""))");
            return rexCsvSplitter.Split(line).Select(CsvUtils.Unescape).ToArray();
        }

        public static string Escape(string s)
        {
            s = s == null ? "" : s;

            if (s.Contains(QUOTE))
                s = s.Replace(QUOTE, ESCAPED_QUOTE);

            if (s.IndexOfAny(CHARACTERS_THAT_MUST_BE_QUOTED) > -1)
                s = QUOTE + s + QUOTE;

            return s;
        }

        public static string Unescape(string s)
        {
            if (s.StartsWith(QUOTE) && s.EndsWith(QUOTE))
            {
                s = s.Substring(1, s.Length - 2);

                if (s.Contains(ESCAPED_QUOTE))
                    s = s.Replace(ESCAPED_QUOTE, QUOTE);
            }

            return s;
        }

        private const string QUOTE = "\"";
        private const string ESCAPED_QUOTE = "\"\"";
        private static char[] CHARACTERS_THAT_MUST_BE_QUOTED = { ',', '"', '\n' };
    }
}

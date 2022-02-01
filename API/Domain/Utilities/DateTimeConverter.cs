using System;

namespace Domain.Utilities
{
    public static class DateTimeConverter
    {
        // this class deals with Javascript serialized dates which are strings like
        // "2017-01-01T01:30:05.000Z"

        public static DateTime JSONtoNET(string json)
        {
            var ret = DateTime.MinValue;

            if (json.Length != 24) return ret; //malformed

            try
            {
                var yearStr = json.Substring(0, 4);
                var monthStr = json.Substring(5, 2);
                var dayStr = json.Substring(8, 2);
                var hourStr = json.Substring(11, 2);
                var minStr = json.Substring(14, 2);
                var secStr = json.Substring(17, 2);

                int.TryParse(yearStr, out int year);
                int.TryParse(monthStr, out int month);
                int.TryParse(dayStr, out int day);
                int.TryParse(hourStr, out int hour);
                int.TryParse(minStr, out int min);
                int.TryParse(secStr, out int sec);

                ret = new DateTime(year, month, day, hour, min, sec);
            }
            catch
            {
                return ret;
            }

            return ret;
        }

        public static string NETtoJSON(DateTime datetime)
        {
            return datetime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        }
    }
}

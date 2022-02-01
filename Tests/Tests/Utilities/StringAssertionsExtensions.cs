using Xunit;

namespace Tests.Utilities
{
    public static class StringAssertionsExtensions
    {
        public static void ShouldNotBeEmpty(this string obj)
        {
            Assert.False(string.IsNullOrWhiteSpace(obj));
        }

        public static void ShouldBeEmpty(this string obj)
        {
            Assert.True(string.IsNullOrWhiteSpace(obj));
        }

        public static void ShouldContain(this string obj, string strFragment)
        {
            Assert.Contains(obj, strFragment);
        }

        public static void ShouldNotContain(this string obj, string strFragment)
        {
            Assert.DoesNotContain(obj, strFragment);
        }

        public static string CollapseWhiteSpace(string original)
        {
            return System.Text.RegularExpressions.Regex.Replace(original, @"\s+", " ");
        }
    }
}
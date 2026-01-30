using Xunit;
using FifoWellness.Api.Models;

namespace FifoWellness.Tests
{
    public class WellnessLogicTests
    {
        // test method
        [Fact]
        public void SleepLessThanSix_ShouldReturnAtRisk()
        {
            // 1. Arrange : 4.5 hours of sleep
            var log = new WellnessLog { SleepHours = 4.5 };

            // 2. Act : Apply wellness logic
            if (log.SleepHours < 6.0)
            {
                log.FatigueStatus = "At Risk";
            }
            else
            {
                log.FatigueStatus = "Healthy";
            }

            // 3. Assert : Verify the fatigue status
            Assert.Equal("At Risk", log.FatigueStatus);
        }
    }
}

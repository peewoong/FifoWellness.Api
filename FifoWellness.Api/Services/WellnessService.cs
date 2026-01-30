using FifoWellness.Api.Models;

namespace FifoWellness.Api.Services
{
    public class WellnessService : IWellnessService
    {
        public void EvaluateFatigueStatus(WellnessLog log)
        {
            // moved the logic
            if (log.SleepHours < 6.0)
            {
                log.FatigueStatus = "At Risk";
            }
            else 
            {
                log.FatigueStatus = "Healthy";
            }
        }
    }
}

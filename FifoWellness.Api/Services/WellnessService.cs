using FifoWellness.Api.Models;

namespace FifoWellness.Api.Services
{
    public class WellnessService : IWellnessService
    {
        public void EvaluateFatigueStatus(WellnessLog currentLog, List<WellnessLog> history)
        {
            // 1. Initial assessment based on the current day's sleep hours.
            if (currentLog.SleepHours < 6.0) currentLog.FatigueStatus = "At Risk";
            else currentLog.FatigueStatus = "Healthy";

            // 2. umulative fatigue analysis: checking the average sleep over the last 3 days.
            // Retrieve the most recent 3 logs ordered by date.
            var lastLogs = history.OrderByDescending(x => x.CreatedDate).Take(3).ToList();

            // Only perform the cumulative analysis if there is sufficient historical data.
            if (lastLogs.Count >= 2)
            {
                double totalSleep = lastLogs.Sum(x => x.SleepHours) + currentLog.SleepHours;
                double avgSleep = totalSleep / (lastLogs.Count + 1);

                // If the average sleep duration is below 6 hours, categorize as High Risk (Chronic Fatigue).
                if (avgSleep < 6.0)
                {
                    currentLog.FatigueStatus = "High Risk (Chronic Fatigue)";
                }
            }
        }
    }
}

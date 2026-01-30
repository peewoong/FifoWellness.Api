using FifoWellness.Api.Models;

namespace FifoWellness.Api.Services
{
    public interface IWellnessService
    {
        // Evaluates the fatigue status by analyzing the current log and historical data 
        void EvaluateFatigueStatus(WellnessLog currentLog, List<WellnessLog> history);
    }
}

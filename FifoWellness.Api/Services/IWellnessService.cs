using FifoWellness.Api.Models;

namespace FifoWellness.Api.Services
{
    public interface IWellnessService
    {
        void EvaluateFatigueStatus(WellnessLog log);
    }
}

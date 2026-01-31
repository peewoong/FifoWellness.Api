using System.ComponentModel.DataAnnotations;

namespace FifoWellness.Api.Models
{
    // this represents a daily health record for a FIFO worker
    public class WellnessLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string WorkerName { get; set; } = string.Empty;

        [Required]
        public string? ShiftType { get; set; } // Day or Night

        [Range(0, 24, ErrorMessage = "Sleep hours must be between 0 and 24.")]
        public double SleepHours { get; set; }

        public int CalorieIntake { get; set; }

        [Range(0, 10000)]
        public int CaloriesBurned { get; set; }

        [Range(0, 50000)]
        public int Steps { get; set; }

        // (Add) system-generated status based on wellness logic
        public string? FatigueStatus { get; set; } = "Normal";
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}

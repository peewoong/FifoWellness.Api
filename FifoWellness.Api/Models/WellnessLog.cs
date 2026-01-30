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
        public string ShiftType { get; set; } = string.Empty; // day or night
        public double SleepHours { get; set; }
        public int CalorieIntake { get; set; }

        // (Add) system-generated status based on wellness logic
        public string FatigueStatus { get; set; } = "Normal";
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}

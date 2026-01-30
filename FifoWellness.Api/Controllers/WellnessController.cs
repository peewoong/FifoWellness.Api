using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FifoWellness.Api.Models;

namespace FifoWellness.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WellnessController : ControllerBase
    {
        private readonly AppDbContext _context;
        public WellnessController(AppDbContext context)
        {
            _context = context;
        }

        // GET : api/Wellness
        // Retrieve all wellness logs from the database
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WellnessLog>>> GetWellnessLogs()
        {
            return await _context.WellnessLogs.ToListAsync();
        }

        // POST : api/Wellness
        // Create a new health log for a FIFO worker
        [HttpPost]
        public async Task<ActionResult<WellnessLog>> PostWellnessLog(WellnessLog log)
        {
            // force the creation timestamp to current UTC time
            log.CreatedDate = DateTime.UtcNow;

            // businessl logic : Categorize fatigue status based on sleep hours.
            // standard safety threshold : 6.0 hours
            if (log.SleepHours < 6.0)
            {
                log.FatigueStatus = "At Risk";
            }
            else 
            {
                log.FatigueStatus = "Healthy";
            }
            

            _context.WellnessLogs.Add(log);
            await _context.SaveChangesAsync();

            // Returns the created log with a 201 created status
            return CreatedAtAction(nameof(GetWellnessLogs), new { id = log.Id }, log);
        }
    }
}

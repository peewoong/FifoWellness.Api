using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FifoWellness.Api.Models;
using FifoWellness.Api.Services;

namespace FifoWellness.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WellnessController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWellnessService _wellnessService;
        public WellnessController(AppDbContext context, IWellnessService wellnessService)
        {
            _context = context;
            _wellnessService = wellnessService;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieve the existing wellness history for the specific worker from the database.
            var history = await _context.WellnessLogs
                .Where(w => w.WorkerName == log.WorkerName)
                .ToListAsync();

            // Process the log through the service to analyze fatigue levels based on history.
            _wellnessService.EvaluateFatigueStatus(log, history);

            // Set the creation timestamp and persist the new log to the database.
            log.CreatedDate = DateTime.UtcNow;

            if (log.SleepHours < 6)
            {
                log.FatigueStatus = "High Risk";
            }
            else
            {
                log.FatigueStatus = "Normal";
            }

            _context.WellnessLogs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(log);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWellnessLog(int id)
        {
            var log = await _context.WellnessLogs.FindAsync(id);
            if (log == null)
            {
                return NotFound();
            }

            _context.WellnessLogs.Remove(log);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

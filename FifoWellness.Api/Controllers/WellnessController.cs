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
            // force the creation timestamp to current UTC time
            log.CreatedDate = DateTime.UtcNow;

            // Delegate the logic to the service
            _wellnessService.EvaluateFatigueStatus(log);

            _context.WellnessLogs.Add(log);
            await _context.SaveChangesAsync();

            // Returns the created log with a 201 created status
            return CreatedAtAction(nameof(GetWellnessLogs), new { id = log.Id }, log);
        }
    }
}

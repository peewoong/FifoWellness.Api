using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FifoWellness.Api.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base (options){ }
        
        // create a 'WellnessLogs' table in the database
        public DbSet<WellnessLog> WellnessLogs { get; set; }
    }
}

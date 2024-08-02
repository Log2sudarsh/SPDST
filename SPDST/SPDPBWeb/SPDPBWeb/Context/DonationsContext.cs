using Microsoft.EntityFrameworkCore;
using SPDPBWeb.Models;

namespace SPDSTApi.Context
{
    public class DonationsContext : DbContext
    {
        public DonationsContext(DbContextOptions<DonationsContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Donation> Donations { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("public");

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.User_Id);
            });

            modelBuilder.Entity<Donation>(entity =>
            {
                entity.ToTable("donations"); // Maps to "Donations" table

                entity.HasKey(e => e.Donation_Id); // Primary key
                                
                // Configure foreign key
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Donations)
                    .HasForeignKey(d => d.User_Id)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        }

    }
}

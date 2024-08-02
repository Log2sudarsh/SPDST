using SPDPBWeb.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPDSTApi
{
    [Table("donations", Schema = "public")]
    public class Donation
    {
        [Key]
        [Column("donation_id")]
        public int Donation_Id { get; set; }

        [Column("user_id")]      
        public int User_Id { get; set; }

        [Column("donated_amount")]
        public int Donated_Amount { get; set; }

        [Column("receipt_no")]
        public int Receipt_No { get; set; }

        [Column("pay_date")]
        public DateTime Pay_Date { get; set; }

        [Column("pay_mode")]
        public string? Pay_Mode { get; set; }

        [Column("payment_status")]
        public bool Payment_Status { get; set; }

        [Column("transaction_no")]
        public string? Transaction_No { get; set; }

        [Column("created_by")]
        public required string Created_By { get; set; }

        [Column("created_on")]
        public required DateTime Created_On { get; set; }

        [Column("modified_by")]
        public string? Modified_By { get; set; }

        [Column("modified_on")]
        public DateTime Modified_On { get; set; }     
        public User? User { get; set; }
        public void SetDateTimeToUtc()
        {
            Pay_Date = DateTime.SpecifyKind(Pay_Date, DateTimeKind.Utc);
            Created_On = DateTime.SpecifyKind(Created_On, DateTimeKind.Utc);
            Modified_On = DateTime.SpecifyKind((DateTime)Modified_On, DateTimeKind.Utc);
        }
    }
}

using SPDSTApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPDPBWeb.Models
{
    [Table("users", Schema = "public")]
    public class User
    {
        [Column("user_id")]
        [Key]
        public int User_Id { get; set; }

        [Column("name_en")]
        
        public string? Name_En { get; set; }

        [Column("name_kn")]        
        public string? Name_Kn { get; set; }


        [Column("place")]
       public string? Place { get; set; }

        [Column("contact_no")]
        public long? Contact_No { get; set; }

        [Column("pledge_amount")]
        public int? Pledge_Amount { get; set; }

        [Column("created_by")]
        public required string Created_By { get; set; }

        [Column("created_on")]
        public DateTime Created_On { get; set; }

        [Column("modified_by")]
        public string? Modified_By { get; set; }

        [Column("modified_on")]
        public DateTime Modified_On { get; set; }

        [Column("user_type")]
        public string? User_Type { get; set; }

        public ICollection<Donation>? Donations { get; set; }
    }
}

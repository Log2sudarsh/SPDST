namespace SPDPBWeb.Models
{
    public class DonationDto
    {
        public int Donation_Id { get; set; }
        public int User_Id { get; set; }
        public int Donated_Amount { get; set; }
        public int Receipt_No { get; set; }
        public DateTime Pay_Date { get; set; }
        public string? Pay_Mode { get; set; }
        public bool? Payment_Status { get; set; }
        public string? Transaction_No { get; set; }
        public required string Created_By { get; set; }
        public DateTime Created_On { get; set; }
        public string? Modified_By { get; set; }
        public DateTime Modified_On { get; set; }
    }
}

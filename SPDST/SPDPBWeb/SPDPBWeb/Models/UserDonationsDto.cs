namespace SPDPBWeb.Models
{
    public class UserDonationsDto
    {
        public int User_Id { get; set; }
        public string? Name_En { get; set; }
        public string? Name_Kn { get; set; }
        public string? Place { get; set; }
        public long Contact_No { get; set; }
        public int Pledge_Amount { get; set; }
        public int Total_Donated_Amount { get; set; }
        public DateTime Created_On { get; set; }
        public string? Modified_By { get; set; }
        public DateTime Modified_On { get; set; }
        public List<DonationDto>? Donations { get; set; }
    }
}

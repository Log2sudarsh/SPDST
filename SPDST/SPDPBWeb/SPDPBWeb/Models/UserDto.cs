namespace SPDPBWeb.Models
{
    public class UserDto
    {
        public required string Name_Kn { get; set; }
        public required string Name_En { get; set; }
        public string? Place { get; set; }
        public long? Contact_No { get; set; }
        public int? Pledge_Amount { get; set; }
        public required string Created_By { get; set; }
        public DateTime Created_On { get; set; }
        public string? Modified_By { get; set; }
        public DateTime Modified_On { get; set; }
    }
}

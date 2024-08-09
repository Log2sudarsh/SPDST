using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPDPBWeb.Models;
using SPDSTApi.Context;

namespace SPDSTApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationsController : ControllerBase
    {
        private readonly DonationsContext _context;

        public DonationsController(DonationsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDonationsDto>>> GetDonations()
        {
            var donations = await _context.Users
                            .GroupJoin(
                                _context.Donations,
                                user => user.User_Id,
                                donation => donation.User_Id,
                                (user, donations) => new { user, donations }
                            )
                            .Select(joined => new UserDonationsDto
                            {
                                User_Id = joined.user.User_Id,
                                Name_En = joined.user.Name_En,
                                Name_Kn = joined.user.Name_Kn,
                                Place = joined.user.Place,
                                Contact_No = joined.user.Contact_No,
                                Pledge_Amount = joined.user.Pledge_Amount,
                                Total_Donated_Amount = joined.donations.Sum(d => (int?)d.Donated_Amount) ?? 0,
                                Donations = joined.donations.Select(d => new DonationDto
                                {
                                    Donation_Id = d.Donation_Id,
                                    Donated_Amount = d.Donated_Amount,
                                    Receipt_No = d.Receipt_No,
                                    Pay_Date = d.Pay_Date,
                                    Pay_Mode = d.Pay_Mode,
                                    Payment_Status = d.Payment_Status,
                                    Transaction_No = d.Transaction_No,
                                    Created_By = d.Created_By,
                                    Created_On = d.Created_On,
                                    Modified_By = d.Modified_By,
                                    Modified_On = d.Modified_On
                                }).ToList()
                            })
                            .ToListAsync();


            return Ok(donations);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserDetails(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.User_Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Name_Kn = updatedUser.Name_Kn;
            user.Name_En = updatedUser.Name_En;
            user.Place = updatedUser.Place;
            user.Contact_No = updatedUser.Contact_No;
            user.Pledge_Amount = updatedUser.Pledge_Amount;
            user.Created_By = "admin";
            user.Created_On = DateTime.UtcNow;
            user.Modified_By = "admin";
            user.Modified_On = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user);
        }

        // GET: api/donations/report
        [HttpGet("report")]
        public IActionResult GetDonorReport()
        {
            var query = from t1 in _context.Users
                        join t2 in _context.Donations on t1.User_Id equals t2.User_Id into donationsGroup
                        from t2 in donationsGroup.DefaultIfEmpty()
                        orderby t1.User_Id
                        select new
                        {
                            UserId = t1.User_Id,
                            NameKn = t1.Name_Kn,
                            Place = t1.Place,
                            ContactNo = t1.Contact_No,
                            PledgeAmount = t1.Pledge_Amount,
                            UserType = t1.User_Type,
                            DonatedAmount = t2.Donated_Amount,
                            ReceiptNo = t2.Receipt_No,
                            PaymentStatus = t2.Payment_Status,
                            ReceiptType = t2.Receipt_Type
                        };
            var result = query.ToList();
            return Ok(result);
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.User_Id == id);
        }

        [HttpPost]
        public async Task<ActionResult<Donation>> PostDonation(DonationDto donationDto)
        {
            var donation = new Donation
            {
                User_Id = donationDto.User_Id,
                Donated_Amount = donationDto.Donated_Amount,
                Receipt_No = donationDto.Receipt_No,
                Pay_Date = DateTime.SpecifyKind(donationDto.Pay_Date, DateTimeKind.Utc),
                Pay_Mode = donationDto.Pay_Mode,
                Transaction_No = donationDto.Transaction_No,
                Created_By = donationDto.Created_By,
                Created_On = DateTime.UtcNow,
                Modified_By = donationDto.Modified_By,
                Modified_On = DateTime.UtcNow
            };

            _context.Donations.Add(donation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDonations), new { id = donation.Donation_Id }, donation);
        }

        // POST: api/donations/adduser
        [HttpPost("adduser")]
        public IActionResult AddUser([FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("User data is null.");
            }

            var newUser = new User
            {
                Name_Kn = userDto.Name_Kn,
                Name_En = userDto.Name_En,
                Place = userDto.Place,
                Contact_No = userDto.Contact_No,
                Pledge_Amount = userDto.Pledge_Amount,
                Created_On = DateTime.UtcNow,
                Created_By=userDto.Created_By,
                Modified_By=userDto.Created_By,
                Modified_On=DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok("User added successfully.");
        }

    }
}

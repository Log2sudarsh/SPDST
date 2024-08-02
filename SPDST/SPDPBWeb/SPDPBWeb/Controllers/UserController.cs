using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPDPBWeb.Models;
using SPDSTApi;
using SPDSTApi.Context;

namespace SPDPBWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly DonationsContext _context;

        public UserController(DonationsContext context)
        {
            _context = context;

        }

        [HttpPost]
        [Route("api/users")]
        public IActionResult AddUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("User is null.");
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }
    }
}

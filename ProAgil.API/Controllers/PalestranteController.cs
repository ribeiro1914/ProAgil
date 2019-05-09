using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController : ControllerBase
    {
        public IProAgilRepository _repo { get; }
        public PalestranteController(IProAgilRepository repo)
        {
            _repo = repo;
        }

        #region Get
        [HttpGet("{Nome}")]
        public async Task<IActionResult> Get(string nome)
        {
            try
            {
                var results = await _repo.GetAllPalestrantesAsyncByName(nome, true);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro com o banco de dados");
            }
        }

        [HttpGet("{PalestranteId}")]
        public async Task<IActionResult> Get(int PalestranteId)
        {
            try
            {
                var results = await _repo.GetPalestranteAsync(PalestranteId, true);
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro com o banco de dados");
            }
        }



        #endregion

        #region Post
        #endregion
        [HttpPost]
        public async Task<IActionResult> Post(Palestrante model)
        {
            try
            {
                _repo.Add(model);

                if (await _repo.SaveChangesAsync())
                {
                    //return this.StatusCode(StatusCodes.Status200OK, "Evento Salvo com Sucesso");
                    return Created($"/api/palestrante/{model.PalestranteEvento}", model);
                }

            }
            catch (System.Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

            return BadRequest();
        }
        #region Put
        #endregion

        #region Delete
        #endregion

    }
}
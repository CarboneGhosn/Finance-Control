using Microsoft.AspNetCore.Mvc;
using FinanceAPI.Models;
using FinanceAPI.Services;

namespace FinanceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly ITransacaoService _service;

        public TransacaoController(ITransacaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.GetAll());
        }

        [HttpPost]
        public IActionResult Post([FromBody] Transacao transacao)
        {
            _service.Add(transacao);
            return Created("", transacao);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Transacao transacao)
        {
            if (id != transacao.Id)
                return BadRequest("ID da URL diferente do corpo da requisição");

            var atualizado = _service.Atualizar(transacao);
            if (!atualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deletado = _service.Deletar(id);
            if (!deletado)
                return NotFound();

            return NoContent();
        }

    }

}

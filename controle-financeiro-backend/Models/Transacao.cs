using System;

namespace FinanceAPI.Models
{
    public class Transacao
    {
        public int? Id { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }
    }
}

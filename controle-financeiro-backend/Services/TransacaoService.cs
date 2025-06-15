using FinanceAPI.Models;
using System.Collections.Generic;
using System.Linq;

namespace FinanceAPI.Services
{
    public interface ITransacaoService
    {
        List<Transacao> GetAll();
        Transacao GetById(int id);
        void Add(Transacao transacao);
        bool Update(Transacao transacao);
        bool Delete(int id);
        bool Atualizar(Transacao transacao);
        bool Deletar(int id);

    }

    public class TransacaoService : ITransacaoService
    {
        private readonly List<Transacao> _transacoes = new();
        private int _nextId = 1;  // Para simular auto-incremento

        public List<Transacao> GetAll()
        {
            return _transacoes;
        }

        public Transacao GetById(int id)
        {
            return _transacoes.FirstOrDefault(t => t.Id == id);
        }

        public void Add(Transacao transacao)
        {
            transacao.Id = _nextId++;
            _transacoes.Add(transacao);
        }

        public bool Update(Transacao transacao)
        {
            var existente = _transacoes.FirstOrDefault(t => t.Id == transacao.Id);
            if (existente == null)
                return false;

           
            existente.Descricao = transacao.Descricao;
            existente.Valor = transacao.Valor;
            existente.Data = transacao.Data;
           
            return true;
        }

        public bool Delete(int id)
        {
            var transacao = _transacoes.FirstOrDefault(t => t.Id == id);
            if (transacao == null)
                return false;

            _transacoes.Remove(transacao);
            return true;
        }

        public bool Atualizar(Transacao transacao)
        {
            var index = _transacoes.FindIndex(t => t.Id == transacao.Id);
            if (index == -1)
                return false;

            _transacoes[index] = transacao;
            return true;
        }

        public bool Deletar(int id)
        {
            var transacao = _transacoes.FirstOrDefault(t => t.Id == id);
            if (transacao == null)
                return false;

            _transacoes.Remove(transacao);
            return true;
        }

    }
}

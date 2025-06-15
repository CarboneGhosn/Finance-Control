import { Component, OnInit } from '@angular/core';
import { TransacaoService } from '../transacao.service';
import { ChartConfiguration, ChartType } from 'chart.js';

declare var bootstrap: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    transacoes: any[] = [];
    novaTransacao = {
        id: undefined,
        descricao: '',
        valor: 0,
        data: ''
    };
    transacaoEditavel?: any;
    transacaoSelecionadaId: number | null = null;

    // Dados do gráfico de pizza
    public pieChartLabels: string[] = [];
    public pieChartData: number[] = [];
    public pieChartType: ChartType = 'pie';
    public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    constructor(private transacaoService: TransacaoService) { }

    ngOnInit(): void {
        this.carregarTransacoes();
    }

    carregarTransacoes(): void {
        this.transacaoService.getTransacoes().subscribe(data => {
            this.transacoes = data;
            this.atualizarGrafico();
        });
    }

    adicionarTransacao(): void {
        this.transacaoService.adicionarTransacao(this.novaTransacao).subscribe(() => {
            this.novaTransacao = { id: undefined, descricao: '', valor: 0, data: '' };
            this.carregarTransacoes();
            this.mostrarMensagem('Transação adicionada com sucesso!', 'success');
        });
    }

    editar(transacao: any): void {
        this.transacaoEditavel = { ...transacao };
    }

    salvar(): void {
        if (this.transacaoEditavel) {
            this.transacaoService.atualizarTransacao(this.transacaoEditavel).subscribe(() => {
                this.transacaoEditavel = undefined;
                this.carregarTransacoes();
                this.mostrarMensagem('Transação atualizada com sucesso!', 'success');
            });
        }
    }

    cancelar(): void {
        this.transacaoEditavel = undefined;
    }

    abrirModalExclusao(id: number): void {
        this.transacaoSelecionadaId = id;
        const modalElement = document.getElementById('modalConfirmarExclusao');
        const modalBootstrap = new bootstrap.Modal(modalElement);
        modalBootstrap.show();
    }

    confirmarExclusao(): void {
        if (this.transacaoSelecionadaId !== null) {
            this.transacaoService.deletarTransacao(this.transacaoSelecionadaId).subscribe({
                next: () => {
                    this.mostrarMensagem('Deletada com sucesso!', 'success');
                    this.carregarTransacoes();
                    this.transacaoSelecionadaId = null;

                    const modalElement = document.getElementById('modalConfirmarExclusao');
                    const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
                    modalBootstrap.hide();
                },
                error: () => {
                    this.mostrarMensagem('Erro ao deletar.', 'danger');
                }
            });
        }
    }

    get saldoTotal(): number {
        return this.transacoes.reduce((total, t) => total + Number(t.valor), 0);
    }

    atualizarGrafico(): void {
        const agrupamento: { [descricao: string]: number } = {};
        this.transacoes.forEach(t => {
            agrupamento[t.descricao] = (agrupamento[t.descricao] || 0) + Number(t.valor);
        });
        this.pieChartLabels = Object.keys(agrupamento);
        this.pieChartData = Object.values(agrupamento);
    }

    mostrarMensagem(mensagem: string, tipo: 'success' | 'danger' | 'info'): void {
        const div = document.createElement('div');
        div.className = `alert alert-${tipo} alert-dismissible fade show fixed-top m-3 shadow`;
        div.style.zIndex = '1055';
        div.style.right = '0';
        div.style.left = 'auto';
        div.style.width = 'auto';
        div.innerHTML = `
      <strong>${mensagem}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

        document.body.appendChild(div);

        setTimeout(() => {
            div.classList.remove('show');
            div.classList.add('hide');
            setTimeout(() => div.remove(), 500);
        }, 3000);
    }
}

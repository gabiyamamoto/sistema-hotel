import prisma from '../utils/prismaClient.js';

export default class HospedeModel {
    constructor({ id = null, nome, email = true, telefone = null, cep = null, logradouro = null, bairro = null, localidade = null, uf = null, ativo = true } = {}) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    /* === MADU: INSERIR REGRAS DE NEGÓCIO ====
    
        Nome obrigatório (3 a 100 caracteres)
        Campos obrigatórios conforme domínio
        CEP válido
        Integração com ViaCEP obrigatória
        Não permitir operações se ativo = false
    
    */


    async buscarEnderecoViaCep(cep) {
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

            if (!resposta.ok) throw new Error('Serviço ViaCEP indisponível no momento.');

            const dados = await resposta.json();

            if (dados.erro) throw new Error(`CEP ${cep} não encontrado.`);

            return {
                logradouro: dados.logradouro,
                bairro: dados.bairro,
                localidade: dados.localidade,
                uf: dados.uf,
            };

        } catch (error) {
            if (error.message.includes('não encontrado') || error.message.includes('ViaCEP')) throw error;

            throw new Error("Serviço ViaCEP indisponível no momento.");
        }
    }

    async criar() {

        const nomeValidado = this.validarNome(this.nome);
        const telefoneValidado = this.validarTelefone(this.telefone);
        const emailValidado = this.validarEmail(this.email);
        const cepValidado = this.validarCEP(this.cep);
        const endereco = await this.buscarEnderecoViaCep(cepValidado);


        if (this.ativo == false) throw new Error("Não permitir operações se ativo = false");

        return prisma.hospede.create({
            data: {
                nome: nomeValidado,
                email: emailValidado,
                telefone: telefoneValidado,
                cep: cepValidado,
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                localidade: endereco.localidade,
                uf: endereco.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {

        const dataUpdate = {};

        if (this.nome) dataUpdate.nome = this.validarNome(this.nome);
        if (this.email) dataUpdate.email = this.validarEmail(this.email);
        if (this.telefone) dataUpdate.telefone = this.validarTelefone(this.telefone);
        if (this.cep !== null) {
            const cepValidado = this.validarCEP(this.cep);

            if (cepValidado) {
                const endereco = await this.buscarEnderecoViaCep(cepValidado);

                dataUpdate.cep = cepValidado;
                dataUpdate.logradouro = endereco.logradouro;
                dataUpdate.bairro = endereco.bairro;
                dataUpdate.localidade = endereco.localidade;
                dataUpdate.uf = endereco.uf;
            }
        }

        if (this.ativo == false) throw new Error("Não permitir operações se ativo = false");

        if (this.ativo !== undefined) dataUpdate.ativo = this.ativo;

        return prisma.hospede.update({
            where: { id: this.id },
            data: dataUpdate,
        });
    }

    async deletar() {

        if (this.ativo == false) throw new Error("Não permitir operações se ativo = false");

        return prisma.hospede.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.email) {
            where.email = { contains: filtros.email, mode: 'insensitive' };
        }
        if (filtros.localidade) {
            where.localidade = { contains: filtros.localidade, mode: 'insensitive' };
        }


        return prisma.hospede.findMany({
            where,
            orderBy: { id: 'asc' },
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.hospede.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new HospedeModel(data);
    }
}
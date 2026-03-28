import prisma from '../utils/prismaClient.js';

export default class HospedeModel {
    constructor({ id = null, nome, email = null, telefone = null, cep = null, logradouro = null, bairro = null, localidade = null, uf = null, ativo = true } = {}) {
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

    validarNome(nome) {
        if (!nome || nome.trim().length < 3 || nome.trim().length > 100)
            throw new Error('Nome deve conter entre 3 e 100 caracteres.');
        return nome.trim();
    }

    validarTelefone(telefone) {
        const telefoneNumerico = telefone.replace(/\D/g, '');
        if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11)
            throw new Error('Telefone deve conter 10 ou 11 dígitos numéricos.');
        return telefoneNumerico;
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) throw new Error('Email em formato inválido.');
        return email.toLowerCase();
    }

    validarCEP(cep) {
        const cepNumerico = cep.replace(/\D/g, '');
        if (!/^\d{8}$/.test(cepNumerico)) {
            throw new Error('CEP deve conter exatamente 8 dígitos numéricos.');
        }
        return cepNumerico;
    }

    async buscarEnderecoViaCep(cep) {
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

            if (!resposta.ok) throw new Error("Serviço externo indisponível.");

            const dados = await resposta.json();

            if (dados.erro) throw new Error("CEP não encontrado."
            );

            return {
                logradouro: dados.logradouro,
                bairro: dados.bairro,
                localidade: dados.localidade,
                uf: dados.uf,
            };

        } catch (error) {
            if (error.message.includes('CEP')) throw error;

            throw new Error("Serviço externo indisponível."
            );
        }
    }

    async criar() {

        const nomeValidado = this.validarNome(this.nome);
        const telefoneValidado = this.validarTelefone(this.telefone);
        const emailValidado = this.validarEmail(this.email);
        const cepValidado = this.cep ? this.validarCEP(this.cep) : null;
        const endereco = cepValidado ? await this.buscarEnderecoViaCep(cepValidado) : {};

        if (this.ativo === false) throw new Error("Operação não permitida para registro inativo.");

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

        const hospedeExistente = await prisma.hospede.findUnique({ where: { id: this.id } });

        if (hospedeExistente && hospedeExistente.ativo === false) throw new Error("Operação não permitida para registro inativo.");

        const dataUpdate = {};

        if (this.nome) dataUpdate.nome = this.validarNome(this.nome);
        if (this.email) dataUpdate.email = this.validarEmail(this.email);
        if (this.telefone) dataUpdate.telefone = this.validarTelefone(this.telefone);
        if (this.cep) {
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

        if (this.ativo !== undefined) dataUpdate.ativo = this.ativo;

        return prisma.hospede.update({
            where: { id: this.id },
            data: dataUpdate,
        });
    }

    async deletar() {

        const hospedeExistente = await prisma.hospede.findUnique({ where: { id: this.id } });

        if (hospedeExistente && hospedeExistente.ativo === false) throw new Error("Operação não permitida para registro inativo.");

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
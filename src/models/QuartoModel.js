import prisma from '../utils/prismaClient.js';

export default class QuartoModel {
    constructor({ id = null, nome = null, categoria = true, preco = null } = {}) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
    }

    async criar() {
        return prisma.quarto.create({
            data: {
                nome: this.nome,
                categoria: this.categoria,
                preco: this.preco,
            },
        });
    }

    async atualizar() {
        return prisma.quarto.update({
            where: { id: this.id },
            data: { nome: this.nome, categoria: this.categoria, preco: this.preco },
        });
    }

    async deletar() {
        return prisma.quarto.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.categoria !== undefined) {
            where.categoria = filtros.categoria === 'true';
        }
        if (filtros.preco !== undefined) {
            where.preco = parseFloat(filtros.preco);
        }

        return prisma.quarto.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.quarto.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new QuartoModel(data);
    }
}

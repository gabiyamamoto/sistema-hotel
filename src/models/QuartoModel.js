import prisma from '../utils/prismaClient.js';

const CATEGORIAS_VALIDAS = ['STANDARD', 'LUXO', 'SUITE', 'PRESIDENCIAL'];

export default class QuartoModel {
    constructor({
        id = null,
        nome = null,
        categoria = null,
        descricao = null,
        disponivel = true,
        preco = null,
        foto = null,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.disponivel = disponivel;
        this.preco = preco;
        this.foto = foto;
    }

    validarNome(nome) {
        if (!nome || nome.trim().length < 3 || nome.trim().length > 100)
            throw new Error('Nome deve conter entre 3 e 100 caracteres')
        return nome.trim();
    }

    validarCategoria(categoria) {
        if (!categoria) throw new Error('Categoria é obrigatória.');
        if (!CATEGORIAS_VALIDAS.includes(categoria.toUpperCase()))
            throw new Error(`Categoria inválida. Valores aceitos: ${CATEGORIAS_VALIDAS.join(', ')}.`)
        return categoria.toUpperCase();
    }

    validarPreco(preco) {
        const precoNumerico = parseFloat(preco);
        if (isNaN(precoNumerico) || precoNumerico < 0)
            throw new Error('Preço deve ser um número maior ou igual a zero.');
        return precoNumerico;
    }

    //---CRUD---//

    async criar() {
        const nomeValidado = this.validarNome(this.nome);
        const categoriaValidada = this.validarCategoria(this.categoria)
        const precoValidado = this.validarPreco(this.preco)

        if (this.disponivel === false)
            throw new Error('Não é permitido utilizar item indisponível')

        return prisma.quarto.create({
            data: {
                nome: nomeValidado,
                descricao: this.descricao ?? null,
                categoria: categoriaValidada,
                disponivel: this.disponivel,
                preco: precoValidado,
                foto: this.foto ?? null,
            },
        });
    }

    async atualizar() {
        const quartoExistente = await prisma.quarto.findUnique({ where: { id: this.id }});

        if (!quartoExistente) throw new Error('Registro não encontrado.')
            
        if (quartoExistente.disponivel === false)
            throw new Error('Não é permitido utilizar item indisponível.')
        
        const dataUpdate = {};

        if (this.nome !== undefined) dataUpdate.nome = this.validarNome(this.nome);
        if (this.descricao !== undefined) dataUpdate.descricao = this.descricao;
        if (this.categoria !== undefined) dataUpdate.categoria = this.validarCategoria(this.categoria);
        if (this.preco !== undefined) dataUpdate.preco = this.validarPreco(this.preco);
        if (this.disponivel !== undefined) dataUpdate.disponivel = this.disponivel;

        return prisma.quarto.update({
            where: {id: this.id},
            data: dataUpdate,
        });
    }

    async deletar() {
        const quartoExistente = await prisma.quarto.findUnique({ where: { id: this.id } });

        if (!quartoExistente) throw new Error('Registro não encontrado.');

        if (quartoExistente.disponivel === false)
            throw new Error('Não é permitido utilizar item indisponível.')

        return prisma.quarto.delete({where: {id: this.id} })
    };

    //--- consultas ---//

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.categoria) {
            where.categoria = filtros.categoria.toUpperCase()
        }
        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true'
        }

        return prisma.quarto.findMany({ 
            where,
            orderBy: { id: 'asc'} 
        });
    }

    async atualizarFoto(caminhoFoto) {
        const quartoExistente = await prisma.quarto.findUnique({where: { id: this.id} });
        
        if (!quartoExistente) throw new Error('Registro não encontrado.');

        if(quartoExistente.disponivel === false)
            throw new Error('Não é permitido utilizar item indisponivel.')

        return prisma.quarto.update({
            where: { id: this.id },
            data: { foto: caminhoFoto}
        });
    }
}

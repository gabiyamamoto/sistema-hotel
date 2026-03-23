import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela hospede...');

    //await prisma.exemplo.deleteMany();

    console.log('📦 Inserindo novos hospedes...');

    await prisma.hospede.createMany({
        data: [
            {
                nome: 'Ana Silva',
                email: 'ana.silva@email.com',
                telefone: '11999998888',
                cep: '01001-000',
                logradouro: 'Praça da Sé',
                bairro: 'Sé',
                localidade: 'São Paulo',
                uf: 'SP',
                ativo: true,
            },
            {
                nome: 'Bruno Oliveira',
                email: 'bruno.o@email.com',
                telefone: '21988887777',
                cep: '20010-000',
                logradouro: 'Rua Primeiro de Março',
                bairro: 'Centro',
                localidade: 'Rio de Janeiro',
                uf: 'RJ',
                ativo: true,
            },
            {
                nome: 'Carla Souza',
                email: 'carla.souza@email.com',
                telefone: '31977776666',
                cep: '30110-001',
                logradouro: 'Avenida Afonso Pena',
                bairro: 'Centro',
                localidade: 'Belo Horizonte',
                uf: 'MG',
                ativo: false,
            },
        ],
    });

    console.log('📦 Inserindo novos quartos...');

    await prisma.quarto.createMany({
        data: [
            {
                nome: 'Suíte 101',
                descricao: 'Quarto aconchegante para solteiros',
                categoria: 'SOLTEIRO',
                disponivel: true,
                preco: 150.0,
                foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4cqqLWPXW707mdTZuB1g9n7LvG2mhPuepEg&s',
                hospedeId: null,
            },
            {
                nome: 'Master 202',
                descricao: 'Vista para o mar e cama king size',
                categoria: 'LUXO',
                disponivel: true,
                preco: 450.0,
                foto: 'https://quartosetc.com.br/wp-content/uploads/2022/02/KAREN_PISACANE1-scaled-e1645810950545.jpg',
                hospedeId: null,
            },
            {
                nome: 'Standard 303',
                descricao: 'Ideal para casais, com frigobar',
                categoria: 'CASAL',
                disponivel: true,
                preco: 280.0,
                foto: null,
                hospedeId: null,
            },
            {
                nome: 'Econômico 001',
                descricao: 'Custo benefício excelente',
                categoria: 'ECONOMICO',
                disponivel: true,
                preco: 95.5,
                foto: null,
                hospedeId: null,
            },
        ],
    });

    const hospedes = await prisma.hospede.findMany();
    const quartos = await prisma.quarto.findMany();

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

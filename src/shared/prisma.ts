import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
})

prisma.$on('query', (e: any) => {
    console.log("___________________________________________")
    console.log('Query: ' + e.query);
    console.log("___________________________________________")
    console.log('Params: ' + e.params)
    console.log("___________________________________________")
    console.log('Duration: ' + e.duration + 'ms')
    console.log("___________________________________________")
})


export default prisma;
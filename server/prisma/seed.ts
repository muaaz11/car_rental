import { prisma } from "../database/database";

async function main() {
    const newUser = await prisma.user.createMany({
    data: [
        {name: 'faran', email: `asd@gmail.com`, isActive: false },
        {name: 'maaz', email: `abc@gmail.com`, isActive: true}
    ],
})

console.log(newUser)
}

main()
.catch((error) => {
    console.log(error)
})
.finally(async() => {
    await prisma.$disconnect()
})
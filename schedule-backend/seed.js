const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
   await prisma.resource.createMany({
        data: [
          {
            id: '1',
            name: 'Alice',
          },
          {
            id: '2',
            name: 'Bob',
          },
          {
            id: '3',
            name: 'Charlie',
          },
        ],
  });
  await prisma.event.createMany({
    data: [
      {
        id: 'e0c6c02c-1234-4bfa-b231-7f50b85d8cfa',
        title: 'Team Meeting',
        start: new Date('2024-10-05T10:00:00.000Z'),
        end: new Date('2024-10-05T11:00:00.000Z'),
        resourceId: '1',
      },
      {
        id: 'b72861b6-5ef3-4ea6-9081-074d1a6e330d',
        title: 'Client Call',
        start: new Date('2024-10-06T14:00:00.000Z'),
        end: new Date('2024-10-06T15:00:00.000Z'),
        resourceId: '2',
      },
      {
        id: 'c0b44f5c-e00f-411d-b869-032bb309b76e',
        title: 'Project Review',
        start: new Date('2024-10-07T09:00:00.000Z'),
        end: new Date('2024-10-07T10:30:00.000Z'),
        resourceId: '3',
      },
    ],
  });
  console.log('Mock data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

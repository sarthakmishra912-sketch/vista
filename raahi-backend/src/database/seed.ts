import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default pricing rule
  const pricingRule = await prisma.pricingRule.upsert({
    where: { id: 'default-pricing' },
    update: {},
    create: {
      id: 'default-pricing',
      name: 'Default Pricing',
      baseFare: 25,
      perKmRate: 12,
      perMinuteRate: 2,
      surgeMultiplier: 1.0,
      peakHourMultiplier: 1.5,
      isActive: true,
      validFrom: new Date(),
    },
  });

  console.log('✅ Created pricing rule:', pricingRule.name);

  // Create surge areas
  const surgeAreas = [
    {
      name: 'Connaught Place',
      centerLatitude: 28.6315,
      centerLongitude: 77.2167,
      radius: 2.0,
      multiplier: 1.5,
    },
    {
      name: 'India Gate',
      centerLatitude: 28.6129,
      centerLongitude: 77.2295,
      radius: 1.5,
      multiplier: 1.3,
    },
    {
      name: 'Delhi Airport',
      centerLatitude: 28.5562,
      centerLongitude: 77.1000,
      radius: 3.0,
      multiplier: 2.0,
    },
  ];

  for (const area of surgeAreas) {
    const surgeArea = await prisma.surgeArea.create({
      data: area,
    });
    console.log('✅ Created surge area:', surgeArea.name);
  }

  // Create test users
  const testUsers = [
    {
      phone: '+919876543210',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      isVerified: true,
    },
    {
      phone: '+919876543211',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      isVerified: true,
    },
  ];

  for (const userData of testUsers) {
    const user = await prisma.user.create({
      data: userData,
    });
    console.log('✅ Created user:', user.firstName);
  }

  // Create test driver
  const testDriver = await prisma.driver.create({
    data: {
      userId: (await prisma.user.findFirst({ where: { phone: '+919876543210' } }))!.id,
      licenseNumber: 'DL123456789',
      licenseExpiry: new Date('2025-12-31'),
      vehicleNumber: 'DL01AB1234',
      vehicleModel: 'Maruti Swift',
      vehicleColor: 'White',
      vehicleYear: 2020,
      isVerified: true,
      isActive: true,
      isOnline: true,
      currentLatitude: 28.6139,
      currentLongitude: 77.2090,
      rating: 4.8,
      totalRides: 150,
      totalEarnings: 25000,
    },
  });

  console.log('✅ Created driver:', testDriver.vehicleNumber);

  // Create driver documents
  const documents = [
    {
      driverId: testDriver.id,
      documentType: 'LICENSE' as const,
      documentUrl: 'https://example.com/license.pdf',
      isVerified: true,
      verifiedAt: new Date(),
    },
    {
      driverId: testDriver.id,
      documentType: 'RC' as const,
      documentUrl: 'https://example.com/rc.pdf',
      isVerified: true,
      verifiedAt: new Date(),
    },
    {
      driverId: testDriver.id,
      documentType: 'INSURANCE' as const,
      documentUrl: 'https://example.com/insurance.pdf',
      isVerified: true,
      verifiedAt: new Date(),
    },
  ];

  for (const doc of documents) {
    await prisma.driverDocument.create({
      data: doc,
    });
  }

  console.log('✅ Created driver documents');

  // Create sample notifications
  const notifications = [
    {
      userId: (await prisma.user.findFirst({ where: { phone: '+919876543210' } }))!.id,
      title: 'Welcome to Raahi!',
      message: 'Thank you for joining Raahi. Your journey starts here!',
      type: 'SYSTEM' as const,
      isRead: false,
    },
    {
      userId: (await prisma.user.findFirst({ where: { phone: '+919876543211' } }))!.id,
      title: 'Ride Completed',
      message: 'Your ride from Connaught Place to India Gate has been completed.',
      type: 'RIDE_UPDATE' as const,
      isRead: true,
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification,
    });
  }

  console.log('✅ Created sample notifications');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

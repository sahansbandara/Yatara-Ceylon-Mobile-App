/**
 * Remote seeder — populates the hosted Render database via the live API.
 * Usage: SEED_URL=https://yatara-ceylon-mobile-app.onrender.com/api node backend/scripts/remote-seed.js
 */
const BASE = process.env.SEED_URL || 'https://yatara-ceylon-mobile-app.onrender.com/api';

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  return res.json();
}
async function get(path, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { headers });
  return res.json();
}

async function seed() {
  console.log('Seeding against:', BASE);

  // 1. Register or login as admin
  let token;
  const loginRes = await post('/auth/login', { email: 'admin@yataraceylon.com', password: 'Password123!' });
  if (loginRes.token) {
    token = loginRes.token;
    console.log('Logged in as admin');
  } else {
    const regRes = await post('/auth/register', { name: 'Yatara Admin', email: 'admin@yataraceylon.com', password: 'Password123!' });
    token = regRes.token;
    console.log('Registered admin account');
  }

  // 2. Register staff & traveler
  const staffLogin = await post('/auth/login', { email: 'staff@yataraceylon.com', password: 'Password123!' });
  if (!staffLogin.token) {
    await post('/auth/register', { name: 'Yatara Staff', email: 'staff@yataraceylon.com', password: 'Password123!' });
    console.log('Registered staff account');
  }
  const travelerLogin = await post('/auth/login', { email: 'traveler@yataraceylon.com', password: 'Password123!' });
  if (!travelerLogin.token) {
    await post('/auth/register', { name: 'Demo Traveler', email: 'traveler@yataraceylon.com', password: 'Password123!' });
    console.log('Registered traveler account');
  }

  // 3. Seed packages
  const existingPkgs = await get('/packages?public=true', token);
  if (!existingPkgs.data?.length) {
    const packages = [
      { title: 'Luxury Sri Lanka in 10 Days', summary: 'A premium island journey through culture, coast, wildlife, and hill country.', duration: '10 Days', durationDays: 10, type: 'journey', style: 'Luxury', priceMin: 250000, priceMax: 450000, highlights: 'Private chauffeur,Boutique stays,Wildlife safari', inclusions: 'Hotel pickup,Breakfast,Guide support', tags: 'luxury,culture,wildlife', images: 'https://yataraceylon.me/images/packages/luxury-sri-lanka-in-10-days-hero.webp,https://yataraceylon.me/images/packages/luxury-sri-lanka-in-10-days-gallery-1.webp,https://yataraceylon.me/images/packages/luxury-sri-lanka-in-10-days-gallery-2.webp' },
      { title: 'Heritage Triangle Explorer', summary: 'Discover ancient kingdoms of Anuradhapura, Polonnaruwa and Sigiriya.', duration: '5 Days', durationDays: 5, type: 'journey', style: 'Heritage', priceMin: 120000, priceMax: 220000, highlights: 'Sigiriya Rock,Temple visits,Cultural dance', tags: 'heritage,culture', images: 'https://yataraceylon.me/images/packages/heritage-triangle-private-edition-hero.webp,https://yataraceylon.me/images/packages/heritage-triangle-private-edition-gallery-1.webp,https://yataraceylon.me/images/packages/heritage-triangle-private-edition-gallery-2.webp' },
      { title: 'Southern Coast & Wildlife', summary: 'Beaches of Mirissa, Galle Fort, and Yala leopard safari.', duration: '7 Days', durationDays: 7, type: 'journey', style: 'Wildlife', priceMin: 180000, priceMax: 320000, highlights: 'Whale watching,Galle Fort,Yala Safari', tags: 'wildlife,coastal,safari', images: 'https://yataraceylon.me/images/packages/wildlife-coastal-luxe-hero.webp,https://yataraceylon.me/images/packages/wildlife-coastal-luxe-gallery-1.webp,https://yataraceylon.me/images/packages/wildlife-coastal-luxe-gallery-2.webp' },
      { title: 'Hill Country Rail Adventure', summary: 'Tea estates, misty highlands, and the famous Ella train ride.', duration: '4 Days', durationDays: 4, type: 'journey', style: 'Adventure', priceMin: 95000, priceMax: 175000, highlights: 'Scenic train,Tea plantation,Nine Arches Bridge', tags: 'adventure,hillcountry', images: 'https://yataraceylon.me/images/packages/hill-country-tea-rail-retreat-hero.png,https://yataraceylon.me/images/packages/hill-country-tea-rail-retreat-gallery-1.png,https://yataraceylon.me/images/packages/hill-country-tea-rail-retreat-gallery-2.png' },
      { title: 'Ayurveda Wellness Retreat', summary: 'A guided wellness reset with daily spa treatments and meditation.', duration: '6 Days', durationDays: 6, type: 'journey', style: 'Wellness', priceMin: 200000, priceMax: 380000, highlights: 'Daily treatments,Yoga sessions,Herbal cuisine', tags: 'wellness,ayurveda,spa', images: 'https://yataraceylon.me/images/packages/ayurveda-wellness-sanctuary-hero.webp,https://yataraceylon.me/images/packages/ayurveda-wellness-sanctuary-gallery-1.webp,https://yataraceylon.me/images/packages/ayurveda-wellness-sanctuary-gallery-2.webp' },
    ];
    for (const pkg of packages) {
      await post('/packages', pkg, token);
    }
    console.log(`Seeded ${packages.length} packages`);
  }

  // 4. Seed destinations
  const existingDest = await get('/destinations', token);
  if (!existingDest.data?.length || existingDest.data.length < 4) {
    const destinations = [
      { title: 'Kandy', description: 'A heritage hill capital centered around the Temple of the Tooth.', region: 'Hill Country', bestSeason: 'December to April', idealNights: '2 nights', highlights: 'Temple of the Tooth,Royal Botanical Gardens,Kandy Lake' },
      { title: 'Sigiriya', description: 'Ancient rock fortress with frescoes and palace ruins atop a 200m granite column.', region: 'Cultural Triangle', bestSeason: 'January to April', idealNights: '1 night', highlights: 'Lion Rock,Frescoes,Mirror Wall,Water Gardens' },
      { title: 'Ella', description: 'Misty mountain village famous for tea trails and the Nine Arches Bridge.', region: 'Uva Province', bestSeason: 'Year-round', idealNights: '2-3 nights', highlights: 'Nine Arches Bridge,Little Adams Peak,Ella Rock' },
      { title: 'Galle', description: 'UNESCO-listed colonial fort town on the southern coast.', region: 'Southern Coast', bestSeason: 'November to April', idealNights: '2 nights', highlights: 'Galle Fort,Dutch Church,Lighthouse,Beach walks' },
      { title: 'Yala', description: 'Sri Lanka\'s premier wildlife park known for the world\'s highest leopard density.', region: 'South-East', bestSeason: 'February to July', idealNights: '1-2 nights', highlights: 'Leopard safari,Elephants,Bird watching' },
      { title: 'Nuwara Eliya', description: 'Cool-climate hill station with colonial-era bungalows and tea estates.', region: 'Hill Country', bestSeason: 'March to May', idealNights: '2 nights', highlights: 'Tea estates,Gregory Lake,Horton Plains' },
    ];
    for (const dest of destinations) {
      await post('/destinations', dest, token);
    }
    console.log(`Seeded ${destinations.length} destinations`);
  }

  // 5. Seed vehicles
  const existingVeh = await get('/vehicles', token);
  if (!existingVeh.data?.length) {
    const vehicles = [
      { type: 'SUV', model: 'Toyota Land Cruiser Prado', plateNumber: 'YC-1001', seats: 4, luggage: 4, dailyRate: 45000, status: 'AVAILABLE', features: 'A/C,Leather seats,Private chauffeur' },
      { type: 'VAN', model: 'Toyota KDH 200', plateNumber: 'YC-2001', seats: 8, luggage: 6, dailyRate: 35000, status: 'AVAILABLE', features: 'A/C,WiFi,Luggage rack' },
      { type: 'SEDAN', model: 'Toyota Axio Hybrid', plateNumber: 'YC-3001', seats: 3, luggage: 2, dailyRate: 20000, status: 'AVAILABLE', features: 'A/C,Hybrid,Fuel efficient' },
      { type: 'LUXURY', model: 'Mercedes-Benz V-Class', plateNumber: 'YC-4001', seats: 6, luggage: 5, dailyRate: 75000, status: 'AVAILABLE', features: 'A/C,Leather interior,WiFi,Mini bar' },
    ];
    for (const veh of vehicles) {
      await post('/vehicles', veh, token);
    }
    console.log(`Seeded ${vehicles.length} vehicles`);
  }

  // 6. Seed partners
  const existingPart = await get('/partners', token);
  if (!existingPart.data?.length) {
    const partners = [
      { type: 'HOTEL', name: 'Ceylon Heritage Resort', contactPerson: 'Reservations Manager', phone: '+94770000001', email: 'reservations@ceylonheritage.example', address: 'Kandy, Sri Lanka', status: 'ACTIVE' },
      { type: 'HOTEL', name: 'Cinnamon Grand Colombo', contactPerson: 'Front Desk', phone: '+94770000002', email: 'info@cinnamongrand.example', address: '77 Galle Road, Colombo 03', status: 'ACTIVE' },
      { type: 'RESTAURANT', name: 'Ministry of Crab', contactPerson: 'Mr. Dharshan', phone: '+94770000003', email: 'bookings@ministryofcrab.example', address: 'Old Dutch Hospital, Fort', status: 'ACTIVE' },
      { type: 'ACTIVITY', name: 'Mirissa Whale Watch', contactPerson: 'Captain Sunil', phone: '+94770000004', email: 'tours@mirissawhale.example', address: 'Mirissa Harbour', status: 'ACTIVE' },
      { type: 'SUPPLIER', name: 'Lanka Safari Gear', contactPerson: 'Mr. Kumara', phone: '+94770000005', email: 'sales@lankasafari.example', address: 'Tissamaharama', status: 'ACTIVE' },
    ];
    for (const p of partners) {
      await post('/partners', p, token);
    }
    console.log(`Seeded ${partners.length} partners`);
  }

  // 7. Seed bookings
  const travelerTokenRes = await post('/auth/login', { email: 'traveler@yataraceylon.com', password: 'Password123!' });
  const tToken = travelerTokenRes.token;
  
  if (tToken) {
    const existingBookings = await get('/bookings/my', tToken);
    if (!existingBookings.data?.length) {
      // Need a package ID
      const pkgs = await get('/packages?public=true', token);
      const pkg = pkgs.data?.[0];
      
      if (pkg) {
        const bookings = [
          {
            packageId: pkg._id,
            pax: 2,
            dates: {
              from: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              to: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString()
            },
            pickupLocation: 'Bandaranaike International Airport (CMB)',
            specialRequirements: 'Vegetarian meals if possible.'
          },
          {
            packageId: pkgs.data?.[1]?._id || pkg._id,
            pax: 4,
            dates: {
              from: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              to: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
            },
            pickupLocation: 'Colombo Hotel',
            specialRequirements: 'Need a child seat for a 4 year old.'
          }
        ];
        
        for (const b of bookings) {
          await post('/bookings', b, tToken);
        }
        console.log(`Seeded ${bookings.length} bookings for traveler`);
      }
    }
  }

  console.log('\n✅ Remote seed complete!');
  console.log('Test credentials:');
  console.log('  Admin:    admin@yataraceylon.com / Password123!');
  console.log('  Staff:    staff@yataraceylon.com / Password123!');
  console.log('  Traveler: traveler@yataraceylon.com / Password123!');
}

seed().catch(console.error);

const API_URL = 'http://localhost:5000/api';

async function runAcceptanceTest() {
  console.log('====================================================');
  console.log('🚀 Running End-to-End Acceptance Scenario Tests');
  console.log('====================================================\n');

  // Step 1: Health Check
  const healthRes = await fetch(`${API_URL}/health`);
  const health = await healthRes.json();
  if (health.status !== 'ok') throw new Error('Health check failed');
  console.log('✅ 1. Health check passed:', health.service);

  // Step 2: Admin Login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@ismail-events.com',
      password: 'admin123456',
    }),
  });
  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.data.token) {
    throw new Error('Admin login failed: ' + loginData.message);
  }
  const token = loginData.data.token;
  console.log('✅ 2. Admin login successful for:', loginData.data.user.name);

  // Step 3: Admin Creates a New Category
  const testCatSlug = `test-cat-${Date.now()}`;
  const catRes = await fetch(`${API_URL}/categories/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'قسم تجريبي للأفراح',
      slug: testCatSlug,
      description: 'قسم لاختبار وظائف النظام والـ CRUD',
      sortOrder: 99,
      isActive: true,
    }),
  });
  const catData = await catRes.json();
  if (!catData.success) throw new Error('Create category failed: ' + catData.message);
  const createdCategory = catData.data;
  console.log('✅ 3. Admin created category:', createdCategory.name, `(${createdCategory.slug})`);

  // Step 4: Admin Creates a New Product
  const testProdSlug = `test-product-tent-${Date.now()}`;
  const prodRes = await fetch(`${API_URL}/products/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      categoryId: createdCategory.id,
      name: 'خيمة ملكية خاصة للتجربة',
      slug: testProdSlug,
      shortDescription: 'خيمة مجهزة للاختبار الآلي',
      description: 'وصف تفصيلي للخيمة الملكية مع كامل ملحقات الضيافة والفرش.',
      serviceType: 'RENTAL',
      price: 1200,
      priceType: 'STARTING_FROM',
      availabilityStatus: 'AVAILABLE',
      isFeatured: true,
      isPublished: true,
      images: [
        {
          imagePath: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
          altText: 'صورة الخيمة الرئيسية',
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    }),
  });
  const prodData = await prodRes.json();
  if (!prodData.success) throw new Error('Create product failed: ' + prodData.message);
  const createdProduct = prodData.data;
  console.log('✅ 4. Admin created product:', createdProduct.name, `(${createdProduct.slug})`);

  // Step 5: Public Visitor views category and product
  const publicCatRes = await fetch(`${API_URL}/categories/${testCatSlug}`);
  const publicCatData = await publicCatRes.json();
  if (!publicCatData.success) throw new Error('Public category fetch failed');
  console.log('✅ 5. Visitor viewed dynamic category from API');

  const publicProdRes = await fetch(`${API_URL}/products/${testProdSlug}`);
  const publicProdData = await publicProdRes.json();
  if (!publicProdData.success || !publicProdData.data) throw new Error('Public product fetch failed');
  console.log('✅ 6. Visitor viewed dynamic product detail:', publicProdData.data.name);

  // Step 6: Public Visitor submits Booking Request
  const bookingRes = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'سلطان القحطاني',
      phone: '0555998877',
      eventType: 'حفل زفاف',
      eventDate: '2026-09-15',
      rentalStartDate: '2026-09-15',
      rentalEndDate: '2026-09-16',
      notes: 'الموقع: قاعة الاحتفالات الخارجية، التوصيل صباحاً',
      items: [
        {
          productId: createdProduct.id,
          productName: createdProduct.name,
          quantity: 2,
          notes: 'مع التركيب والفرش',
        },
      ],
    }),
  });
  const bookingData = await bookingRes.json();
  if (!bookingData.success) throw new Error('Submit booking failed: ' + bookingData.message);
  const bookingNumber = bookingData.data.bookingNumber;
  console.log('✅ 7. Visitor submitted booking request:', bookingNumber, 'Status:', bookingData.data.status);

  // Step 7: Admin Lists Bookings and Finds the New Booking
  const adminBookingsRes = await fetch(`${API_URL}/bookings/admin/all?search=${bookingNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const adminBookingsData = await adminBookingsRes.json();
  if (!adminBookingsData.success || adminBookingsData.data.length === 0) {
    throw new Error('Admin could not find the new booking');
  }
  const foundBooking = adminBookingsData.data[0];
  console.log('✅ 8. Admin reviewed booking in Dashboard:', foundBooking.bookingNumber, 'Customer:', foundBooking.customerName);

  // Step 8: Admin Confirms the Booking
  const updateStatusRes = await fetch(`${API_URL}/bookings/admin/${foundBooking.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: 'CONFIRMED',
      notes: 'تم الاتصال بالعميل وتأكيد التوفر وموعد التركيب.',
    }),
  });
  const updateStatusData = await updateStatusRes.json();
  if (!updateStatusData.success || updateStatusData.data.status !== 'CONFIRMED') {
    throw new Error('Status update failed');
  }
  console.log('✅ 9. Admin changed booking status to: CONFIRMED');

  // Step 9: Clean up test product and category
  await fetch(`${API_URL}/products/admin/${createdProduct.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  await fetch(`${API_URL}/categories/admin/${createdCategory.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('✅ 10. Cleaned up test data safely');

  console.log('\n====================================================');
  console.log('🎉 ALL END-TO-END ACCEPTANCE TESTS PASSED 100%!');
  console.log('====================================================');
}

runAcceptanceTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

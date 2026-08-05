#!/usr/bin/env node
/**
 * Admin panel verification script — runs against local DB and HTTP endpoints.
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3002';
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://towtruck:towtruck@localhost:5432/tow_truck_service?schema=public';

const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

const results = [];

function pass(name) {
  results.push({ name, ok: true });
  console.log(`✓ ${name}`);
}

function fail(name, error) {
  results.push({ name, ok: false, error: String(error) });
  console.error(`✗ ${name}: ${error}`);
}

async function verifyDatabase() {
  const admin = await prisma.adminUser.findUnique({ where: { email: 'admin@example.com' } });
  if (!admin?.passwordHash) throw new Error('Admin user missing');
  const valid = await bcrypt.compare('ChangeMe123!', admin.passwordHash);
  if (!valid) throw new Error('Admin password hash invalid');
  pass('PostgreSQL: admin user exists with valid password');

  const pricing = await prisma.pricingRule.findFirst({ where: { isActive: true } });
  if (!pricing) throw new Error('No active pricing rule');
  pass('PostgreSQL: pricing rule persisted');

  const vehicles = await prisma.vehicleCategory.count();
  if (vehicles < 1) throw new Error('No vehicle categories');
  pass('PostgreSQL: vehicle categories persisted');

  const extras = await prisma.extraService.count();
  if (extras < 1) throw new Error('No extra services');
  pass('PostgreSQL: extra services persisted');

  const faq = await prisma.faqItem.count();
  if (faq < 1) throw new Error('No FAQ items');
  pass('PostgreSQL: FAQ items persisted');

  const reviews = await prisma.testimonial.count();
  if (reviews < 1) throw new Error('No testimonials');
  pass('PostgreSQL: testimonials persisted');

  const hero = await prisma.heroImage.count();
  if (hero < 1) throw new Error('No hero images');
  pass('PostgreSQL: hero images persisted');

  const settings = await prisma.setting.count({ where: { group: 'seo' } });
  if (settings < 1) throw new Error('No SEO settings');
  pass('PostgreSQL: SEO settings persisted');
}

async function verifyCrudPersistence() {
  const testSlug = `verify_${Date.now()}`;
  const created = await prisma.vehicleCategory.create({
    data: {
      slug: testSlug,
      label: 'Verify Vehicle',
      perKmRate: 99,
      flatSurcharge: 0,
      sortOrder: 999,
      isActive: true,
    },
  });

  const read = await prisma.vehicleCategory.findUnique({ where: { id: created.id } });
  if (!read || read.label !== 'Verify Vehicle') throw new Error('Vehicle CRUD read failed');

  await prisma.vehicleCategory.update({
    where: { id: created.id },
    data: { label: 'Verify Vehicle Updated' },
  });

  const updated = await prisma.vehicleCategory.findUnique({ where: { id: created.id } });
  if (updated?.label !== 'Verify Vehicle Updated') throw new Error('Vehicle CRUD update failed');

  await prisma.vehicleCategory.delete({ where: { id: created.id } });
  const deleted = await prisma.vehicleCategory.findUnique({ where: { id: created.id } });
  if (deleted) throw new Error('Vehicle CRUD delete failed');
  pass('CRUD: vehicle types create/read/update/delete');

  const faq = await prisma.faqItem.create({
    data: { question: 'Verify Q?', answer: 'Verify A.', sortOrder: 999, isActive: true },
  });
  await prisma.faqItem.delete({ where: { id: faq.id } });
  pass('CRUD: FAQ create/delete');

  const review = await prisma.testimonial.create({
    data: {
      initials: 'VR',
      avatarGradient: 'from-sky-500/40 to-blue-600/30',
      name: 'Verify',
      city: 'Test',
      review: 'Verify review',
      serviceType: 'Test',
      sortOrder: 999,
      isActive: true,
    },
  });
  await prisma.testimonial.delete({ where: { id: review.id } });
  pass('CRUD: reviews create/delete');

  await prisma.setting.upsert({
    where: { key: 'seo.title' },
    create: { key: 'seo.title', value: 'Verify Title', type: 'STRING', group: 'seo' },
    update: { value: 'Verify Title Updated' },
  });
  const seo = await prisma.setting.findUnique({ where: { key: 'seo.title' } });
  if (seo?.value !== 'Verify Title Updated') throw new Error('SEO save failed');
  await prisma.setting.update({
    where: { key: 'seo.title' },
    data: { value: 'Евакуатор — Швидкий виклик 24/7' },
  });
  pass('CRUD: SEO settings save');
}

async function verifyHttpRoutes() {
  const jar = new Map();

  function storeCookies(response) {
    const raw = response.headers.getSetCookie?.() ?? [];
    const fallback = response.headers.get('set-cookie');
    const cookies = raw.length > 0 ? raw : fallback ? [fallback] : [];
    for (const cookie of cookies) {
      const [pair] = cookie.split(';');
      const [name, value] = pair.split('=');
      if (name && value) jar.set(name.trim(), value.trim());
    }
  }

  function cookieHeader() {
    return Array.from(jar.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  const loginPage = await fetch(`${BASE_URL}/login`);
  if (!loginPage.ok) throw new Error(`Login page ${loginPage.status}`);
  const loginHtml = await loginPage.text();
  if (!loginHtml.includes('Вхід в адмін-панель')) throw new Error('Login page content missing');
  pass('HTTP: login page loads');

  const dashboard = await fetch(`${BASE_URL}/admin/dashboard`, { redirect: 'manual' });
  if (dashboard.status !== 307 && dashboard.status !== 302) {
    throw new Error(`Dashboard should redirect unauthenticated, got ${dashboard.status}`);
  }
  pass('HTTP: dashboard protected (redirects to login)');

  const home = await fetch(`${BASE_URL}/`);
  if (!home.ok) throw new Error(`Homepage ${home.status}`);
  pass('HTTP: homepage loads');

  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`, {
    headers: cookieHeader() ? { Cookie: cookieHeader() } : undefined,
  });
  if (!csrfRes.ok) throw new Error(`CSRF endpoint ${csrfRes.status}`);
  storeCookies(csrfRes);
  const { csrfToken } = await csrfRes.json();

  const signInRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(cookieHeader() ? { Cookie: cookieHeader() } : {}),
    },
    body: new URLSearchParams({
      csrfToken,
      email: 'admin@example.com',
      password: 'ChangeMe123!',
      callbackUrl: `${BASE_URL}/admin/dashboard`,
      json: 'true',
    }),
    redirect: 'manual',
  });

  storeCookies(signInRes);

  const hasSession = Array.from(jar.keys()).some(
    (name) => name.includes('session-token') || name.includes('authjs'),
  );
  if (!hasSession && signInRes.status >= 400) {
    const location = signInRes.headers.get('location') || '';
    throw new Error(`Login failed (${signInRes.status}) redirect=${location}`);
  }
  if (!hasSession) {
    throw new Error('Login did not return session cookie');
  }
  pass('HTTP: login works (session cookie issued)');

  const authHeaders = { Cookie: cookieHeader() };
  const adminDash = await fetch(`${BASE_URL}/admin/dashboard`, { headers: authHeaders });
  if (!adminDash.ok) throw new Error(`Authenticated dashboard ${adminDash.status}`);
  const dashHtml = await adminDash.text();
  if (!dashHtml.includes('Панель керування')) throw new Error('Dashboard content missing');
  pass('HTTP: dashboard loads when authenticated');

  for (const path of [
    '/admin/pricing',
    '/admin/contacts',
    '/admin/reviews',
    '/admin/faq',
    '/admin/vehicle-types',
    '/admin/extra-services',
    '/admin/seo',
    '/admin/hero',
    '/admin/service-areas',
  ]) {
    const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders });
    if (!res.ok) throw new Error(`${path} returned ${res.status}`);
    pass(`HTTP: ${path} loads`);
  }

  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const bytes = Buffer.from(pngBase64, 'base64');
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: 'image/png' }), 'verify.png');

  const uploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: 'POST',
    headers: authHeaders,
    body: form,
  });
  if (!uploadRes.ok) throw new Error(`Upload API ${uploadRes.status}`);
  const uploadJson = await uploadRes.json();
  if (!uploadJson.url?.startsWith('/uploads/')) throw new Error('Upload URL missing');
  pass('HTTP: image upload API works');
}

async function verifyUploadDir() {
  const { existsSync, writeFileSync, unlinkSync, mkdirSync } = await import('fs');
  const { join } = await import('path');
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
  const testFile = join(uploadDir, '.verify-upload');
  writeFileSync(testFile, 'ok');
  if (!existsSync(testFile)) throw new Error('Upload directory not writable');
  unlinkSync(testFile);
  pass('Filesystem: uploads directory writable');
}

async function main() {
  console.log(`Verifying admin panel at ${BASE_URL}\n`);

  try {
    await verifyDatabase();
    await verifyCrudPersistence();
    await verifyUploadDir();
    await verifyHttpRoutes();
  } catch (error) {
    fail('verification', error);
  } finally {
    await prisma.$disconnect();
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${results.length} checks passed.`);
}

main();

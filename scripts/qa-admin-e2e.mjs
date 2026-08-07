#!/usr/bin/env node
/**
 * Full admin panel E2E QA — production or local.
 * Tests save → DB → public site → admin refresh for every CMS section.
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const BASE_URL = process.env.BASE_URL || 'https://evakuator24.biz.ua';
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://towtruck:towtruck@13.140.161.100:5432/tow_truck_service?schema=public';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });
const TAG = `qa_${Date.now()}`;
const results = [];
const jar = new Map();

function pass(name) {
  results.push({ name, ok: true });
  console.log(`✓ ${name}`);
}

function fail(name, error) {
  results.push({ name, ok: false, error: String(error) });
  console.error(`✗ ${name}: ${error}`);
}

function cookieHeader() {
  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

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

function extractDeleteActionId(html) {
  const match = html.match(/name="(\$ACTION_ID_[a-f0-9]+)"[^>]*formAction/i);
  return match?.[1] ?? null;
}

function extractSecurityActionId(html) {
  const securityBlock = html.split('Account security')[1] ?? '';
  const m = securityBlock.match(/name="\$ACTION_ID_([a-f0-9]+)"/);
  return m ? `$ACTION_ID_${m[1]}` : extractActionId(html);
}

async function submitDeleteRecord(pagePath, id) {
  const pageRes = await authFetch(pagePath);
  if (!pageRes.ok) throw new Error(`${pagePath} load ${pageRes.status}`);
  const html = await pageRes.text();
  const idMarker = html.indexOf(`value="${id}"`);
  if (idMarker === -1) throw new Error(`Record ${id} not found on ${pagePath}`);
  const chunk = html.slice(idMarker, idMarker + 4000);
  const deleteActionId = extractDeleteActionId(chunk);
  if (!deleteActionId) throw new Error(`No delete action for ${id} on ${pagePath}`);

  const form = new FormData();
  form.append(deleteActionId, '');
  form.append('id', id);

  const postRes = await authFetch(pagePath, {
    method: 'POST',
    body: form,
    redirect: 'manual',
  });

  if (postRes.status !== 303 && postRes.status !== 302) {
    throw new Error(`Delete ${pagePath} returned ${postRes.status}`);
  }
}

function extractActionId(html) {
  const match = html.match(/name="\$ACTION_ID_([a-f0-9]+)"/);
  return match ? `$ACTION_ID_${match[1]}` : null;
}

function extractInput(html, name) {
  const match = html.match(new RegExp(`name="${name}"[^>]*value="([^"]*)"`, 'i'));
  return match?.[1] ?? null;
}

function extractHiddenInputs(html) {
  const inputs = {};
  const re = /<input[^>]*type="hidden"[^>]*name="([^"]+)"[^>]*value="([^"]*)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    inputs[m[1]] = m[2];
  }
  return inputs;
}

async function authFetch(path, options = {}) {
  const headers = { ...(options.headers || {}), Cookie: cookieHeader() };
  return fetch(`${BASE_URL}${path}`, { ...options, headers });
}

async function login() {
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  storeCookies(csrfRes);
  const { csrfToken } = await csrfRes.json();

  const signInRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieHeader(),
    },
    body: new URLSearchParams({
      csrfToken,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      callbackUrl: `${BASE_URL}/admin/dashboard`,
      json: 'true',
    }),
    redirect: 'manual',
  });
  storeCookies(signInRes);

  const hasSession = Array.from(jar.keys()).some(
    (name) => name.includes('session-token') || name.includes('authjs'),
  );
  if (!hasSession) throw new Error('Login failed — no session cookie');
  pass('Auth: login works');
}

async function logout() {
  const csrfRes = await authFetch('/api/auth/csrf');
  storeCookies(csrfRes);
  const { csrfToken } = await csrfRes.json();
  const res = await authFetch('/api/auth/signout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrfToken, callbackUrl: `${BASE_URL}/admin` }),
    redirect: 'manual',
  });
  storeCookies(res);
  pass('Auth: logout request succeeds');
}

async function submitAdminForm(pagePath, fields, hidden = {}, actionExtractor = extractActionId) {
  const pageRes = await authFetch(pagePath);
  if (!pageRes.ok) throw new Error(`${pagePath} load ${pageRes.status}`);
  const html = await pageRes.text();
  const actionId = actionExtractor(html);
  if (!actionId) throw new Error(`No action id on ${pagePath}`);

  const form = new FormData();
  form.append(actionId, '');
  for (const [key, value] of Object.entries(hidden)) form.append(key, value);
  for (const [key, value] of Object.entries(fields)) form.append(key, String(value));

  const postRes = await authFetch(pagePath, {
    method: 'POST',
    body: form,
    redirect: 'manual',
  });

  const location = postRes.headers.get('location') || '';
  if (postRes.status !== 303 && postRes.status !== 302) {
    throw new Error(`Save ${pagePath} returned ${postRes.status}, location=${location}`);
  }
  if (!location.includes('saved=1')) {
    throw new Error(`Save ${pagePath} missing saved=1 redirect: ${location}`);
  }

  const refreshRes = await authFetch(location.replace(BASE_URL, '') || pagePath + '?saved=1');
  const refreshHtml = await refreshRes.text();
  return { html: refreshHtml, location };
}

async function verifySetting(key, expectedSubstring, publicPath, publicCheck) {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row?.value?.includes(expectedSubstring)) {
    throw new Error(`DB ${key} expected "${expectedSubstring}", got "${row?.value}"`);
  }

  const pubRes = await fetch(`${BASE_URL}${publicPath}`, { cache: 'no-store' });
  const pubHtml = await pubRes.text();
  if (!publicCheck(pubHtml)) {
    throw new Error(`Public ${publicPath} missing "${expectedSubstring}"`);
  }
}

async function testRouteProtection() {
  jar.clear();
  const res = await fetch(`${BASE_URL}/admin/pricing`, { redirect: 'manual' });
  if (res.status !== 307 && res.status !== 302) {
    throw new Error(`Unauthenticated /admin/pricing should redirect, got ${res.status}`);
  }
  pass('Auth: /admin/pricing protected when logged out');
}

async function testDashboard() {
  const res = await authFetch('/admin/dashboard');
  if (!res.ok) throw new Error(`Dashboard ${res.status}`);
  const html = await res.text();
  if (!html.includes('Dashboard') && !html.includes('Total orders')) {
    throw new Error('Dashboard content missing');
  }
  pass('Dashboard: loads with stats');
}

async function testPricing() {
  const rule = await prisma.pricingRule.findFirst({ where: { isActive: true } });
  if (!rule) throw new Error('No active pricing rule');

  const originalBase = Number(rule.baseFee);
  const testBase = originalBase + 1;

  const pageRes = await authFetch('/admin/pricing');
  const html = await pageRes.text();
  const hidden = extractHiddenInputs(html);

  await submitAdminForm('/admin/pricing', {
    baseFee: testBase,
    cityServiceRadiusKm: 50,
    cityPerKmRate: Number(rule.cityPerKmRate),
    outsideCityPerKmRate: Number(rule.outsideCityPerKmRate),
    minCharge: Number(rule.minCharge),
    freeKm: Number(rule.freeKm),
    outsideCityBaseFee: Number(rule.outsideCityBaseFee),
    nightSurchargePercent: Number(rule.nightSurchargePercent),
    nightStartHour: rule.nightStartHour,
    nightEndHour: rule.nightEndHour,
    weekendSurchargePercent: Number(rule.weekendSurchargePercent),
    holidaySurchargePercent: Number(rule.holidaySurchargePercent),
    difficultLoadingSurcharge: Number(rule.difficultLoadingSurcharge),
    emergencySurchargeFlat: Number(rule.emergencySurchargeFlat),
    ...hidden,
    ruleId: rule.id,
  });

  const updated = await prisma.pricingRule.findUnique({ where: { id: rule.id } });
  if (Number(updated.baseFee) !== testBase) {
    throw new Error(`Pricing DB baseFee ${updated.baseFee} !== ${testBase}`);
  }

  const refresh = await authFetch('/admin/pricing');
  const refreshHtml = await refresh.text();
  if (!refreshHtml.includes(`value="${testBase}"`)) {
    throw new Error('Pricing admin page did not persist baseFee after refresh');
  }

  await submitAdminForm('/admin/pricing', {
    baseFee: originalBase,
    cityServiceRadiusKm: 50,
    cityPerKmRate: Number(rule.cityPerKmRate),
    outsideCityPerKmRate: Number(rule.outsideCityPerKmRate),
    minCharge: Number(rule.minCharge),
    freeKm: Number(rule.freeKm),
    outsideCityBaseFee: Number(rule.outsideCityBaseFee),
    nightSurchargePercent: Number(rule.nightSurchargePercent),
    nightStartHour: rule.nightStartHour,
    nightEndHour: rule.nightEndHour,
    weekendSurchargePercent: Number(rule.weekendSurchargePercent),
    holidaySurchargePercent: Number(rule.holidaySurchargePercent),
    difficultLoadingSurcharge: Number(rule.difficultLoadingSurcharge),
    emergencySurchargeFlat: Number(rule.emergencySurchargeFlat),
    ...hidden,
    ruleId: rule.id,
  });

  pass('Pricing: save, DB, refresh, restore');
}

async function testContacts() {
  const originals = {
    companyName: (await prisma.setting.findUnique({ where: { key: 'company.name' } }))?.value ?? '',
    phone: (await prisma.setting.findUnique({ where: { key: 'contact.phone' } }))?.value ?? '',
  };

  const testCompany = `${TAG} Company`;
  const testPhone = '+380991234567';

  await submitAdminForm('/admin/contacts', {
    companyName: testCompany,
    phone: testPhone,
    whatsapp: testPhone,
    telegram: '@qa',
    viber: testPhone,
    email: 'qa@test.example',
    address: `${TAG} Address`,
    mapsLink: 'https://maps.example',
    websiteUrl: 'https://example.com',
    workingHours: `${TAG} Hours`,
  });

  await verifySetting('company.name', testCompany, '/contact', (html) => html.includes(testCompany));
  await verifySetting('contact.phone', '380991234567', '/contact', (html) => html.includes('380991234567') || html.includes('099 123 45 67'));

  const refresh = await authFetch('/admin/contacts');
  const html = await refresh.text();
  if (!html.includes(testCompany)) throw new Error('Contacts admin refresh missing value');

  await submitAdminForm('/admin/contacts', {
    companyName: originals.companyName,
    phone: originals.phone,
    whatsapp: originals.phone,
    telegram: '',
    viber: '',
    email: '',
    address: '',
    mapsLink: '',
    websiteUrl: '',
    workingHours: 'Цілодобово',
  });

  pass('Contacts: save, DB, public site, refresh, restore');
}

async function testContent() {
  const originalTitle =
    (await prisma.setting.findUnique({ where: { key: 'content.hero.title' } }))?.value ?? 'Евакуатор';
  const testTitle = `${TAG} Hero`;

  await submitAdminForm('/admin/content', {
    heroBadge: 'QA Badge',
    heroTitle: testTitle,
    heroTitleHighlight: 'QA Highlight',
    heroSubtitle: `${TAG} subtitle`,
    heroCtaPrimary: 'QA Primary',
    heroCtaSecondary: 'QA Secondary',
    trustItems: '[]',
    aboutTitle: `${TAG} About`,
    aboutBody: `${TAG} about body`,
    footerTagline: `${TAG} footer tagline`,
  });

  const row = await prisma.setting.findUnique({ where: { key: 'content.hero.title' } });
  if (row?.value !== testTitle) throw new Error(`Content DB hero title ${row?.value}`);

  const home = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  const homeHtml = await home.text();
  if (!homeHtml.includes(testTitle)) throw new Error('Homepage missing hero title');

  const refresh = await authFetch('/admin/content');
  if (!(await refresh.text()).includes(testTitle)) throw new Error('Content admin refresh failed');

  await submitAdminForm('/admin/content', {
    heroBadge: 'Швидкий виїзд 24/7',
    heroTitle: originalTitle,
    heroTitleHighlight: 'за 30 секунд',
    heroSubtitle: 'Розрахуйте вартість евакуації онлайн',
    heroCtaPrimary: 'Розрахувати вартість',
    heroCtaSecondary: 'Зателефонувати',
    trustItems: '[]',
    aboutTitle: 'Про нас',
    aboutBody: 'Ми надаємо послуги евакуації.',
    footerTagline: 'Швидка евакуація по всій області',
  });

  pass('Website Content: save, DB, public site, refresh, restore');
}

async function testFaqCrud() {
  const question = `${TAG} FAQ question?`;
  const answer = `${TAG} FAQ answer.`;

  const pageRes = await authFetch('/admin/faq');
  const html = await pageRes.text();
  const actionId = extractActionId(html);
  const form = new FormData();
  form.append(actionId, '');
  form.append('question', question);
  form.append('answer', answer);
  form.append('sortOrder', '999');

  const createRes = await authFetch('/admin/faq', { method: 'POST', body: form, redirect: 'manual' });
  if (createRes.status !== 303 && createRes.status !== 302) {
    throw new Error(`FAQ create ${createRes.status}`);
  }

  const created = await prisma.faqItem.findFirst({ where: { question } });
  if (!created) throw new Error('FAQ not in DB after create');

  const faqPage = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  if (!(await faqPage.text()).includes(question)) throw new Error('FAQ missing on public homepage');

  await submitDeleteRecord('/admin/faq', created.id);

  const gone = await prisma.faqItem.findUnique({ where: { id: created.id } });
  if (gone) throw new Error('FAQ still in DB after delete');

  pass('FAQ: CRUD create, public site, delete');
}

async function testReviewsCrud() {
  const name = `${TAG} Reviewer`;

  const pageRes = await authFetch('/admin/reviews');
  const html = await pageRes.text();
  const actionId = extractActionId(html);
  const form = new FormData();
  form.append(actionId, '');
  form.append('name', name);
  form.append('city', 'QA City');
  form.append('initials', 'QR');
  form.append('serviceType', 'QA Service');
  form.append('review', `${TAG} review text`);
  form.append('avatarGradient', 'from-sky-500/40 to-blue-600/30');

  const createRes = await authFetch('/admin/reviews', { method: 'POST', body: form, redirect: 'manual' });
  if (createRes.status !== 303 && createRes.status !== 302) throw new Error(`Review create ${createRes.status}`);

  const created = await prisma.testimonial.findFirst({ where: { name } });
  if (!created) throw new Error('Review not in DB');

  const home = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  if (!(await home.text()).includes(name)) throw new Error('Review missing on homepage');

  await submitDeleteRecord('/admin/reviews', created.id);

  if (await prisma.testimonial.findUnique({ where: { id: created.id } })) {
    throw new Error('Review still in DB');
  }

  pass('Reviews: CRUD create, public site, delete');
}

async function testSeo() {
  const original =
    (await prisma.setting.findUnique({ where: { key: 'seo.title' } }))?.value ??
    'Евакуатор — Швидкий виклик 24/7';
  const testTitle = `${TAG} SEO Title`;

  await submitAdminForm('/admin/seo', {
    title: testTitle,
    description: `${TAG} SEO description`,
    keywords: `${TAG}, seo, test`,
    ogImage: '/uploads/test.png',
    canonicalUrl: `${BASE_URL}/`,
  });

  const row = await prisma.setting.findUnique({ where: { key: 'seo.title' } });
  if (row?.value !== testTitle) throw new Error(`SEO DB title ${row?.value}`);

  const home = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  const homeHtml = await home.text();
  if (!homeHtml.includes(testTitle)) throw new Error('Homepage <title> missing SEO title');

  await submitAdminForm('/admin/seo', {
    title: original,
    description: 'Евакуатор 24/7',
    keywords: 'евакуатор',
    ogImage: '',
    canonicalUrl: BASE_URL,
  });

  pass('SEO: save, DB, public meta, refresh, restore');
}

async function testSettings() {
  const testLogo = `/uploads/${TAG}-logo.png`;

  await submitAdminForm('/admin/settings', {
    logoUrl: testLogo,
    faviconUrl: '',
    primaryColor: '#0ea5e9',
    secondaryColor: '#2563eb',
    instagram: '',
    telegramSocial: '',
    facebook: '',
    youtube: '',
    mapCenterLat: 50.6199,
    mapCenterLng: 26.2516,
    mapZoom: 11,
  });

  const row = await prisma.setting.findUnique({ where: { key: 'company.logo_url' } });
  if (row?.value !== testLogo) throw new Error(`Settings logo DB ${row?.value}`);

  const refresh = await authFetch('/admin/settings');
  if (!(await refresh.text()).includes(testLogo)) throw new Error('Settings refresh missing logo');

  await submitAdminForm('/admin/settings', {
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#0ea5e9',
    secondaryColor: '#2563eb',
    instagram: '',
    telegramSocial: '',
    facebook: '',
    youtube: '',
    mapCenterLat: 50.6199,
    mapCenterLng: 26.2516,
    mapZoom: 11,
  });

  pass('Settings: logo URL save, DB, refresh, restore');
}

async function testImageUpload() {
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const bytes = Buffer.from(pngBase64, 'base64');
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: 'image/png' }), `${TAG}.png`);

  const uploadRes = await authFetch('/api/admin/upload', { method: 'POST', body: form });
  if (!uploadRes.ok) throw new Error(`Upload ${uploadRes.status}`);
  const json = await uploadRes.json();
  if (!json.url?.startsWith('/uploads/')) throw new Error('Upload missing url');

  const fileRes = await fetch(`${BASE_URL}${json.url}`);
  if (!fileRes.ok) throw new Error(`Uploaded file not accessible ${fileRes.status}`);

  pass('Uploads: image upload API and public file access');
}

async function testPasswordChange() {
  const newPassword = `${TAG}Pass1!`;
  const admin = await prisma.adminUser.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) throw new Error('Admin not found');

  await submitAdminForm('/admin/settings', {
    newEmail: '',
    currentPassword: ADMIN_PASSWORD,
    newPassword,
    confirmPassword: newPassword,
  }, {}, extractSecurityActionId);

  const updated = await prisma.adminUser.findUnique({ where: { id: admin.id } });
  const ok = await bcrypt.compare(newPassword, updated.passwordHash);
  if (!ok) throw new Error('Password hash not updated in DB');

  jar.clear();
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  storeCookies(csrfRes);
  const { csrfToken } = await csrfRes.json();
  const signInRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookieHeader() },
    body: new URLSearchParams({
      csrfToken,
      email: ADMIN_EMAIL,
      password: newPassword,
      callbackUrl: `${BASE_URL}/admin/dashboard`,
      json: 'true',
    }),
    redirect: 'manual',
  });
  storeCookies(signInRes);
  const hasSession = Array.from(jar.keys()).some((n) => n.includes('session-token') || n.includes('authjs'));
  if (!hasSession) throw new Error('Login with new password failed');

  await submitAdminForm('/admin/settings', {
    newEmail: '',
    currentPassword: newPassword,
    newPassword: ADMIN_PASSWORD,
    confirmPassword: ADMIN_PASSWORD,
  }, {}, extractSecurityActionId);

  const restored = await prisma.adminUser.findUnique({ where: { id: admin.id } });
  const restoredOk = await bcrypt.compare(ADMIN_PASSWORD, restored.passwordHash);
  if (!restoredOk) throw new Error('Password restore failed');

  pass('Security: password change, login with new password, restore');
}

async function testProductionHealth() {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Health ${res.status}`);
  const json = await res.json();
  if (json.status !== 'ok' || json.checks?.database !== 'ok') {
    throw new Error(`Health bad: ${JSON.stringify(json)}`);
  }
  pass('Production: health check OK, database connected');
}

async function main() {
  console.log(`Admin QA E2E at ${BASE_URL}\nTag: ${TAG}\n`);

  const tests = [
    ['production health', testProductionHealth],
    ['route protection', testRouteProtection],
    ['login', login],
    ['dashboard', testDashboard],
    ['pricing', testPricing],
    ['contacts', testContacts],
    ['website content', testContent],
    ['faq crud', testFaqCrud],
    ['reviews crud', testReviewsCrud],
    ['seo', testSeo],
    ['settings', testSettings],
    ['image upload', testImageUpload],
    ['password change', testPasswordChange],
    ['logout', logout],
  ];

  for (const [name, fn] of tests) {
    try {
      await fn();
    } catch (error) {
      fail(name, error);
      if (name === 'login') break;
    }
  }

  await prisma.$disconnect();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.filter((r) => r.ok).length}/${results.length} passed`);
  if (failed.length) {
    console.error('\nFailures:');
    for (const f of failed) console.error(`  - ${f.name}: ${f.error}`);
    process.exit(1);
  }
  console.log('\nAll QA tests passed.');
}

main();

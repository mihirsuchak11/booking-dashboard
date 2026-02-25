/**
 * Test script to manually trigger email sends
 * 
 * Usage:
 *   npx tsx scripts/test-emails.ts [nudge7d|nudge1d|welcome|invoice|expired|all]
 * 
 * Make sure you have:
 *   - RESEND_API_KEY set in .env
 *   - A valid user_id in your database (TEST_USER_ID in .env)
 */

import "dotenv/config";

import { 
  sendWelcomeEmail, 
  sendInvoiceEmail, 
  sendNudge7dEmail, 
  sendNudge1dEmail, 
  sendExpiredEmail 
} from '../lib/email';

// ⚠️ UPDATE THIS with a real user_id from your database
const TEST_USER_ID = process.env.TEST_USER_ID || 'your-user-id-here';

async function testWelcomeEmail() {
  console.log('\n📧 Testing Welcome Email...');
  const result = await sendWelcomeEmail({
    userId: TEST_USER_ID,
    userName: 'Test User',
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com',
  });
  console.log('Result:', result);
}

async function testInvoiceEmail() {
  console.log('\n💰 Testing Invoice Email...');
  const result = await sendInvoiceEmail({
    userId: TEST_USER_ID,
    amount: 2999, // $29.99 in cents
    currency: 'usd',
    planName: 'Pro Plan',
    invoiceUrl: 'https://invoice.stripe.com/test-invoice',
    date: new Date().toISOString(),
  });
  console.log('Result:', result);
}

async function testNudge7dEmail() {
  console.log('\n⏰ Testing 7-Day Nudge Email...');
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 7);
  
  const result = await sendNudge7dEmail({
    userId: TEST_USER_ID,
    userName: 'Test User',
    planName: 'Pro Plan',
    renewalDate: renewalDate.toISOString(),
    billingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com'}/settings?tab=subscription`,
  });
  console.log('Result:', result);
}

async function testNudge1dEmail() {
  console.log('\n⏰ Testing 1-Day Nudge Email...');
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 1);
  
  const result = await sendNudge1dEmail({
    userId: TEST_USER_ID,
    userName: 'Test User',
    planName: 'Pro Plan',
    renewalDate: renewalDate.toISOString(),
    billingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com'}/settings?tab=subscription`,
  });
  console.log('Result:', result);
}

async function testExpiredEmail() {
  console.log('\n❌ Testing Expired Email...');
  const result = await sendExpiredEmail({
    userId: TEST_USER_ID,
    userName: 'Test User',
    planName: 'Pro Plan',
    renewalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com'}/settings?tab=subscription`,
  });
  console.log('Result:', result);
}

async function runAllTests() {
  console.log('🚀 Starting Email Tests...');
  console.log(`Using TEST_USER_ID: ${TEST_USER_ID}`);
  
  if (TEST_USER_ID === 'your-user-id-here') {
    console.error('\n❌ ERROR: Please set TEST_USER_ID in .env or update the script');
    console.error('   Example: TEST_USER_ID=123e4567-e89b-12d3-a456-426614174000');
    process.exit(1);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('\n❌ ERROR: RESEND_API_KEY not found in environment');
    process.exit(1);
  }

  try {
    await testWelcomeEmail();
    await testInvoiceEmail();
    await testNudge7dEmail();
    await testNudge1dEmail();
    await testExpiredEmail();
    
    console.log('\n✅ All email tests completed!');
    console.log('📬 Check your email inbox (and spam folder) for the test emails.');
  } catch (error) {
    console.error('\n❌ Error running tests:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  const arg = process.argv[2]?.toLowerCase() || 'all';
  const validTests = ['welcome', 'invoice', 'nudge7d', 'nudge1d', 'expired', 'all'];
  if (!validTests.includes(arg)) {
    console.log('Usage: npx tsx scripts/test-emails.ts [test-name]');
    console.log('  test-name: welcome | invoice | nudge7d | nudge1d | expired | all');
    console.log('  (omit for "all")');
    process.exit(1);
  }
  (async () => {
    console.log('🚀 Starting Email Test...');
    console.log(`Using TEST_USER_ID: ${TEST_USER_ID}`);
    if (TEST_USER_ID === 'your-user-id-here') {
      console.error('\n❌ ERROR: Please set TEST_USER_ID in .env or update the script');
      process.exit(1);
    }
    if (!process.env.RESEND_API_KEY) {
      console.error('\n❌ ERROR: RESEND_API_KEY not found in environment');
      process.exit(1);
    }
    try {
      if (arg === 'welcome') await testWelcomeEmail();
      else if (arg === 'invoice') await testInvoiceEmail();
      else if (arg === 'nudge7d') await testNudge7dEmail();
      else if (arg === 'nudge1d') await testNudge1dEmail();
      else if (arg === 'expired') await testExpiredEmail();
      else await runAllTests();
      console.log('\n✅ Test completed! Check your inbox (and spam).');
    } catch (error) {
      console.error('\n❌ Error:', error);
      process.exit(1);
    }
  })();
}

export { runAllTests };

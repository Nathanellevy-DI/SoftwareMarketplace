import { Resend } from 'resend';
import fs from 'fs';

async function test() {
  console.log("🚀 Starting Project-Level Resend Debugger...");
  
  try {
    // Manually parse .env.local
    const env = fs.readFileSync('.env.local', 'utf8');
    const apiKeyMatch = env.match(/RESEND_API_KEY=["']?([^"'\n]+)["']?/);
    const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;

    if (!apiKey) {
      console.error("❌ Could not find RESEND_API_KEY in .env.local");
      return;
    }

    console.log(`🔑 Using Key starts with: ${apiKey.slice(0, 10)}...`);
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'nathanellevydi@gmail.com',
      subject: 'Project Debugger: Frame & Focus',
      html: '<h1 style="color: black;">DEBUGGER SUCCESSFUL</h1><p>Your Resend integration is working perfectly from within the project environment.</p>'
    });

    if (error) {
      console.error("❌ Resend API Error:", JSON.stringify(error, null, 2));
    } else {
      console.log("✅ SUCCESS! Email sent successfully.");
      console.log("📧 Email ID:", data?.id);
    }
  } catch (e) {
    console.error("💥 Fatal Error during debug:", e);
  }
}

test();

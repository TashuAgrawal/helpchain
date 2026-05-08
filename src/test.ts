import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import sendOtpEmail  from "./app/lib/sendEmail";

async function testSendEmail() {
  const receiverEmail = "dipudash.2003@gmail.com";
  const code = "123456";

  const result = await sendOtpEmail(receiverEmail, code);

  console.log(result);
}

testSendEmail();
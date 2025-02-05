// import { smsSenderId, smsApiKey, smsTemplateId } from "../config";

// async function sendSMS(phone: string, otp: number) {
 
//     const msg = `Your TNCDW-IMS Login Verification Code is ${otp} valid for 5 Mins - KLABS`;
//     const uri = `https://powerstext.in/sms-panel/api/http/index.php?username=IndiaklabssOTP&apikey=${smsApiKey}&apirequest=Text&sender=${smsSenderId}&route=OTP&format=JSON&message=${encodeURIComponent(msg)}&mobile=${phone}&TemplateID=${smsTemplateId}`;

//     try {
//         const response = await fetch(uri, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: null,
//         });

//         const responseData = await response.json();
//         console.log(responseData);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// export default sendSMS;

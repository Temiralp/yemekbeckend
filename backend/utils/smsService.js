const nodemailer = require('nodemailer');
const axios = require('axios'); // SMS servisi için axios veya kullandığınız başka bir kütüphane olabilir

// Nodemailer transporter yapılandırması
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rtemir1881@gmail.com', // Gmail adresiniz
    pass: 'wjmuwcwpdqvfrnij'     // Uygulama şifresi
  }
});

// E-posta gönderme fonksiyonu
async function sendEmail(recipientEmail, subject, message) {
  const mailOptions = {
    from: 'rtemir1881@gmail.com', // Gönderen adresi
    to: recipientEmail,           // Alıcı e-posta adresi
    subject: subject,             // E-posta konusu
    text: message                 // E-posta içeriği
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta başarıyla gönderildi: ' + info.response);
    return true;
  } catch (error) {
    console.error('E-posta gönderim hatası: ' + error.message);
    return false;
  }
}

// SMS gönderme fonksiyonu (Örnek olarak axios kullanarak)
async function sendSMS(phone, message) {
  try {
    // Burada SMS API'si çağrılacak. Örneğin Twilio, Nexmo veya başka bir servis.
    // Aşağıdaki kodun sadece örnek olduğunu unutmayın. Kendi SMS sağlayıcınızın API'sini kullanmalısınız.

    const response = await axios.post('SMS_SERVICE_API_URL', {
      to: phone,
      body: message,
      // API'ye göndereceğiniz diğer parametreler
    });

    console.log('SMS başarıyla gönderildi: ', response.data);
    return true;
  } catch (error) {
    console.error('SMS gönderim hatası: ', error.message);
    return false;
  }
}

module.exports = { sendEmail, sendSMS };

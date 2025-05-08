const axios = require('axios');
const crypto = require('crypto');
const smsConfig = require('./smsConfig');
const querystring = require('querystring');

// XML ile SMS gönderimi
async function sendSMS(phone, message) {
  try {
    let formattedPhone = phone.toString().trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = formattedPhone.substring(1);
    }

    const xmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<request>
  <authentication>
    <key>${smsConfig.API_KEY}</key>
    <hash>${smsConfig.API_HASH}</hash>
  </authentication>
  <order>
    <sender>${smsConfig.SMS_SENDER}</sender>
    <message>
      <text><![CDATA[${message}]]></text>
      <receipents>
        <number>${formattedPhone}</number>
      </receipents>
    </message>
  </order>
</request>`;

    const response = await axios.post('https://api.iletimerkezi.com/v1/send-sms', xmlData, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });

    if (response.data && response.data.includes('<code>200</code>')) {
      return true;
    } else {
      const code = response.data.match(/<code>(\d+)<\/code>/)?.[1] || 'bilinmiyor';
      const message = response.data.match(/<message>(.*?)<\/message>/)?.[1] || 'bilinmiyor';
      console.error(`SMS hatası: Kod ${code}, Mesaj: ${message}`);
      return false;
    }
  } catch (error) {
    console.error('SMS gönderim hatası:', error.message);
    return false;
  }
}

// Alternatif olarak URL-encoded form ile gönderim
async function sendSMSFormData(phone, message) {
  try {
    let formattedPhone = phone.toString().trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = formattedPhone.substring(1);
    }

    const formData = {
      key: smsConfig.API_KEY,
      hash: smsConfig.API_HASH,
      text: message,
      receipents: formattedPhone,
      sender: smsConfig.SMS_SENDER,
      iys: '0'
    };

    const response = await axios.post('https://api.iletimerkezi.com/v1/send-sms/get/', 
      querystring.stringify(formData), 
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data && response.data.includes('<code>200</code>')) {
      return true;
    } else {
      const code = response.data.match(/<code>(\d+)<\/code>/)?.[1] || 'bilinmiyor';
      const message = response.data.match(/<message>(.*?)<\/message>/)?.[1] || 'bilinmiyor';
      console.error(`SMS hatası: Kod ${code}, Mesaj: ${message}`);
      return false;
    }
  } catch (error) {
    console.error('SMS gönderim hatası:', error.message);
    return false;
  }
}

// GET yöntemiyle SMS
async function sendSMSWithGet(phone, message) {
  try {
    let formattedPhone = phone.toString().trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = formattedPhone.substring(1);
    }

    const url = `https://api.iletimerkezi.com/v1/send-sms/get/?key=${encodeURIComponent(smsConfig.API_KEY)}&hash=${encodeURIComponent(smsConfig.API_HASH)}&text=${encodeURIComponent(message)}&receipents=${encodeURIComponent(formattedPhone)}&sender=${encodeURIComponent(smsConfig.SMS_SENDER)}&iys=0`;

    const response = await axios.get(url);

    if (response.data && response.data.includes('<code>200</code>')) {
      return true;
    } else {
      const code = response.data.match(/<code>(\d+)<\/code>/)?.[1] || 'bilinmiyor';
      const message = response.data.match(/<message>(.*?)<\/message>/)?.[1] || 'bilinmiyor';
      console.error(`SMS hatası: Kod ${code}, Mesaj: ${message}`);
      return false;
    }
  } catch (error) {
    console.error('SMS gönderim hatası:', error.message);
    return false;
  }
}

// Yeni hash ile gönderim
async function sendSMSWithNewHash(phone, message) {
  try {
    let formattedPhone = phone.toString().trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = formattedPhone.substring(1);
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hashString = smsConfig.API_KEY + smsConfig.API_HASH + timestamp;
    const newHash = crypto.createHash('sha256').update(hashString).digest('hex');

    const formData = {
      key: smsConfig.API_KEY,
      hash: newHash,
      timestamp,
      text: message,
      receipents: formattedPhone,
      sender: smsConfig.SMS_SENDER,
      iys: '0'
    };

    const response = await axios.post('https://api.iletimerkezi.com/v1/send-sms/get/',
      querystring.stringify(formData),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data && response.data.includes('<code>200</code>')) {
      return true;
    } else {
      const code = response.data.match(/<code>(\d+)<\/code>/)?.[1] || 'bilinmiyor';
      const message = response.data.match(/<message>(.*?)<\/message>/)?.[1] || 'bilinmiyor';
      console.error(`SMS hatası: Kod ${code}, Mesaj: ${message}`);
      return false;
    }
  } catch (error) {
    console.error('SMS gönderim hatası:', error.message);
    return false;
  }
}

module.exports = {
  sendSMS,
  sendSMSFormData,
  sendSMSWithGet,
  sendSMSWithNewHash
};

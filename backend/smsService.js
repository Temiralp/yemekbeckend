const axios = require('axios');
const querystring = require('querystring');

// Tüm konfigürasyon burada
const config = {
  API_KEY: '27a9d617c9335ba4b1f000f334e92b66', // API anahtarınız
  API_HASH: '2276903fd62bb5cbeeef0e61c2ea3f719fcc06a5ea2baaf26649ed028d9f5743', // Hash değeriniz
  SMS_SENDER: 'YOREM DONER', // Onaylı başlık
  TEST_PHONE: '5307706809' // Test telefon numarası (başında 0 olmadan)
};

// SMS gönderme fonksiyonu
async function sendTestSMS() {
  const testMessage = `YOREM DONER - API Test Mesajı [${new Date().toLocaleString()}]`;

  const params = {
    key: config.API_KEY,
    hash: config.API_HASH,
    text: testMessage,
    receipents: config.TEST_PHONE,
    sender: config.SMS_SENDER,
    iys: '1',
    iysList: 'BIREYSEL'
  };

  try {
    console.log('⏳ Test SMS gönderiliyor...');
    console.log(`📞 Alıcı: ${config.TEST_PHONE}`);
    console.log(`✉️ Mesaj: ${testMessage}`);

    const response = await axios.get(
      `https://api.iletimerkezi.com/v1/send-sms/get/?${querystring.stringify(params)}`
    );

    if (response.data.includes('<code>200</code>')) {
      console.log('✅ Test SMS başarıyla gönderildi!');
      return true;
    } else {
      const errorMsg = response.data.match(/<message>(.*?)<\/message>/)?.[1] || 'Bilinmeyen hata';
      console.error(`❌ SMS gönderilemedi: ${errorMsg}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Bir hata oluştu:', error.message);
    if (error.response) {
      console.error('Sunucu yanıtı:', error.response.data);
    }
    return false;
  }
}

// Uygulama başlar başlamaz test SMS gönder
sendTestSMS().then(success => {
  if (!success) {
    console.log('🔴 SMS servisi çalışmıyor olabilir, lütfen ayarları kontrol edin');
  }
});

// Fonksiyonu dışa aktar (isteğe bağlı)
module.exports = { sendTestSMS };
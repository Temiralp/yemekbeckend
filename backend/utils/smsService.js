const axios = require('axios');
const smsConfig = require('./smsConfig'); // Dikkat: dosya yolunu kontrol edin

/**
 * İleti Merkezi üzerinden SMS gönderimi yapar
 * @param {string} phone - SMS gönderilecek telefon numarası
 * @param {string} message - Gönderilecek SMS metni
 * @returns {Promise<boolean>} - İşlem başarılı/başarısız
 */
async function sendSMS(phone, message) {
  try {
    // Telefon numarasını formatla (başında 0 olacak şekilde ve karakterleri temizle)
    const formattedPhone = phone.replace(/\D/g, '');
    // Eğer numara 0 ile başlamıyorsa başına 0 ekle
    const phoneNumber = formattedPhone.startsWith('0') ? formattedPhone : `0${formattedPhone}`;
    
    console.log('SMS Gönderim İsteği:', {
      telefon: phoneNumber,
      mesaj: message
    });
    
    const requestData = {
      request: {
        authentication: {
          key: smsConfig.API_KEY,
          hash: smsConfig.API_HASH
        },
        order: {
          sender: smsConfig.SMS_SENDER,
          message: {
            text: message,
            recipients: {
              number: [phoneNumber]
            }
          }
        }
      }
    };
    
    const response = await axios.post('https://api.iletimerkezi.com/v1/send-sms/json', requestData);
    
    console.log('SMS Gönderim Yanıtı:', response.data);
    
    // Başarılı yanıt kontrolü
    if (response.data && response.data.response && response.data.response.status.code === '200') {
      return true;
    } else {
      console.error('SMS Gönderimi Başarısız:', response.data);
      return false;
    }
  } catch (error) {
    console.error('SMS Gönderim Hatası:', error.message);
    if (error.response) {
      console.error('Hata Detayı:', error.response.data);
    }
    return false;
  }
}

// Dikkat: Bu şekilde export etmelisiniz
module.exports = {
  sendSMS
};
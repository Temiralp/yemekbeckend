const axios = require('axios');
const querystring = require('querystring');

// Değiştirmeniz gereken yerler:
const key = '39c0529c5af0b4c43b1ebee1ef9fbe6c'; // API Key
const hash = 'de0b8f7b837e699305f9bbd600de533917f90850f17329236047238b9989995b';             // API Hash
const text = 'Merhaba, bu bir test mesajıdır.'; // Gönderilecek mesaj
const receipents = '5307706809';                // Alıcı numaralar (başında 0 yok, ülke kodu yok)
const sender = 'YOREM DONER';                   // Onaylı başlık
const iys = '1';                                 // İYS zorunluysa 1
const iysList = 'BIREYSEL';                      // BIREYSEL ya da TACIR

const encodedParams = querystring.stringify({
  key,
  hash,
  text,
  receipents,
  sender,
  iys,
  iysList
});

const url = `https://api.iletimerkezi.com/v1/send-sms/get/?${encodedParams}`;

axios.get(url)
  .then(response => {
    console.log('Yanıt:', response.data);
  })
  .catch(error => {
    console.error('Hata:', error.response?.data || error.message);
  });

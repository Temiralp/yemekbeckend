// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const smsService = require('../utils/smsService');

// Tüm SMS gönderme yöntemlerini test etmek için endpoint
router.post('/test-all-sms-methods', async (req, res) => {
  const { phone } = req.body;
  const results = {};
  
  try {
    // Test mesajı
    const message = `DonerciApp test mesajıdır. Saat: ${new Date().toLocaleTimeString()}`;
    
    // Her yöntemi dene
    console.log("----- SMS TEST BAŞLANGIÇ -----");
    
    console.log("1. XML Metodu ile Test");
    results.xml = await smsService.sendSMS(phone, message + " (XML)");
    
    console.log("2. Form Data Metodu ile Test");
    results.formData = await smsService.sendSMSFormData(phone, message + " (FormData)");
    
    console.log("3. GET Metodu ile Test");
    results.get = await smsService.sendSMSWithGet(phone, message + " (GET)");
    
    console.log("4. Yeni Hash ile Test");
    results.newHash = await smsService.sendSMSWithNewHash(phone, message + " (NewHash)");
    
    console.log("----- SMS TEST TAMAMLANDI -----");
    
    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    console.error("Test sırasında hata:", error.message);
    res.status(500).json({ 
      error: error.message,
      results: results 
    });
  }
});

// Sadece bir yöntemi test etmek için endpoint
router.post('/test-sms/:method', async (req, res) => {
  const { phone } = req.body;
  const { method } = req.params;
  
  try {
    // Test mesajı
    const message = `DonerciApp test mesajıdır. Metod: ${method}, Saat: ${new Date().toLocaleTimeString()}`;
    let result = false;
    
    console.log(`----- SMS TEST (${method}) BAŞLANGIÇ -----`);
    
    switch(method) {
      case 'xml':
        result = await smsService.sendSMS(phone, message);
        break;
      case 'form':
        result = await smsService.sendSMSFormData(phone, message);
        break;
      case 'get':
        result = await smsService.sendSMSWithGet(phone, message);
        break;
      case 'hash':
        result = await smsService.sendSMSWithNewHash(phone, message);
        break;
      case 'test':
        result = await smsService.testSMS(phone, message);
        break;
      default:
        return res.status(400).json({ error: "Geçersiz metod. Kullanılabilir metodlar: xml, form, get, hash, test" });
    }
    
    console.log(`----- SMS TEST (${method}) TAMAMLANDI -----`);
    
    res.json({
      success: true,
      method: method,
      result: result
    });
  } catch (error) {
    console.error(`Test (${method}) sırasında hata:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
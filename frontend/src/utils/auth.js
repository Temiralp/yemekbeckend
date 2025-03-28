export const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const exp = decoded.exp * 1000; // Saniyeyi milisaniyeye çevir
    return Date.now() > exp;
  } catch (error) {
    console.error("Token çözümleme hatası:", error);
    return true; // Hata varsa token'ı geçersiz say
  }
};
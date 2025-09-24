export const validateMobile = (mob: string): boolean => {
    const mobileRegex = /^[0-9]{10,15}$/; // Adjust the range (10-15 digits) based on your country format
    return mobileRegex.test(mob);
  };
  
  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  function safeNumber(val: any): number | null {
  if (val == null) return null;         // covers undefined / null
  const num = Number(val);
  return isNaN(num) ? null : num;
}
/**
 * Formatea un número al formato de moneda Guaraní (PYG)
 * Ejemplo: 15000 -> ₲ 15.000
 * @param {number} amount - El monto a formatear
 * @returns {string} El monto formateado
 */
export const formatCurrency = (amount) => {
  // Asegurarnos de que sea un número
  const numAmount = Number(amount);
  
  // Usar la API de Internacionalización para formatear con separadores de miles
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0, // Los guaraníes normalmente no usan decimales
    maximumFractionDigits: 0
  }).format(numAmount);
};
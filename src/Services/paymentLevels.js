const formatPaymentLevel = (paymentLevel) => {
  let splitPaymentLevel = paymentLevel?.split("-");
  let minimumLevel = splitPaymentLevel && splitPaymentLevel[0]?.trim();
  let maximumLevel = splitPaymentLevel[splitPaymentLevel?.length - 1]?.trim();
  let formatedMinimumLevel = new Intl.NumberFormat().format(minimumLevel);
  let formatedMaximumLevel = new Intl.NumberFormat().format(maximumLevel);
  let newPaymentLevel = `€${formatedMinimumLevel} - €${formatedMaximumLevel}`;
  return newPaymentLevel;
};

export const formatPaymentValue = (paymentValue) => {
  let formatedPaymentValue = new Intl.NumberFormat().format(paymentValue);
  return `€${formatedPaymentValue}`;
}

export default formatPaymentLevel;

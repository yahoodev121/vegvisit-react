export function compileServiceFees(getServiceFees) {
  let guest = {
    type: getServiceFees.guestType,
    value: getServiceFees.guestValue,
    currency: getServiceFees.currency
  };

  let host = {
    type: getServiceFees.hostType,
    value: getServiceFees.hostValue,
    currency: getServiceFees.currency
  };

  let serviceFees = { guest, host };
  return serviceFees;
}

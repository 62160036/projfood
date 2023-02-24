export default function formatCurrency(value: { toLocaleString: (arg0: string, arg1: { style: string; currency: string }) => any }) {
  return value.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })
}

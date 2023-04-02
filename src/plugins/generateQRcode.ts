import qrcode from 'qrcode'
import generatePayload from 'promptpay-qr'

export default async function generateQRcode(amount: number) {
  const mobileNumber = '082-778-2656'
  // const amount = 4.22
  const payload = generatePayload(mobileNumber, { amount })
  const svgcode = { value: '' }

  // Convert to SVG QR Code
  const options: any = { type: 'svg', color: { dark: '#003b6a', light: '#f7f8f7' } }
  await new Promise((resolve, reject) => {
    qrcode.toString(payload, options, (err, svg) => {
      if (err)
        return reject(err)
      resolve(svg)
      svgcode.value = svg
    })
  })

  return svgcode
}

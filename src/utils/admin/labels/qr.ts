import QRCode from "qrcode";

export async function makeQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 256,
    color: {
      dark: "#111827",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}

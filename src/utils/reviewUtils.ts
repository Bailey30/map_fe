import Compressor from "compressorjs";
import Resizer from "react-image-file-resizer";
export function formatBase64String(string: string): string {
  return decodeURIComponent("data:image/jpeg;base64, " + string);
}

export function formatMoney(amount: number) {
  // Check if the amount has a decimal point
  if (amount % 1 === 0) {
    // If there is no decimal point, return the amount without decimals
    return amount.toFixed(0);
  } else {
    // If there is a decimal point, return the amount with 2 decimal places
    return amount.toFixed(2);
  }
}

export async function blobify(data: string): Promise<Blob> {
  try {
    console.log({ data });
    const blob = await fetch(data).then((res) => res.blob());
    console.log({ blob });
    return blob;
  } catch (err: any) {
    console.log("error turning image data into a blob", err);
    throw new Error("error turning image data into a blob", err);
  }
}

export async function readImgFile(file: any) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export async function resizeImg(file: any) {
  console.log({ file });
  const res = Resizer.imageFileResizer(
    file,
    300,
    300,
    "JPEG",
    100,
    0,
    (uri) => {
      console.log({ uri });
      return uri;
    },
    "base64",
  );
  console.log({ res });
  return res;
}

function dataURLtoBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
}

export function dataUrlToFile(dataURL: string, filename: string): File {
  const blob = dataURLtoBlob(dataURL);
  return new File([blob], filename, { type: blob.type });
}

export const downloadCanvasToImage = () => {
  const canvas = document.querySelector("canvas");
  const dataURL = canvas.toDataURL();
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "canvas.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const captureCanvasImage = () => {
  const canvas = document.querySelector("canvas");
  return canvas ? canvas.toDataURL("image/png") : null;
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};

 

export const downloadCanvasToPDF = async () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return alert("Canvas not found");
  const dataURL = canvas.toDataURL("image/png");
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const img = new Image();
  await new Promise((res) => { img.onload = res; img.src = dataURL; });
  const aspect = img.width / img.height;
  let w = pageWidth - 80;
  let h = w / aspect;
  if (h > pageHeight - 80) {
    h = pageHeight - 80;
    w = h * aspect;
  }
  const x = (pageWidth - w) / 2;
  const y = (pageHeight - h) / 2;
  pdf.addImage(dataURL, 'PNG', x, y, w, h);
  pdf.save('design.pdf');
};

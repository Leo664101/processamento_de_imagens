let image1Url = "";
let img1original = new Image();
let img2original = new Image();
let image2Url = "";
let img1 = null;
let img2 = null;
let imagesLoaded = false;
let luminosityValue = 0;
let filterType = "8bit";
let originalImage = null;
let filterTypeRotate = "left-right";
let filterTypeMMM = "MAX";
let lastErodedImageData = null;
let lastDilatedImageData = null;

const targetWidth = 350;
const targetHeight = 350;

function loadImage(imageNumber) {
  const fileInput = document.getElementById(`file-upload-${imageNumber}`);
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    if (imageNumber === 1) {
      image1Url = e.target.result;
      document.getElementById(
        "image-1"
      ).innerHTML = `<img src="${image1Url}" alt="Imagem 1" />`;
      originalImage = new Image();
      originalImage.src = image1Url;
      img1original.src = image1Url;
    } else if (imageNumber === 2) {
      image2Url = e.target.result;
      document.getElementById(
        "image-2"
      ).innerHTML = `<img src="${image2Url}" alt="Imagem 2" />`;
      img2original.src = image2Url;
    }

    // Checa se as duas imagens foram carregadas
    if (image1Url && image2Url) {
      imagesLoaded = true;
    }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function applyGrayFilter(imageData, filterType) {
  let data = imageData.data;

  if (filterType === "8bit") {
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Calculando o valor de cinza usando a fórmula da luminosidade
      let gray = r * 0.3 + g * 0.59 + b * 0.11;

      data[i] = data[i + 1] = data[i + 2] = gray;
    }
  } else if (filterType === "1bit") {
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      // Calcular a média de RGB para converter para 0 ou 1
      let gray = (r + g + b) / 3;
      let bit = gray > 127 ? 255 : 0;

      data[i] = data[i + 1] = data[i + 2] = bit; // R, G, B ficam iguais (0 ou 255)
    }
  }

  return imageData;
}

function adjustLuminosity(imageData, luminosityValue, operation) {
  let data = imageData.data;

  if (operation === "") {
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        // R, G, B
        data[i + j] = Math.min(255, Math.max(0, data[i + j] + luminosityValue));
      }
    }
  }
  if (operation === "multiply") {
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        // R, G, B
        data[i + j] = Math.min(255, Math.max(0, data[i + j] * luminosityValue));
      }
    }
  }
  if (operation === "divide") {
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        // R, G, B
        data[i + j] = Math.min(255, Math.max(0, data[i + j] / luminosityValue));
      }
    }
  }

  return imageData;
}

function showGrayResult() {
  const resultContainer = document.getElementById("result");
  if (originalImage) {
    img1 = new Image();
    img1.src = originalImage.src;

    img1.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Aplicar filtro cinza
      imageData = applyGrayFilter(imageData, filterType);

      ctx.putImageData(imageData, 0, 0);

      resultContainer.innerHTML = `<p>Imagem após filtro cinza:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue a Imagem 1 primeiro!</p>`;
  }
}

function showLuminosityResult(operation) {
  const resultContainer = document.getElementById("result");
  if (originalImage) {
    img1 = new Image();
    img1.src = originalImage.src;

    img1.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Aplicar luminosidade à imagem
      imageData = adjustLuminosity(imageData, luminosityValue, operation);

      ctx.putImageData(imageData, 0, 0);

      // Exibir imagem resultante
      resultContainer.innerHTML = `<p>Imagem após ajuste de luminosidade:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue a Imagem 1 primeiro!</p>`;
  }
}

function changeLuminosity(action) {
  let value = parseInt(document.getElementById("luminosity-value").value);
  let operation = "";
  if (action === "increase") {
    luminosityValue = value;
  } else if (action === "decrease") {
    luminosityValue = -value;
  } else if (action === "multiply") {
    luminosityValue = value;
    operation = "multiply";
  } else if (action === "divide") {
    luminosityValue = value;
    operation = "divide";
  }

  showLuminosityResult(operation); // Atualizar resultado com novo valor de luminosidade
}

function resetImages() {
  image1Url = "";
  image2Url = "";
  img1 = null;
  img2 = null;
  imagesLoaded = false;
  luminosityValue = 0;
  originalImage = null;
  document.getElementById("file-upload-1").value = "";
  document.getElementById("file-upload-2").value = "";
  document.getElementById("image-1").innerHTML = "";
  document.getElementById("image-2").innerHTML = "";
  document.getElementById(
    "result"
  ).innerHTML = `<p>As imagens carregadas aparecerão aqui!</p>`;
  if (document.getElementById("elimine")) {
    document.getElementById("elimine").remove();
    document.getElementById("elimine2").remove();
  }
  document.getElementById("luminosity-value").value = 0;
  document.getElementById("blending-value").value = 0;
  document.getElementById("limiar-value").value = 128;
  document.getElementById("order-value").value = 1;
  document.getElementById("gaussiano-value").value = 1;
}

function saveImage() {
  const resultContainer = document.getElementById("result");

  const imageElement = resultContainer.querySelector("img");

  if (imageElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const originalImage = new Image();
    originalImage.src = imageElement.src;

    originalImage.onload = function () {
      // Ajuste para manter as dimensões da imagem original
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;

      // Desenhar a imagem no canvas com as dimensões originais
      ctx.drawImage(originalImage, 0, 0);

      // Criar o link de download da imagem
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "imagem_com_filtro.png"; // Nome do arquivo para download
      link.click();
    };
  } else {
    alert("Nenhuma imagem foi gerada para salvar.");
  }
}

function subtractImages() {
  const resultContainer = document.getElementById("result");

  if (image1Url && image2Url) {
    img1 = new Image();
    img2 = new Image();

    img1.src = image1Url;
    img2.src = image2Url;

    img1.onload = function () {
      img2.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
        let imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, targetWidth, targetHeight);
        let imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let resultImageData = subtractPixelData(imageData1, imageData2);

        ctx.putImageData(resultImageData, 0, 0);

        // Exibir imagem resultante
        resultContainer.innerHTML = `<p>Imagem após subtração:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
      };
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue as imagens primeiro!</p>`;
  }
}

function getKernelSize() {
  const kernelValue = document.getElementById("filter-kernel").value;
  return parseInt(kernelValue, 10);
}

function subtractPixelData(imageData1, imageData2) {
  let data1 = imageData1.data;
  let data2 = imageData2.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    // Subtração de cada canal (R, G, B)
    for (let j = 0; j < 3; j++) {
      let diff = data1[i + j] - data2[i + j];

      // Verificar underflow e overflow
      if (diff < 0) diff = 0;
      if (diff > 255) diff = 255;

      resultData[i + j] = diff;
    }

    // O valor do canal alfa (A) é copiado diretamente
    resultData[i + 3] = data1[i + 3];
  }

  // Retorna o novo ImageData com a subtração realizada
  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function addImages() {
  const resultContainer = document.getElementById("result");

  if (image1Url && image2Url) {
    img1 = new Image();
    img2 = new Image();

    img1.src = image1Url;
    img2.src = image2Url;

    img1.onload = function () {
      img2.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
        let imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, targetWidth, targetHeight);
        let imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let resultImageData = addPixelData(imageData1, imageData2);

        ctx.putImageData(resultImageData, 0, 0);

        // Exibir imagem resultante
        resultContainer.innerHTML = `<p>Imagem após soma:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
      };
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue as imagens primeiro!</p>`;
  }
}

function addPixelData(imageData1, imageData2) {
  let data1 = imageData1.data;
  let data2 = imageData2.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    // Soma de cada canal (R, G, B)
    for (let j = 0; j < 3; j++) {
      let sum = data1[i + j] + data2[i + j];

      // Verificar overflow (soma maior que 255)
      if (sum > 255) sum = 255;

      resultData[i + j] = sum;
    }

    // O valor do canal alfa (A) é copiado diretamente
    resultData[i + 3] = data1[i + 3];
  }

  // Retorna o novo ImageData com a soma realizada
  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function resetFilter() {
  image1Url = img1original.src;
  image2Url = img2original.src;
  img1 = image1Url;
  img2 = image2Url;
  luminosityValue = 0;
  document.getElementById(
    "result"
  ).innerHTML = `<p>As imagens carregadas aparecerão aqui!</p>`;
  if (document.getElementById("elimine")) {
    document.getElementById("elimine").remove();
    document.getElementById("elimine2").remove();
  }
  document.getElementById("luminosity-value").value = 0;
  document.getElementById("blending-value").value = 0;
  document.getElementById("limiar-value").value = 128;
  if (document.getElementById("histograma-exclui-1")) {
    document.getElementById("histograma-exclui-1").remove();
    document.getElementById("histograma-exclui-2").remove();
  }
  document.getElementById("order-value").value = 1;
  document.getElementById("gaussiano-value").value = 1;
  document.getElementById("image-2").innerHTML = image2Url
    ? `<img src="${image2Url}" alt="Imagem 2" />`
    : "";
}

document.getElementById("filter-MMM").addEventListener("change", function () {
  filterTypeMMM = this.value;
});

// Atualiza o tipo de filtro quando o usuário seleciona a opção no combobox
document.getElementById("filter-bit").addEventListener("change", function () {
  filterType = this.value;
});

document.getElementById("rotation").addEventListener("change", function () {
  filterTypeRotate = this.value;
});

function RotateImage(imageData, filterType) {
  const resultContainer = document.getElementById("result");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  img1 = new Image();
  img1.src = originalImage.src;

  img1.onload = function () {
    const width = img1.width;
    const height = img1.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const scaleX = targetWidth / width;
    const scaleY = targetHeight / height;
    const scale = Math.min(scaleX, scaleY);

    const xOffset = (targetWidth - width * scale) / 2;
    const yOffset = (targetHeight - height * scale) / 2;

    switch (filterTypeRotate) {
      case "left-right":
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.translate(targetWidth, 0);
        ctx.scale(-1, 1); // Inverter horizontal
        ctx.drawImage(
          img1,
          0,
          0,
          width,
          height,
          0,
          0,
          targetWidth,
          targetHeight
        ); // Desenhar a imagem invertida
        break;
      case "up-down": // Espelhamento vertical
        ctx.translate(0, targetHeight);
        ctx.scale(1, -1);
        ctx.drawImage(
          img1,
          0,
          0,
          width,
          height,
          0,
          0,
          targetWidth,
          targetHeight
        ); // Redimensionar e desenhar
        break;
    }

    // Atualizar o container com a imagem rotacionada
    resultContainer.innerHTML = `<p>Imagem após filtro e rotação:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
  };
}

function differenceImages() {
  const resultContainer = document.getElementById("result");

  if (image1Url && image2Url) {
    img1 = new Image();
    img2 = new Image();

    img1.src = image1Url;
    img2.src = image2Url;

    img1.onload = function () {
      img2.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Subtrair as imagens a - b (c)
        ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
        let imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, targetWidth, targetHeight);
        let imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let cData = subtractPixelData(imageData1, imageData2);
        ctx.putImageData(cData, 0, 0);
        const cImageUrl = canvas.toDataURL();

        // Subtrair as imagens b - a (d)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, targetWidth, targetHeight);
        let dData = subtractPixelData(imageData2, imageData1);
        ctx.putImageData(dData, 0, 0);
        const dImageUrl = canvas.toDataURL();

        // Somar c e d para gerar a imagem e
        let eData = addPixelData(cData, dData);
        ctx.putImageData(eData, 0, 0);
        const eImageUrl = canvas.toDataURL();

        // Exibir a imagem e (c + d)
        resultContainer.innerHTML = `
          <p>Imagem E (C + D):</p><img src="${eImageUrl}" alt="Imagem e" />
        `;

        // Exibir as imagens c e d embaixo das imagens originais
        document.getElementById("image-1").innerHTML = `
          <img src="${image1Url}" alt="Imagem 1" />
          <div id="elimine"><p>C (Imagem 1 - Imagem 2)</p><img src="${cImageUrl}" alt="Imagem c" /><div>
        `;
        document.getElementById("image-2").innerHTML = `
          <img src="${image2Url}" alt="Imagem 2" />
          <div id="elimine2"><p>D (Imagem 2 - Imagem 1)</p><img src="${dImageUrl}" alt="Imagem d" /><div>
        `;
      };
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue as imagens primeiro!</p>`;
  }
}

function blendImages() {
  const resultContainer = document.getElementById("result");

  var blendingValue = document.getElementById("blending-value").value;
  blendingValue = parseFloat(blendingValue);

  if (blendingValue < 0) {
    blendingValue = 0; // Corrigir para o valor mínimo
  } else if (blendingValue > 1) {
    blendingValue = 1; // Corrigir para o valor máximo
  }

  if (image1Url && image2Url) {
    img1 = new Image();
    img2 = new Image();

    img1.src = image1Url;
    img2.src = image2Url;

    img1.onload = function () {
      img2.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
        let imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, targetWidth, targetHeight);
        let imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let resultImageData = blendPixelData(
          imageData1,
          imageData2,
          blendingValue
        );

        ctx.putImageData(resultImageData, 0, 0);

        // Exibir imagem resultante
        resultContainer.innerHTML = `<p>Imagem após blending:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
      };
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue as imagens primeiro!</p>`;
  }
}

function blendPixelData(imageData1, imageData2, blendingValue) {
  let data2 = imageData1.data;
  let data1 = imageData2.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      resultData[i + j] = Math.round(
        data1[i + j] * (1 - blendingValue) + data2[i + j] * blendingValue
      );
    }
    resultData[i + 3] = 255; // Opacidade total
  }

  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function averageImages() {
  const resultContainer = document.getElementById("result");

  if (image1Url && image2Url) {
    let img1 = new Image();
    let img2 = new Image();

    img1.src = image1Url;
    img2.src = image2Url;

    img1.onload = function () {
      img2.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
        let imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, targetWidth, targetHeight);
        let imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let resultImageData = averagePixelData(imageData1, imageData2);

        ctx.putImageData(resultImageData, 0, 0);

        // Exibir imagem resultante
        resultContainer.innerHTML = `<p>Imagem após média:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
      };
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue as imagens primeiro!</p>`;
  }
}

// Função para calcular a média dos pixels das duas imagens
function averagePixelData(imageData1, imageData2) {
  let data1 = imageData1.data;
  let data2 = imageData2.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    // Média dos canais de cor (R, G, B)
    for (let j = 0; j < 3; j++) {
      resultData[i + j] = (data1[i + j] + data2[i + j]) / 2;
    }

    // Copia o canal alfa sem alteração
    resultData[i + 3] = 255;
  }

  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function logicalOperations(operation) {
  const resultContainer = document.getElementById("result");

  if (image1Url && operation == "NOT") {
    img1 = new Image();
    img1.src = image1Url;

    img1.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
      let imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let resultImageData = logicalNot(imageData1);

      ctx.putImageData(resultImageData, 0, 0);

      resultContainer.innerHTML = `<p>Imagem após operação lógica:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else if (image1Url && image2Url) {
    img1 = new Image();
    img2 = new Image();

    img1.src = image1Url;
    img2.src = image2Url;

    img1.onload = function () {
      img2.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(img1, 0, 0, targetWidth, targetHeight);
        let imageData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img2, 0, 0, targetWidth, targetHeight);
        let imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let resultImageData;

        switch (operation) {
          case "AND":
            resultImageData = logicalAnd(imageData1, imageData2);
            break;
          case "OR":
            resultImageData = logicalOr(imageData1, imageData2);
            break;
          case "NOT":
            resultImageData = logicalNot(imageData1);
            break;
          case "XOR":
            resultImageData = logicalXor(imageData1, imageData2);
            break;
          default:
            resultContainer.innerHTML = `<p>Operação inválida!</p>`;
            return;
        }

        ctx.putImageData(resultImageData, 0, 0);

        // Exibir imagem resultante
        resultContainer.innerHTML = `<p>Imagem após operação lógica:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
      };
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue as imagens primeiro!</p>`;
  }
}

function logicalAnd(imageData1, imageData2) {
  let data1 = imageData1.data;
  let data2 = imageData2.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      // Operação AND entre os canais R, G, B
      resultData[i + j] = data1[i + j] & data2[i + j];
    }
    resultData[i + 3] = 255; // Manter a opacidade como 255
  }

  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function logicalOr(imageData1, imageData2) {
  let data1 = imageData1.data;
  let data2 = imageData2.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      // Operação OR entre os canais R, G, B
      resultData[i + j] = data1[i + j] | data2[i + j];
    }
    resultData[i + 3] = 255; // Manter a opacidade como 255
  }

  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function logicalNot(imageData1) {
  let data1 = imageData1.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      // Operação NOT no canal R, G, B
      resultData[i + j] = ~data1[i + j] & 0xff; // Inverte os bits
    }
    resultData[i + 3] = 255; // Manter a opacidade como 255
  }

  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function logicalXor(imageData1, imageData2) {
  let data1 = imageData1.data;
  let data2 = imageData2.data;
  let resultData = new Uint8ClampedArray(data1.length);

  for (let i = 0; i < data1.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      // Operação XOR entre os canais R, G, B
      resultData[i + j] = data1[i + j] ^ data2[i + j];
    }
    resultData[i + 3] = 255; // Manter a opacidade como 255
  }

  return new ImageData(resultData, imageData1.width, imageData1.height);
}

function limiarImages() {
  const resultContainer = document.getElementById("result");

  let limiarValue = document.getElementById("limiar-value").value;
  limiarValue = parseInt(limiarValue, 10);

  if (isNaN(limiarValue) || limiarValue < 0 || limiarValue > 255) {
    alert("Por favor, insira um valor entre 0 e 255 para o limiar.");
    return;
  }

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let brightness =
          0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];

        let newColor = brightness >= limiarValue ? 255 : 0;
        data[i] = newColor; // R
        data[i + 1] = newColor; // G
        data[i + 2] = newColor; // B
      }

      ctx.putImageData(imageData, 0, 0);

      // Exibir imagem resultante
      resultContainer.innerHTML = `<p>Imagem após aplicação do limiar:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function histograma() {
  const resultContainer = document.getElementById("result");
  const image2Container = document.getElementById("image-2");

  if (!image1Url) {
    resultContainer.innerHTML = "<p>Carregue uma imagem primeiro!</p>";
    return;
  }

  resultContainer.innerHTML = "";
  image2Container.innerHTML = "";

  const img = new Image();
  img.src = image1Url;

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const totalPixels = canvas.width * canvas.height;

    const histogram = new Array(256).fill(0);
    const grayPixels = [];

    // Passo 1: Calcular tons de cinza e histograma
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i]; // r == g == b em imagem em escala de cinza
      histogram[gray]++;
      grayPixels.push(gray);
    }

    // Passo 2: Desenhar histograma original
    drawHistogram(histogram, image2Container);

    const cdf = [...histogram];
    for (let i = 1; i < 256; i++) {
      cdf[i] += cdf[i - 1];
    }

    const cdfMin = cdf.find((v) => v > 0);
    if (cdfMin === undefined) {
      console.error("Erro: imagem completamente vazia.");
      return;
    }

    // Passo 3: Mapear tons antigos para novos
    const mapping = new Array(256).fill(0);
    const L = 255;

    for (let i = 0; i < 256; i++) {
      mapping[i] = Math.floor(
        ((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * (L - 1)
      );
      if (mapping[i] < 0) mapping[i] = 0;
      if (mapping[i] > 255) mapping[i] = 255;
    }

    // Passo 4: Novo histograma com valores equalizados
    let equalizedHistogram = new Array(256).fill(0);
    for (let i = 0; i < grayPixels.length; i++) {
      const originalGray = grayPixels[i];
      const newGray = mapping[originalGray];
      equalizedHistogram[newGray]++;
    }

    // Passo 5: Criar imagem equalizada
    const newImageData = ctx.createImageData(canvas.width, canvas.height);
    const newData = newImageData.data;

    for (let i = 0; i < grayPixels.length; i++) {
      const gray = mapping[grayPixels[i]];
      const idx = i * 4;

      newData[idx] = gray;
      newData[idx + 1] = gray;
      newData[idx + 2] = gray;
      newData[idx + 3] = 255;
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.putImageData(newImageData, 0, 0);

    resultContainer.innerHTML = `
      <p>Imagem Equalizada (Resultado):</p>
      <img src="${tempCanvas.toDataURL()}" alt="Imagem Equalizada" />
    `;

    drawHistogram(equalizedHistogram, image2Container);
  };
}

function drawHistogram(histogram, targetContainer) {
  if (!targetContainer) {
    console.error("Container de destino para o histograma não foi fornecido.");
    return;
  }

  const canvas = document.createElement("canvas");
  const width = 256;
  const height = 200;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  const max = Math.max(...histogram);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#000";

  for (let i = 0; i < 256; i++) {
    const barHeight = (histogram[i] / max) * height;
    ctx.fillRect(i, height - barHeight, 1, barHeight);
  }

  const label = document.createElement("p");
  label.textContent = "|";

  targetContainer.appendChild(label);
  targetContainer.appendChild(canvas);
}

function FilterMaxMinMean() {
  const resultContainer = document.getElementById("result");
  const kernelSize = getKernelSize();
  const offset = Math.floor(kernelSize / 2);

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      let newImageData = ctx.createImageData(canvas.width, canvas.height);
      let newData = newImageData.data;

      // Itera sobre cada pixel, respeita as bordas de acordo com o offset
      for (let y = offset; y < canvas.height - offset; y++) {
        for (let x = offset; x < canvas.width - offset; x++) {
          let index = (y * canvas.width + x) * 4;

          // Passa o kernelSize para a função getNeighbors
          let neighbors = getNeighbors(x, y, canvas, data, kernelSize);

          let r, g, b;
          switch (filterTypeMMM) {
            case "MAX":
              r = Math.max(...neighbors.r);
              g = Math.max(...neighbors.g);
              b = Math.max(...neighbors.b);
              break;
            case "MIN":
              r = Math.min(...neighbors.r);
              g = Math.min(...neighbors.g);
              b = Math.min(...neighbors.b);
              break;
            case "MEAN":
              r = Math.round(average(neighbors.r));
              g = Math.round(average(neighbors.g));
              b = Math.round(average(neighbors.b));
              break;
          }

          newData[index] = r;
          newData[index + 1] = g;
          newData[index + 2] = b;
          newData[index + 3] = 255;
        }
      }

      ctx.putImageData(newImageData, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após filtro:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

// Função para obter os vizinhos de um pixel
function getNeighbors(x, y, canvas, data, kernelSize) {
  let r = [];
  let g = [];
  let b = [];

  const offset = Math.floor(kernelSize / 2);

  for (let dy = -offset; dy <= offset; dy++) {
    for (let dx = -offset; dx <= offset; dx++) {
      let nx = x + dx;
      let ny = y + dy;
      let index = (ny * canvas.width + nx) * 4;

      r.push(data[index]);
      g.push(data[index + 1]);
      b.push(data[index + 2]);
    }
  }

  return { r, g, b };
}

function average(arr) {
  let sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

function applyMedianFilter() {
  const resultContainer = document.getElementById("result");
  const kernelSize = getKernelSize(); // Pega o tamanho do kernel
  const offset = Math.floor(kernelSize / 2); // Calcula a borda

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      let newImageData = ctx.createImageData(canvas.width, canvas.height);
      let newData = newImageData.data;

      for (let y = offset; y < canvas.height - offset; y++) {
        for (let x = offset; x < canvas.width - offset; x++) {
          let index = (y * canvas.width + x) * 4;
          let neighbors = getNeighbors(x, y, canvas, data, kernelSize); // Passa o kernelSize

          let r = median(neighbors.r);
          let g = median(neighbors.g);
          let b = median(neighbors.b);

          newData[index] = r;
          newData[index + 1] = g;
          newData[index + 2] = b;
          newData[index + 3] = 255;
        }
      }

      ctx.putImageData(newImageData, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após filtro de Mediana:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function median(arr) {
  arr.sort((a, b) => a - b); // Ordena os valores em ordem crescente
  const middle = Math.floor(arr.length / 2);
  return arr[middle];
}

function applyOrderFilter() {
  const resultContainer = document.getElementById("result");
  const kernelSize = getKernelSize(); // Pega o tamanho do kernel
  const offset = Math.floor(kernelSize / 2); // Calcula a borda
  let order = parseInt(document.getElementById("order-value").value);
  const maxOrder = kernelSize * kernelSize;

  // Garante que o valor da ordem seja válido para o kernel atual
  if (order < 1) order = 1;
  if (order > maxOrder) order = maxOrder;
  document.getElementById("order-value").value = order;
  document.getElementById("order-value").max = maxOrder;

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      let newImageData = ctx.createImageData(canvas.width, canvas.height);
      let newData = newImageData.data;

      for (let y = offset; y < canvas.height - offset; y++) {
        for (let x = offset; x < canvas.width - offset; x++) {
          let index = (y * canvas.width + x) * 4;
          let neighbors = getNeighbors(x, y, canvas, data, kernelSize); // Passa o kernelSize

          let r = orderFilter(neighbors.r, order);
          let g = orderFilter(neighbors.g, order);
          let b = orderFilter(neighbors.b, order);

          newData[index] = r;
          newData[index + 1] = g;
          newData[index + 2] = b;
          newData[index + 3] = 255;
        }
      }

      ctx.putImageData(newImageData, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após filtro de Ordem:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function orderFilter(arr, order) {
  arr.sort((a, b) => a - b); // Ordena os valores
  return arr[order - 1];
}

function applyConservativeSmoothing() {
  const resultContainer = document.getElementById("result");
  const kernelSize = getKernelSize(); // Pega o tamanho do kernel
  const offset = Math.floor(kernelSize / 2); // Calcula a borda

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      let newImageData = ctx.createImageData(canvas.width, canvas.height);
      let newData = newImageData.data;

      for (let y = offset; y < canvas.height - offset; y++) {
        for (let x = offset; x < canvas.width - offset; x++) {
          let index = (y * canvas.width + x) * 4;

          // Passa o kernelSize para a função
          let neighbors = getNeighborsWithoutCenter(
            x,
            y,
            canvas,
            data,
            kernelSize
          );

          for (let ch = 0; ch < 3; ch++) {
            let neighborValues;
            if (ch === 0) neighborValues = neighbors.r;
            if (ch === 1) neighborValues = neighbors.g;
            if (ch === 2) neighborValues = neighbors.b;

            let min = Math.min(...neighborValues);
            let max = Math.max(...neighborValues);
            let centralValue = data[index + ch];

            if (centralValue < min) {
              newData[index + ch] = min;
            } else if (centralValue > max) {
              newData[index + ch] = max;
            } else {
              newData[index + ch] = centralValue;
            }
          }

          newData[index + 3] = 255;
        }
      }

      ctx.putImageData(newImageData, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após Suavização Conservativa:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function getNeighborsWithoutCenter(x, y, canvas, data, kernelSize) {
  let r = [],
    g = [],
    b = [];

  const offset = Math.floor(kernelSize / 2);

  for (let dy = -offset; dy <= offset; dy++) {
    for (let dx = -offset; dx <= offset; dx++) {
      if (dx === 0 && dy === 0) continue; // ignora o pixel central

      let nx = x + dx;
      let ny = y + dy;
      let index = (ny * canvas.width + nx) * 4;

      r.push(data[index]);
      g.push(data[index + 1]);
      b.push(data[index + 2]);
    }
  }

  return { r, g, b };
}

function applyGaussianFilter() {
  const resultContainer = document.getElementById("result");
  const sigma = parseFloat(document.getElementById("gaussiano-value").value);
  const kernelSize = getKernelSize(); // Pega o tamanho do kernel do select
  const offset = Math.floor(kernelSize / 2); // Calcula a borda

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      const kernel = generateGaussianKernel(sigma, kernelSize);

      let newImageData = ctx.createImageData(canvas.width, canvas.height);
      let newData = newImageData.data;

      for (let y = offset; y < canvas.height - offset; y++) {
        for (let x = offset; x < canvas.width - offset; x++) {
          let r = 0,
            g = 0,
            b = 0;

          for (let ky = -offset; ky <= offset; ky++) {
            for (let kx = -offset; kx <= offset; kx++) {
              let pixelIndex = ((y + ky) * canvas.width + (x + kx)) * 4;
              let weight = kernel[ky + offset][kx + offset];

              r += data[pixelIndex] * weight;
              g += data[pixelIndex + 1] * weight;
              b += data[pixelIndex + 2] * weight;
            }
          }

          let index = (y * canvas.width + x) * 4;
          newData[index] = r;
          newData[index + 1] = g;
          newData[index + 2] = b;
          newData[index + 3] = 255;
        }
      }

      ctx.putImageData(newImageData, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após Filtro Gaussiano:</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function generateGaussianKernel(sigma, size) {
  let kernel = [];
  let sum = 0;
  let center = Math.floor(size / 2);

  // Criar a matriz do kernel
  for (let y = -center; y <= center; y++) {
    let row = [];
    for (let x = -center; x <= center; x++) {
      let value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      row.push(value);
      sum += value;
    }
    kernel.push(row);
  }

  // Normalizar o kernel
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      kernel[y][x] /= sum;
    }
  }

  return kernel;
}

function applyPrewittFilter() {
  const resultContainer = document.getElementById("result");

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 1. Aplicar filtro cinza (8bit)
      imageData = applyGrayFilter(imageData, "8bit");

      const gx = [
        [-1, 0, 1],
        [-1, 0, 1],
        [-1, 0, 1],
      ];
      const gy = [
        [1, 1, 1],
        [0, 0, 0],
        [-1, -1, -1],
      ];

      const output = new ImageData(canvas.width, canvas.height);
      const data = imageData.data;
      const result = output.data;

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          let gxSum = 0,
            gySum = 0;

          for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
              const index = ((y + j) * canvas.width + (x + i)) * 4;
              const gray = data[index];
              gxSum += gray * gx[j + 1][i + 1];
              gySum += gray * gy[j + 1][i + 1];
            }
          }

          const mag = Math.min(255, Math.abs(gxSum) + Math.abs(gySum));
          const idx = (y * canvas.width + x) * 4;
          result[idx] = result[idx + 1] = result[idx + 2] = mag;
          result[idx + 3] = 255;
        }
      }

      ctx.putImageData(output, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após Detecção de Borda (Prewitt):</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function applySobelFilter() {
  const resultContainer = document.getElementById("result");

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 1. Aplicar filtro cinza (8bit)
      imageData = applyGrayFilter(imageData, "8bit");

      const gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
      ];
      const gy = [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1],
      ];

      const output = new ImageData(canvas.width, canvas.height);
      const data = imageData.data;
      const result = output.data;

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          let gxSum = 0,
            gySum = 0;

          for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
              const index = ((y + j) * canvas.width + (x + i)) * 4;
              const gray = data[index];
              gxSum += gray * gx[j + 1][i + 1];
              gySum += gray * gy[j + 1][i + 1];
            }
          }

          const mag = Math.min(255, Math.abs(gxSum) + Math.abs(gySum));
          const idx = (y * canvas.width + x) * 4;
          result[idx] = result[idx + 1] = result[idx + 2] = mag;
          result[idx + 3] = 255;
        }
      }

      ctx.putImageData(output, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após Detecção de Borda (Sobel):</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function applyLaplacianFilter() {
  const resultContainer = document.getElementById("result");

  if (image1Url) {
    let img = new Image();
    img.src = image1Url;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 1. Aplicar filtro cinza (8bit)
      imageData = applyGrayFilter(imageData, "8bit");

      const kernel = [
        [1, 1, 1],
        [1, -8, 1],
        [1, 1, 1],
      ];

      const output = new ImageData(canvas.width, canvas.height);
      const data = imageData.data;
      const result = output.data;

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          let sum = 0;

          for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
              const index = ((y + j) * canvas.width + (x + i)) * 4;
              const gray = data[index]; // valor de cinza
              sum += gray * kernel[j + 1][i + 1];
            }
          }

          const value = Math.min(255, Math.max(0, Math.abs(sum)));
          const idx = (y * canvas.width + x) * 4;
          result[idx] = result[idx + 1] = result[idx + 2] = value;
          result[idx + 3] = 255;
        }
      }

      ctx.putImageData(output, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após Detecção de Borda (Laplaciano):</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    };
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
  }
}

function binarizeImage(imageData, threshold = 127) {
  if (!imageData || !imageData.data) {
    console.error("imageData não está definido ou é inválido!");
    return null;
  }

  let data = imageData.data;

  // Processamento para binarizar a imagem
  for (let i = 0; i < data.length; i += 4) {
    let gray = (data[i] + data[i + 1] + data[i + 2]) / 3; // Média dos valores R, G, B
    let bit = gray > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = bit; // R, G, B ficam iguais (0 ou 255)
  }

  return imageData;
}

function dilateImage(imageData, type, kernelSize) {
  const binarized = structuredCloneImageData(imageData);
  binarizeImage(binarized);

  const { width, height, data } = binarized;
  const output = new ImageData(width, height);
  const outputData = output.data;
  const offset = Math.floor(kernelSize / 2);

  const offsets = getStructuringOffsets(type, kernelSize);

  for (let y = offset; y < height - offset; y++) {
    for (let x = offset; x < width - offset; x++) {
      let idx = (y * width + x) * 4;
      let shouldDilate = false;

      for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        const neighborIdx = (ny * width + nx) * 4;
        if (data[neighborIdx] === 255) {
          shouldDilate = true;
          break;
        }
      }

      outputData[idx] =
        outputData[idx + 1] =
        outputData[idx + 2] =
          shouldDilate ? 255 : 0;
      outputData[idx + 3] = 255;
    }
  }
  return output;
}

function erodeImage(imageData, type, kernelSize) {
  const binarized = structuredCloneImageData(imageData);
  binarizeImage(binarized);

  const { width, height, data } = binarized;
  const output = new ImageData(width, height);
  const outputData = output.data;
  const offset = Math.floor(kernelSize / 2);

  const offsets = getStructuringOffsets(type, kernelSize);

  for (let y = offset; y < height - offset; y++) {
    for (let x = offset; x < width - offset; x++) {
      let idx = (y * width + x) * 4;
      let shouldErode = true;

      for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        const neighborIdx = (ny * width + nx) * 4;
        if (data[neighborIdx] === 0) {
          shouldErode = false;
          break;
        }
      }

      outputData[idx] =
        outputData[idx + 1] =
        outputData[idx + 2] =
          shouldErode ? 255 : 0;
      outputData[idx + 3] = 255;
    }
  }
  return output;
}

function getStructuringOffsets(type, kernelSize) {
  const offsets = [];
  const offset = Math.floor(kernelSize / 2);

  switch (type) {
    case "diamond":
      for (let dy = -offset; dy <= offset; dy++) {
        for (let dx = -offset; dx <= offset; dx++) {
          if (Math.abs(dx) + Math.abs(dy) <= offset) {
            offsets.push([dx, dy]);
          }
        }
      }
      break;
    case "line":
      for (let dx = -offset; dx <= offset; dx++) {
        offsets.push([dx, 0]);
      }
      break;
    case "square":
    default:
      for (let dy = -offset; dy <= offset; dy++) {
        for (let dx = -offset; dx <= offset; dx++) {
          offsets.push([dx, dy]);
        }
      }
      break;
  }
  return offsets;
}

function structuredCloneImageData(imageData) {
  const copy = new ImageData(imageData.width, imageData.height);
  copy.data.set(imageData.data.slice());
  return copy;
}

function applyOutline(originalImageData, type, kernelSize) {
  const binarizedOriginal = structuredCloneImageData(originalImageData);
  binarizeImage(binarizedOriginal);

  const eroded = erodeImage(originalImageData, type, kernelSize);

  const output = new ImageData(
    originalImageData.width,
    originalImageData.height
  );
  const originalData = binarizedOriginal.data;
  const erodedData = eroded.data;
  const outputData = output.data;

  for (let i = 0; i < originalData.length; i += 4) {
    let diff = originalData[i] - erodedData[i];
    outputData[i] = outputData[i + 1] = outputData[i + 2] = diff;
    outputData[i + 3] = 255;
  }
  return output;
}

function showMorphologicalResult(operation) {
  const resultContainer = document.getElementById("result");
  const type = document.getElementById("morphology-type").value;
  const size = getMorphologySize();

  const img = new Image();

  if (image1Url) {
    img.src = image1Url;
  } else {
    resultContainer.innerHTML = `<p>Carregue uma imagem primeiro!</p>`;
    return;
  }

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let resultImageData = null;

    switch (operation) {
      case "dilate":
        resultImageData = dilateImage(imageData, type, size);
        break;
      case "erode":
        resultImageData = erodeImage(imageData, type, size);
        break;
      case "opening":
        resultImageData = applyOpening(imageData, type, size);
        break;
      case "closing":
        resultImageData = applyClosing(imageData, type, size);
        break;
      case "outline":
        resultImageData = applyOutline(imageData, type, size);
        break;
    }

    if (resultImageData) {
      ctx.putImageData(resultImageData, 0, 0);
      resultContainer.innerHTML = `<p>Imagem após ${operation} (${type} ${size}x${size}):</p><img src="${canvas.toDataURL()}" alt="Imagem Resultado" />`;
    }
  };
}

function getMorphologySize() {
  const sizeInput = document.getElementById("struct-size");
  let size = parseInt(sizeInput.value, 10);

  if (isNaN(size) || size < 3) {
    return 3;
  }
  if (size % 2 === 0) {
    size += 1;
    sizeInput.value = size;
  }
  return size;
}

function applyOpening(imageData, type, kernelSize) {
  const eroded = erodeImage(imageData, type, kernelSize);
  const opened = dilateImage(eroded, type, kernelSize);
  return opened;
}

function applyClosing(imageData, type, kernelSize) {
  const dilated = dilateImage(imageData, type, kernelSize);
  const closed = erodeImage(dilated, type, kernelSize);
  return closed;
}

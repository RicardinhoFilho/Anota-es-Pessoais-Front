import api from "./api";
export const handleBase64 = async (preview, images, noteId) => {
  var annotation = preview;
  for (let index = 0; index < images.length; index++) {
   //window.alert(images.length)
    if ((images[index].src).substring(0, 14) === "data:image/png") {
      //console.log(images[index].src)
      try {

        const response = await fileTransform((images[index].src), noteId);
        //const response = fileTransform(file, noteId);
        annotation = annotation.replace((images[index].src), `http://localhost:3333/uploads/${response}`);
        //window.alert(annotation);
      } catch {
       // annotation = preview.replace((images[index].src), `cantConvertBase64`);
       // window.alert(`Não foi possível salvar sua imagem ${index}`);
      }
    }

  }
  return annotation;
}

async function fileTransform(base64, noteId) {
  try {
    //console.log(base64);
    const file = await fetch(base64).then((res) => res.blob());
    const type = base64.substring(11, 3);
    const newFile = (blobToFile(file, "base64"));
    const formData = new FormData();
    formData.append('file', newFile);
    formData.append('type', type);

    const response = await api.post(`/base64/${noteId}`, formData);
    //console.log(response.data)
    return response.data.file;
  } catch (error) {
    return "";
  }


}

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  // theBlob.lastModifiedDate = new Date();
  // theBlob.name = fileName;
  var file = new File([theBlob], fileName);
  return file;
}

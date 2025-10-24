export default function toFormData(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return formData;
}

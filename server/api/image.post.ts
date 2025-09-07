export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  console.log(form);
});

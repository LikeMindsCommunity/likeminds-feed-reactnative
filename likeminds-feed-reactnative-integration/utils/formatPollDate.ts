// this function formats the date in "DD/MM/YYYY hh:mm" format
export const formatDate = (date: any, time: any) => {
  const inputDate = new Date(time);

  // Extracting date components
  const day = String(inputDate.getDate()).padStart(2, "0");
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const year = inputDate.getFullYear();

  // Extracting time components
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");

  // Formating date and time
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedDateTime;
};

export function getFormatDate(date: string) {
  const currDate = new Date(date);
  const day = currDate.getUTCDate();
  let strday = day.toString();

  if (strday.length === 1) {
    strday = `${0}${day}`;
  }

  const month = currDate.getMonth() + 1;
  let strmonth = month.toString();

  if (strmonth.length === 1) {
    strmonth = `${0}${strmonth}`;
  }

  const year = currDate.getFullYear();

  const hours = currDate.getHours();
  let strhours = hours.toString();

  if (strhours.length === 1) {
    strhours = `${0}${strhours}`;
  }

  const minutes = currDate.getMinutes();

  let strminutes = minutes.toString();

  if (strminutes.length === 1) {
    strminutes = `${0}${strminutes}`;
  }

  return `${strday}.${strmonth}.${year} at ${strhours}:${strminutes}`;
}

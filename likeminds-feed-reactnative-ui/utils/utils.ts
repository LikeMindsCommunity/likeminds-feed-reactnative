// this function gives the initial characters of a text
export const getNameInitials = (name: string) => {
  const names = name?.split(' ');
  let initials = names?.[0].substring(0, 1).toUpperCase();

  if (names?.length > 1) {
    initials += names?.[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

// this function calculates the post created time duration from present date
export const timeStamp = (value: number) => {
  const currentDate = Number(new Date());
  const postedDate = Number(new Date(value));
  const difference = currentDate - postedDate;
  //  calculating the seconds, minutes, hours, days, months, years in the time difference betwen the posted time and current time
  let seconds = Math.floor(difference / 1000),
    minutes = Math.floor(seconds / 60),
    hours = Math.floor(minutes / 60),
    days = Math.floor(hours / 24),
    months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  days %= 30;
  months %= 12;

  let createdDuration;
  // returns the greatest unit of time among years/months/days/hours/minutes/seconds
  if (years >= 1) {
    createdDuration = years + 'y';
  } else if (months >= 1) {
    if (months === 1) {
      createdDuration = months + 'mo';
    } else {
      createdDuration = months + 'mos';
    }
  } else if (days >= 1) {
    createdDuration = days + 'd';
  } else if (hours >= 1) {
    createdDuration = hours + 'h';
  } else if (minutes >= 1) {
    createdDuration = minutes + ' min';
  } else if (seconds >= 1) {
    createdDuration = seconds + 's';
  }
  return createdDuration;
};

// this function calculates the number of greatest unit of bytes
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

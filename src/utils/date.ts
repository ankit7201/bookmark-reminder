const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getHumanDateFromEpoch = (epochTime: number) => {
  const date = new Date(epochTime);
  const humanDate: string = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getHours()}:${date.getMinutes()}`;

  return humanDate;
};

export const convertDaysToMilliseconds = (numberOfDays: number) => {
  return numberOfDays * 24 * 60 * 60 * 1000;
};

export const convertHoursToMilliseconds = (hours: number) => {
  return hours * 60 * 60 * 1000;
};

export const convertMinutesToMilliseconds = (minutes: number) => {
  return minutes * 60 * 1000;
};

export const convertMillisecondsToDays = (ms: number) => {
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

export const convertMillisecondsToHours = (ms: number) => {
  return Math.floor(ms / (1000 * 60 * 60));
};

export const convertMillisecondsToMinutes = (ms: number) => {
  return Math.floor(ms / (1000 * 60));
};

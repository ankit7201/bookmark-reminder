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

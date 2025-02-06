export const createAlarm = async (
  alaramName: string,
  whenInMilliseconds: number,
) => {
  await chrome.alarms.create(alaramName, {
    when: whenInMilliseconds,
  });
};

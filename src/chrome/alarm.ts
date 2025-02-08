export const createAlarm = async (
  alaramName: string,
  whenInMilliseconds: number,
) => {
  await chrome.alarms.create(alaramName, {
    when: whenInMilliseconds,
  });
};

export const removeAlarm = async (alarmName: string) => {
  try {
    await chrome.alarms.clear(alarmName);
  } catch (err) {
    console.log("Cannot remove alarm", err);
  }
};

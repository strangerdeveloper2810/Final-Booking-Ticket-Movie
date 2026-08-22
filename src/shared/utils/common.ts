import dayjs from "dayjs";

export const formatScheduleMovie = (dateString: string) => {
  if (dateString) {
    const date = dayjs(dateString).format("DD-MM-YYYY");
    const time = dayjs(dateString).format("HH:mm");
    return [date, time].join(" ~ ");
  }
  return "";
};

export const sumTwoNumber = (numberOne: number, numberTwo: number): number => {
  let result = numberOne + numberTwo;
  return result;
};

import moment from "moment";
export const formatScheduleMovie = (dateString: string) => {
  if (dateString) {
    const date = moment(dateString).format("DD-MM-YYYY");
    const time = moment(dateString).format("HH:MM");
    return [date, time].join(" ~ ");
  }
  return "";
};

export const sumTwoNumber = (numberOne: number, numberTwo: number): number => {
  let result = numberOne + numberTwo;
  return result;
};

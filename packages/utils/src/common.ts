import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";

export const formatScheduleMovie = (dateString: string) => {
  if (!isEmpty(dateString)) {
    const date = dayjs(dateString).format("DD/MM/YYYY");
    const time = dayjs(dateString).format("HH:mm");
    return [date, time].join(" ~ ");
  }
  return "";
};

export const parseScheduleMovie = (dateString: string) => {
  if (!isEmpty(dateString)) {
    const date = dayjs(dateString).format("DD/MM/YYYY");
    const time = dayjs(dateString).format("HH:mm");
    return { date, time };
  }
  return { date: "", time: "" };
};

export const formatLocalizedDate = (dateString?: string, lang: string = "vi"): string => {
  if (isEmpty(dateString)) return "";
  const d = dayjs(dateString);
  if (!d.isValid()) return dateString as string;
  return lang === "vi" ? d.format("DD/MM/YYYY") : d.format("MMM DD, YYYY");
};

export const sumTwoNumber = (numberOne: number, numberTwo: number): number => {
  let result = numberOne + numberTwo;
  return result;
};

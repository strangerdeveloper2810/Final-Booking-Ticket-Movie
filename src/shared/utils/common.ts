import dayjs from "dayjs";

export const formatScheduleMovie = (dateString: string) => {
  if (dateString) {
    const date = dayjs(dateString).format("DD/MM/YYYY");
    const time = dayjs(dateString).format("HH:mm");
    return [date, time].join(" ~ ");
  }
  return "";
};

export const parseScheduleMovie = (dateString: string) => {
  if (dateString) {
    const date = dayjs(dateString).format("DD/MM/YYYY");
    const time = dayjs(dateString).format("HH:mm");
    return { date, time };
  }
  return { date: "", time: "" };
};

export const formatLocalizedDate = (dateString?: string, lang: string = "vi"): string => {
  if (!dateString) return "";
  const d = dayjs(dateString);
  if (!d.isValid()) return dateString;
  return lang === "vi" ? d.format("DD/MM/YYYY") : d.format("MMM DD, YYYY");
};

export const sumTwoNumber = (numberOne: number, numberTwo: number): number => {
  let result = numberOne + numberTwo;
  return result;
};

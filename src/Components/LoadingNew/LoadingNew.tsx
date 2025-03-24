import { FC, JSX } from "react";
const LoadingNew: FC = (): JSX.Element => (
  <div className="loader">
    <div className="inner one"></div>
    <div className="inner two"></div>
    <div className="inner three"></div>
  </div>
);
export default LoadingNew;

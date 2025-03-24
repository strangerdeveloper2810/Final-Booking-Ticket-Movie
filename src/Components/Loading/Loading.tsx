import { FC, JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "Redux/store";
import loadingImg from "../../assets/img/loading.gif";
import styled from "./Loading.module.css";

const Loading: FC = (): JSX.Element => {
  const isLoading = useSelector((state: RootState) => state.Loading.isLoading);
  return isLoading ? (
    <div className={styled.isLoading}>
      <img src={loadingImg} alt="loading" />
    </div>
  ) : (
    <></>
  );
};

export default Loading;

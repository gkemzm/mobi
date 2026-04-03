import { ParamsType } from "@/types/common";
import { FC } from "react";
import HomeComponent from "../../../../modules/components/pages/home/home";

const HomePage: FC<ParamsType> = async (props) => {
  return <HomeComponent params={props} />;
};

export default HomePage;

import { Redirect, type Href } from "expo-router";

const MidwifeIndex = () => {
  return <Redirect href={"/midwife/dashboard" as Href} />;
};

export default MidwifeIndex;

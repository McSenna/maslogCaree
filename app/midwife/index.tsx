import { Redirect, type Href } from "expo-router";

export default function MidwifeIndex() {
  return <Redirect href={"/midwife/dashboard" as Href} />;
}

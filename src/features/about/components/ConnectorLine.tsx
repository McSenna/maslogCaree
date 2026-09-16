import { View } from "react-native";
import { HC } from "../constants/aboutTheme";

const ConnectorLine = ({ height = 24 }: { height?: number }) => {
  return (
    <View style={{ alignItems: "center", marginVertical: 2 }}>
      <View style={{ width: 2, height, backgroundColor: HC.tealMid }} />
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: HC.teal,
          marginTop: -1,
        }}
      />
    </View>
  );
};

export default ConnectorLine;

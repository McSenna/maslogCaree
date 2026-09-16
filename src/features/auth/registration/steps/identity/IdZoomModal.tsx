import { Image, Modal, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  uri: string;
  onClose: () => void;
};

const IdZoomModal = ({ visible, uri, onClose }: Props) => {
  const { width } = useWindowDimensions();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close full image view"
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 10,
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: 10,
            borderRadius: 20,
          }}
        >
          <Feather name="x" size={20} color="#FFFFFF" />
        </Pressable>

        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
          }}
          maximumZoomScale={3}
          minimumZoomScale={1}
        >
          <Image
            source={{ uri }}
            resizeMode="contain"
            style={{ width: Math.min(width * 0.9, 800), height: 500, borderRadius: 8 }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default IdZoomModal;

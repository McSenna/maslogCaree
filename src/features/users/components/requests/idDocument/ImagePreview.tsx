import { Image, Modal, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

const ImagePreview = ({
  frameClass,
  height,
  uri,
  canOpenExternally,
  onOpenExternally,
  zoomOpen,
  onOpenZoom,
  onCloseZoom,
}: {
  frameClass: string;
  height: number;
  uri: string;
  canOpenExternally: boolean;
  onOpenExternally: () => void;
  zoomOpen: boolean;
  onOpenZoom: () => void;
  onCloseZoom: () => void;
}) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <View className={frameClass} style={{ minHeight: height }}>
        <Image
          source={{ uri }}
          resizeMode="contain"
          style={{ width: "100%", height }}
          accessibilityLabel="Submitted government ID document"
        />

        <View className="absolute right-3 top-3 flex-row gap-2">
          <Pressable
            onPress={onOpenZoom}
            accessibilityRole="button"
            accessibilityLabel="Zoom the ID document"
            className="flex-row items-center gap-1.5 rounded-lg bg-black/75 px-3 py-1.5 active:opacity-85"
          >
            <Feather name="zoom-in" size={13} color="#fff" />
            <Text className="text-[11.5px] font-bold text-white">Zoom ID</Text>
          </Pressable>

          {canOpenExternally ? (
            <Pressable
              onPress={onOpenExternally}
              accessibilityRole="button"
              accessibilityLabel="Open the ID document in a new tab"
              className="flex-row items-center gap-1.5 rounded-lg bg-black/75 px-3 py-1.5 active:opacity-85"
            >
              <Feather name="external-link" size={13} color="#fff" />
              <Text className="text-[11.5px] font-bold text-white">Full Window</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Modal visible={zoomOpen} transparent animationType="fade" onRequestClose={onCloseZoom}>
        <View className="flex-1 items-center justify-center bg-black/90 p-4">
          <Pressable
            onPress={onCloseZoom}
            accessibilityRole="button"
            accessibilityLabel="Close the zoomed ID"
            className="absolute right-6 top-6 z-20 rounded-full bg-white/20 p-2.5"
          >
            <Feather name="x" size={20} color="#fff" />
          </Pressable>

          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100%",
            }}
            maximumZoomScale={4}
            minimumZoomScale={1}
            bouncesZoom={Platform.OS !== "web"}
          >
            <Image
              source={{ uri }}
              resizeMode="contain"
              style={{ width: Math.min(width * 0.95, 1000), height: 600 }}
              accessibilityLabel="Government ID document, enlarged"
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default ImagePreview;

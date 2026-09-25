import { Image, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ImageZoomModal from "@/components/ui/ImageZoomModal";

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

      <ImageZoomModal
        visible={zoomOpen}
        uri={uri}
        onClose={onCloseZoom}
        accessibilityLabel="Government ID document, enlarged"
      />
    </>
  );
};

export default ImagePreview;

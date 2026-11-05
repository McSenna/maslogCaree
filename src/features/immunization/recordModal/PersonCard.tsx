import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import RecordLink from "./RecordLink";
import useRecordModalStyles from "./recordModalStyles";

type PersonCardProps = {
  tag: string;
  name: string;
  /** A flag shown ahead of the details, such as "Sample name". */
  chip?: string;
  meta: readonly string[];
  onDetails: () => void;
  /** A further action under the details. */
  link?: { label: string; onPress: () => void };
  /** Rules between details. Left off when lines are likely to wrap, where a rule would start a line. */
  ruled: boolean;
  style?: StyleProp<ViewStyle>;
};

const PersonCard = ({ tag, name, chip, meta, onDetails, link, ruled, style }: PersonCardProps) => {
  const { styles } = useRecordModalStyles();
  return (
    <View style={[styles.person, style]}>
      <View style={styles.personHead}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
        <Text accessibilityRole="header" style={styles.personName}>
          {name}
        </Text>
        <View style={styles.grow} />
        <RecordLink chevron label="Details" accessibilityLabel={`Details for ${name}`} onPress={onDetails} />
      </View>
      <View style={[styles.meta, !ruled && styles.metaUnruled]}>
        {chip ? (
          <View style={[styles.tag, styles.chipNeutral]}>
            <Text style={styles.chipNeutralText}>{chip}</Text>
          </View>
        ) : null}
        {meta.map((item, index) => (
          <View key={item} style={styles.metaItem}>
            {ruled && (index > 0 || chip) ? (
              <Text aria-hidden style={styles.metaRule}>
                |
              </Text>
            ) : null}
            <Text style={styles.metaText}>{item}</Text>
          </View>
        ))}
      </View>
      {link ? <RecordLink label={link.label} accessibilityLabel={link.label} onPress={link.onPress} /> : null}
    </View>
  );
};

export default PersonCard;

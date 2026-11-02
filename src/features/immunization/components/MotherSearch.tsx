import { useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { immunizationApi } from "../services/immunizationApi";
import { requestProblem } from "../immunizationLogic";
import type { Mother } from "../types";
import ClinicalField from "./ClinicalField";
import useImmunizationStyles from "./immunizationStyles";

const MotherSearch = ({ onSelect }: { onSelect: (mother: Mother) => void }) => {
  const { styles } = useImmunizationStyles();
  const [query, setQuery] = useState("");
  const [mothers, setMothers] = useState<Mother[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const request = useRef(0);
  const search = async () => {
    const version = ++request.current;
    setLoading(true);
    setError("");
    setMothers([]);
    try {
      const result = await immunizationApi.searchMothers(query.trim());
      if (version === request.current) {
        setMothers(result.mothers);
        setSearched(true);
      }
    } catch (problem) {
      if (version === request.current) setError(requestProblem(problem));
    } finally {
      if (version === request.current) setLoading(false);
    }
  };
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Find the mother</Text>
      <ClinicalField
        label="Mother's name or registry ID"
        value={query}
        onChange={(next) => {
          request.current += 1;
          setLoading(false);
          setQuery(next);
          setMothers([]);
          setSearched(false);
        }}
        disabled={loading}
      />
      <Button
        label="Search mothers"
        onPress={() => void search()}
        disabled={query.trim().length < 2}
        loading={loading}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error} Search again to retry.
        </Text>
      ) : null}
      {searched && !mothers.length && !loading ? (
        <Text style={styles.body}>
          No matching mothers. Check the name or registry ID and search again.
        </Text>
      ) : null}
      <FlatList
        data={mothers}
        keyExtractor={(item) => item.masterResidentId}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.divider}>
            <Text style={styles.strong}>{item.name}</Text>
            <Text style={styles.muted}>Mother ID: {item.masterResidentId}</Text>
            <Button
              label="Select mother"
              variant="secondary"
              onPress={() => {
                setMothers([]);
                setSearched(false);
                onSelect(item);
              }}
            />
          </View>
        )}
      />
    </View>
  );
};
export default MotherSearch;

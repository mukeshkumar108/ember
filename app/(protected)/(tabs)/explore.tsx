import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>
            This screen is a neutral placeholder for future experiments.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Starter Status</Text>
          <Text style={styles.cardBody}>
            Auth, routing, bootstrap, onboarding guard, and core app shell are
            being wired as the reusable baseline.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Likely Uses</Text>
          <Text style={styles.cardBody}>
            Replace this screen with whatever fits the product: feed, dashboard,
            activity, search, discovery, or something else entirely.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: "#666",
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
});

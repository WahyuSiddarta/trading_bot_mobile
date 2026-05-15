import { StyleSheet, Text, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";

import { Fonts } from "@/constants/theme";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#061018", dark: "#061018" }}
      headerImage={<Text>hello</Text>}
    >
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explore
        </Text>
      </View>
      <Text>This app includes example code to help you get started.</Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#22C986",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

// app/index.jsx — VloConvo Home screen (React Native + Expo)
// The initial landing screen, shown before login. Follows "the main design"
// established by the Login and Register screens: same palette, typography,
// hexagon language, border radii, shadows, and spacing.
//
// Expo Router note: place this file at `app/index.jsx` so it is the first
// screen of the app. It pushes to the existing `/login` and `/register` routes.

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Svg, Defs, LinearGradient, Stop, Polygon, Circle } from "react-native-svg";
import { LinearGradient as ExpoGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";

/* ─────────────────────────  Palette  ───────────────────────── */
// Identical to Login / Register
const C = {
  bg: "#FCFAF7",
  ink: "#2B2419",
  inkSoft: "#5C5246",
  muted: "#8A7E6E",
  faint: "#A89A88",
  border: "#E4DCCF",
  accent: "#D97757",
  accentDeep: "#C5613C",
  accentLight: "#E8A48A",
};

/* ──────────────────────  Hexagon helpers  ───────────────────── */
function HexOutline({ size, color, strokeWidth = 2 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Polygon
        points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HexFill({ size, color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5" fill={color} />
    </Svg>
  );
}

/* ─────────────────────────  VloConvo logo  ───────────────────────── */
function VloLogo({ size = 34, showWord = true, wordSize = 20 }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Defs>
          <LinearGradient id="vloGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#EBA07F" />
            <Stop offset="1" stopColor="#C5613C" />
          </LinearGradient>
        </Defs>
        <Polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="url(#vloGrad)" />
        <Polygon
          points="24,12 33.5,17.5 33.5,30.5 24,36 14.5,30.5 14.5,17.5"
          stroke="white"
          strokeOpacity={0.9}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Circle cx="24" cy="24" r="2.6" fill="white" />
      </Svg>
      {showWord && (
        <Text style={[styles.brand, { fontSize: wordSize }]}>
          <Text style={{ color: C.ink }}>Vlo</Text>
          <Text style={{ color: C.accent }}>Convo</Text>
        </Text>
      )}
    </View>
  );
}

/* ─────────────────────────  Screen  ───────────────────────── */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // Entrance animation (same language as Login / Register)
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fade]);
  const entrance = {
    opacity: fade,
    transform: [
      { translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
    ],
  };

  // Floating decorative hexagons (same motion as Login / Register)
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const mk = (v, dur) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: dur, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: dur, useNativeDriver: true }),
        ])
      );
    const a = mk(floatA, 9000);
    const b = mk(floatB, 11000);
    const c = mk(floatC, 13000);
    a.start();
    b.start();
    c.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, [floatA, floatB, floatC]);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      {/* Decorative hexagons — behind the Dynamic Island, to the edges */}
      <View style={[styles.decor, { top: -80, right: -80 }]}>
        <HexFill size={230} color="rgba(217,119,87,0.05)" />
      </View>
      <Animated.View
        style={[
          styles.decor,
          { top: insets.top + 14, right: -20 },
          { transform: [{ translateY: floatA.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) }] },
        ]}
      >
        <HexOutline size={120} color="rgba(217,119,87,0.18)" />
      </Animated.View>
      <Animated.View
        style={[
          styles.decor,
          { bottom: 60, left: -50 },
          { transform: [{ translateY: floatB.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) }] },
        ]}
      >
        <HexOutline size={160} color="rgba(217,119,87,0.14)" />
      </Animated.View>
      <Animated.View
        style={[
          styles.decor,
          { bottom: insets.bottom + 120, right: 24 },
          { transform: [{ translateY: floatC.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }] },
        ]}
      >
        <HexOutline size={64} color="rgba(217,119,87,0.14)" />
      </Animated.View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, entrance]}>
          {/* Brand — prominent near the top */}
          <View style={styles.brandWrap}>
            <VloLogo size={52} wordSize={30} />
          </View>

          {/* Welcome section */}
          <View style={styles.welcome}>
            <Text style={styles.h1}>Welcome to VloConvo</Text>
            <Text style={styles.lead}>
              HD video calls, effortless screen sharing, and organized channels —{"\n"}
              one calm space for how your team actually talks.
            </Text>

            <View style={styles.hexRow}>
              <HexFill size={10} color={C.accent} />
              <HexFill size={10} color="rgba(217,119,87,0.45)" />
              <HexFill size={10} color="rgba(217,119,87,0.2)" />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push("/login")}
              style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.94 }]}
            >
              <ExpoGradient
                colors={["#E0895F", "#C5613C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.btnContent}>
                <Text style={styles.primaryText}>Login</Text>
                <ArrowRight size={17} color="#fff" />
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/register")}
              style={({ pressed }) => [styles.ghostBtn, pressed && { backgroundColor: "#FBF6EF" }]}
            >
              <Text style={styles.ghostText}>Register</Text>
            </Pressable>
          </View>

          {/* Footnote */}
          <Text style={styles.footnote}>Free for small teams · No credit card required</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

/* ─────────────────────────  Styles  ───────────────────────── */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    position: "relative",
    overflow: "hidden",
  },
  decor: { position: "absolute" },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },

  /* Brand */
  brandWrap: { alignItems: "center", marginBottom: 48 },
  brand: {
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: -0.4,
    fontWeight: "600",
  },

  /* Welcome */
  welcome: { alignItems: "center" },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.6,
    color: C.ink,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
  },
  lead: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    color: C.muted,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  hexRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    alignItems: "center",
  },

  /* Actions */
  actions: { marginTop: 40 },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    shadowColor: "#C5613C",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Inter-SemiBold",
  },
  ghostBtn: {
    marginTop: 14,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: {
    fontSize: 15,
    fontWeight: "600",
    color: C.ink,
    fontFamily: "Inter-SemiBold",
  },

  /* Footnote */
  footnote: {
    marginTop: 26,
    fontSize: 12,
    color: C.faint,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});
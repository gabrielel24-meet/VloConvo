// app/servers/index.jsx — VloConvo Servers screen (React Native + Expo)
// The first screen a logged-in user sees. Structure follows the reference mockup:
// minimal header (logo + hexagonal "+"), a staggered, connected honeycomb grid of
// large hexagonal server cards with a soft glow, and a detached elongated-hexagon
// floating bottom nav — all restyled in "the main design" palette
// (cream #FCFAF7 background, warm ink cards, orange #D97757 glow and accents).
//
// Expo Router: save as `app/servers/index.jsx`. Placeholder data lives in
// SERVERS below — swap it for real backend data later (each item carries
// id, name, icon, memberCount).

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Svg, Defs, LinearGradient, Stop, Polygon, Circle } from "react-native-svg";
import { Plus, MessagesSquare, User, LayoutGrid } from "lucide-react-native";

/* ─────────────────────────  Palette (main design)  ───────────────────────── */
const C = {
  bg: "#FCFAF7",
  ink: "#2B2419",
  inkSoft: "#5C5246",
  muted: "#8A7E6E",
  faint: "#A89A88",
  border: "#E4DCCF",
  divider: "#E9E1D4",
  accent: "#D97757",
  accentDeep: "#C5613C",
  accentLight: "#E0895F",
  white: "#FFFFFF",
  navIcon: "#B3A695",
};

// Pointy-top hexagon points for a 100×100 viewBox
const HEX = "50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5";

/* ─────────────────────────  Placeholder data  ───────────────────────── */
// Replace with real server data from the backend later.
const SERVERS = [
  { id: "s1", name: "Chill Zone", members: 128, grad: ["#4A382A", "#2B2419"] },
  { id: "s2", name: "Gaming", members: 214, grad: ["#5A3D2E", "#33261B"] },
  { id: "s3", name: "Space", members: 67, grad: ["#3E3226", "#241E15"] },
  { id: "s4", name: "Nature", members: 89, grad: ["#46503A", "#262B1F"] },
  { id: "s5", name: "Anime", members: 342, grad: ["#4C3529", "#2B2016"] },
  { id: "s6", name: "Developers", members: 42, grad: ["#3A2F25", "#221C13"] },
  { id: "s7", name: "Coffee Talk", members: 57, grad: ["#6B4A33", "#3A281B"] },
];

/* ─────────────────────────  Logo  ───────────────────────── */
function VloLogo({ size = 26, wordSize = 20 }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
      <Text style={[styles.brand, { fontSize: wordSize }]}>
        <Text style={{ color: C.ink }}>Vlo</Text>
        <Text style={{ color: C.accent }}>Convo</Text>
      </Text>
    </View>
  );
}

/* ─────────────────────  Hexagonal server card  ───────────────────── */
function ServerHex({ server, size, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Open ${server.name}`}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 }]}
    >
      <View style={[styles.cardGlow, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <Defs>
            <LinearGradient id={`srv-${server.id}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <Stop stopColor={server.grad[0]} />
              <Stop offset="1" stopColor={server.grad[1]} />
            </LinearGradient>
            <LinearGradient id={`srvStroke-${server.id}`} x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
              <Stop stopColor="rgba(217,119,87,0.55)" />
              <Stop offset="1" stopColor="rgba(217,119,87,0.15)" />
            </LinearGradient>
          </Defs>
          <Polygon points={HEX} fill={`url(#srv-${server.id})`} />
          <Polygon points={HEX} stroke={`url(#srvStroke-${server.id})`} strokeWidth={1.6} strokeLinejoin="round" />
        </Svg>
        {/* Empty image spot — drop the server's image here later, e.g.
            clip an <Image source={{ uri: server.image }} style={styles.cardImage} />
            to the hexagon with react-native-svg's <ClipPath>, or a plain
            rounded image sized to fit inside the hexagon. The gradient fill
            behind it doubles as the placeholder until an image exists. */}
        <View style={styles.cardImageSpot} />
      </View>
    </Pressable>
  );
}

/* ─────────────────────  Bottom nav item  ───────────────────── */
function NavItem({ icon: Icon, label, active, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={styles.navItem}>
      <View style={styles.navIconWrap}>
        {active ? (
          <Svg width={38} height={38} viewBox="0 0 100 100" fill="none" style={styles.navHex}>
            <Defs>
              <LinearGradient id="navActiveGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#E0895F" />
                <Stop offset="1" stopColor="#C5613C" />
              </LinearGradient>
            </Defs>
            <Polygon points={HEX} fill="url(#navActiveGrad)" />
          </Svg>
        ) : null}
        <View style={styles.navIcon}>
          <Icon size={17} color={active ? "#fff" : C.navIcon} />
        </View>
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

/* ─────────────────────────  Screen  ───────────────────────── */
export default function ServersScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("servers");

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

  // Honeycomb metrics: 2 hexes per row, odd rows shifted half a cell right,
  // rows interlocking at ¾ pitch (each hexagon's lower-right edge sits beside
  // the next row's upper-left edge — the connected diagonal pattern).
  const cell = Math.floor((width - 28) / 2.5);
  const rows = [];
  for (let i = 0; i < SERVERS.length; i += 2) rows.push(SERVERS.slice(i, i + 2));

  const openServer = (server) => {
    // TODO: navigate into the server once its channel screen exists, e.g.
    //   router.push(`/servers/${server.id}`);
  };

  const handleAdd = () => {
    // TODO: create / join server flow.
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 18 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}
        >
          {/* Header: app name on the left, hexagonal "+" on the right */}
          <View style={styles.header}>
            <VloLogo />
            <Pressable
              onPress={handleAdd}
              hitSlop={8}
              accessibilityLabel="Create or join a server"
              style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.75 }]}
            >
              <Svg width={42} height={42} viewBox="0 0 100 100" fill="none">
                <Polygon
                  points={HEX}
                  stroke={C.accent}
                  strokeOpacity={0.5}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />
              </Svg>
              <View style={styles.addIconWrap}>
                <Plus size={19} color={C.accentDeep} />
              </View>
            </Pressable>
          </View>

          {/* Title */}
          <Text style={styles.h1}>Your Servers</Text>

          {/* Staggered honeycomb grid */}
          <View style={styles.honeycomb}>
            {rows.map((row, ri) => (
              <View
                key={ri}
                style={[
                  styles.row,
                  { marginTop: ri === 0 ? 0 : -cell * 0.25 },
                  ri % 2 === 1 && { marginLeft: cell * 0.5 },
                ]}
              >
                {row.map((server) => (
                  <ServerHex
                    key={server.id}
                    server={server}
                    size={cell}
                    onPress={() => openServer(server)}
                  />
                ))}
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Detached elongated-hexagon floating nav — above the home indicator */}
      <View style={[styles.nav, { bottom: insets.bottom + 18 }]}>
        {/* soft warm glow behind the pill */}
        <View style={styles.navGlow} />
        <Svg
          width="100%"
          height={76}
          viewBox="0 0 320 100"
          preserveAspectRatio="none"
          fill="none"
          style={StyleSheet.absoluteFill}
        >
          <Polygon
            points="28,2 292,2 318,50 292,98 28,98 2,50"
            fill="#FFFFFF"
            stroke="rgba(217,119,87,0.35)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </Svg>
        <View style={styles.navRow}>
          <NavItem
            icon={LayoutGrid}
            label="Servers"
            active={activeTab === "servers"}
            onPress={() => setActiveTab("servers")}
          />
          <NavItem
            icon={MessagesSquare}
            label="Messages"
            active={activeTab === "messages"}
            onPress={() => {
              // TODO: navigate to the Messages screen once it exists.
              setActiveTab("messages");
            }}
          />
          <NavItem
            icon={User}
            label="Profile"
            active={activeTab === "profile"}
            onPress={() => {
              // TODO: navigate to the Profile screen once it exists.
              setActiveTab("profile");
            }}
          />
        </View>
      </View>
    </View>
  );
}

/* ─────────────────────────  Styles  ───────────────────────── */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 14, paddingBottom: 150 },

  /* Header */
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { fontFamily: "PlusJakartaSans-Bold", letterSpacing: -0.4, fontWeight: "700" },
  addBtn: { position: "relative", width: 42, height: 42 },
  addIconWrap: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },

  /* Title */
  h1: {
    marginTop: 24,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: C.ink,
    fontFamily: "PlusJakartaSans-Bold",
  },

  /* Honeycomb */
  honeycomb: { marginTop: 26 },
  row: { flexDirection: "row", justifyContent: "flex-start" },
  card: { alignItems: "center" },
  cardGlow: {
    position: "relative",
    shadowColor: "#D97757",
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  // The empty spot inside each hexagon reserved for a future server image.
  // Sized to fit inside the hexagon's inscribed area (~70% of its size).
  cardImageSpot: {
    position: "absolute",
    top: "15%",
    left: "15%",
    right: "15%",
    bottom: "15%",
  },

  /* Floating bottom nav */
  nav: {
    position: "absolute",
    left: 24,
    right: 24,
    height: 76,
    shadowColor: "#D97757",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 12,
  },
  navGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    backgroundColor: "rgba(217,119,87,0.18)",
    transform: [{ scaleY: 1.15 }, { scaleX: 1.02 }],
  },
  navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", height: 76 },
  navItem: { alignItems: "center", minWidth: 86 },
  navIconWrap: { position: "relative", width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  navHex: { position: "absolute", top: 0, left: 0 },
  navIcon: { alignItems: "center", justifyContent: "center" },
  navLabel: { marginTop: 4, fontSize: 11, color: C.muted, fontFamily: "Inter-Regular" },
  navLabelActive: { color: C.accentDeep, fontWeight: "600", fontFamily: "Inter-SemiBold" },
});
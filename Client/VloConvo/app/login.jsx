// app/login.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { Svg, Defs, LinearGradient, Stop, Polygon, Circle, Path } from "react-native-svg";
import { LinearGradient as ExpoGradient } from "expo-linear-gradient";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react-native";
import api from "../api"; 

/* ─────────────────────────  Palette  ───────────────────────── */
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
  accentLight: "#E8A48A",
  inputBg: "#FFFFFF",
  placeholder: "#C4B8A6",
  iconMuted: "#B3A695",
  errorBg: "#FBEEE6",
  errorBorder: "#ECCBB8",
  errorText: "#A24C2A",
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

/* ─────────────────────────  Google mark  ───────────────────────── */
function GoogleMark({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

/* ─────────────────────────  Screen  ───────────────────────── */
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Entrance animation (replaces framer-motion)
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
      {
        translateY: fade.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  // Subtle floating for decorative hexes
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loopA = Animated.loop(
      Animated.sequence([
        Animated.timing(floatA, { toValue: 1, duration: 9000, useNativeDriver: true }),
        Animated.timing(floatA, { toValue: 0, duration: 9000, useNativeDriver: true }),
      ])
    );
    const loopB = Animated.loop(
      Animated.sequence([
        Animated.timing(floatB, { toValue: 1, duration: 11000, useNativeDriver: true }),
        Animated.timing(floatB, { toValue: 0, duration: 11000, useNativeDriver: true }),
      ])
    );
    loopA.start();
    loopB.start();
    return () => {
      loopA.stop();
      loopB.stop();
    };
  }, [floatA, floatB]);
  const floatStyleA = {
    transform: [
      { translateY: floatA.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) },
    ],
  };
  const floatStyleB = {
    transform: [
      { translateY: floatB.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) },
    ],
  };

  // Mocked sign-in (no backend)
  const handleSubmit = () => {
    if (loading) return;
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    //   Alert.alert("Signed in", "This is a mocked sign-in for UI testing.");
        regularLogin(email, password); // Call the regular login function
    }, 1200);
  };

const regularLogin = async (email, password) => {
  try {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post(
      "/auth/token",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Login response:", response.data);

    Alert.alert(
      "Login successful",
      "You have been logged in successfully."
    );

    } catch (error) {
        console.log("Login error:", error.response?.data || error.message);
        setError("Invalid email or password.");
    }
  };

  const handleGoogle = () => Alert.alert("Google", "Google sign-in is a placeholder for now.");

  return (
    <View style={styles.screen}>
      {/* Decorative hexagons — visible but behind content */}
      <View style={[styles.decor, { top: -70, right: -70 }]}>
        <HexFill size={210} color="rgba(217,119,87,0.05)" />
      </View>
      <Animated.View style={[styles.decor, { top: 96, right: 18 }, floatStyleA]}>
        <HexOutline size={86} color="rgba(217,119,87,0.18)" />
      </Animated.View>
      <Animated.View style={[styles.decor, { bottom: 44, left: -44 }, floatStyleB]}>
        <HexOutline size={140} color="rgba(217,119,87,0.14)" />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formWrap, entrance]}>
            {/* Brand */}
            <View style={styles.brandWrap}>
              <VloLogo size={38} wordSize={22} />
            </View>

            {/* Heading */}
            <Text style={styles.h1}>Welcome</Text>
            <Text style={styles.lead}>
              Sign in to pick up your conversations where you left them.
            </Text>

            {/* Google */}
            <Pressable style={styles.googleBtn} onPress={handleGoogle}>
              <GoogleMark size={20} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR WITH EMAIL</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Error */}
            {error !== "" && (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color={C.errorText} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Mail size={17} color={C.iconMuted} />
              </View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={C.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                style={styles.input}
              />
            </View>

            {/* Password */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <Link href="/index" style={styles.forgotLink}>
                Forgot?
              </Link>
            </View>
            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Lock size={17} color={C.iconMuted} />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={C.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                style={[styles.input, { paddingRight: 48 }]}
              />
              <Pressable
                hitSlop={10}
                onPress={() => setShowPassword((s) => !s)}
                style={styles.eyeBtn}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} color={C.iconMuted} />
                ) : (
                  <Eye size={18} color={C.iconMuted} />
                )}
              </Pressable>
            </View>

            {/* Sign in */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.signInBtn,
                pressed && { opacity: 0.94 },
              ]}
            >
              <ExpoGradient
                colors={["#E0895F", "#C5613C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.signInContent}>
                {loading ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.signInText}>Signing you in…</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.signInText}>Sign in</Text>
                    <ArrowRight size={17} color="#fff" />
                  </>
                )}
              </View>
            </Pressable>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>New to VloConvo? </Text>
              <Link href="/register" style={styles.footerLink}>
                Create an account
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  decor: {
    position: "absolute",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  formWrap: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  brandWrap: {
    alignItems: "center",
    marginBottom: 26,
  },
  brand: {
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: -0.4,
    fontWeight: "600",
  },
  h1: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.6,
    color: C.ink,
    fontFamily: "PlusJakartaSans-Bold",
  },
  lead: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: C.muted,
    fontFamily: "Inter-Regular",
  },

  /* Google */
  googleBtn: {
    marginTop: 26,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleText: {
    fontSize: 15,
    fontWeight: "500",
    color: C.ink,
    fontFamily: "Inter-Medium",
  },

  /* Divider */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.divider,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    letterSpacing: 1.4,
    color: C.faint,
    fontFamily: "Inter-Medium",
    textTransform: "uppercase",
  },

  /* Error */
  errorBox: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.errorBorder,
    backgroundColor: C.errorBg,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: C.errorText,
    fontFamily: "Inter-Regular",
  },

  /* Inputs */
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: C.inkSoft,
    marginBottom: 7,
    fontFamily: "Inter-Medium",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 7,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: "500",
    color: C.accentDeep,
    fontFamily: "Inter-Medium",
  },
  inputWrap: {
    position: "relative",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 42,
    paddingRight: 12,
    fontSize: 16,
    color: C.ink,
    fontFamily: "Inter-Regular",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },

  /* Sign in */
  signInBtn: {
    marginTop: 24,
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    // iOS shadow (replaces the original box-shadow)
    shadowColor: "#C5613C",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
  },
  signInContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signInText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Inter-SemiBold",
  },

  /* Footer */
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 26,
  },
  footerText: {
    fontSize: 14,
    color: C.muted,
    fontFamily: "Inter-Regular",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: C.accentDeep,
    fontFamily: "Inter-SemiBold",
  },
});
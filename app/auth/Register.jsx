import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { auth } from "../../firebase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const [alertText, setAlertText] = useState("");
  const [alertVisible] = useState(new Animated.Value(0));

  // Funksioni që shfaq mesazhin nalt për disa sekonda
  const showAlert = (text) => {
    setAlertText(text);
    Animated.timing(alertVisible, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(alertVisible, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000);
    });
  };

  // Kontrolli i fjalëkalimit
  const validatePassword = (pw) => {
    const missing = [];
    if (pw.length < 8) missing.push("• Të paktën 8 karaktere");
    if (!/[A-Z]/.test(pw)) missing.push("• Një shkronjë e madhe (A-Z)");
    if (!/[a-z]/.test(pw)) missing.push("• Një shkronjë e vogël (a-z)");
    if (!/[0-9]/.test(pw)) missing.push("• Një numër (0-9)");
    if (!/[!@#\$%\^&\*\(\)\-\+_=\\\[\]\{\};:'\",.<>\/?`~|]/.test(pw))
      missing.push("• Një shenjë/pikësim (p.sh. ! ? . , @ #)");
    return missing;
  };

  const handleRegister = async () => {
    if (!email || !password) {
      showAlert("⚠️ Vendos email dhe fjalëkalimin!");
      return;
    }

    const missing = validatePassword(password);
    if (missing.length > 0) {
      showAlert(`Fjalëkalimi nuk është i vlefshëm:\n${missing.join("\n")}`);
      return;
    }

    setBusy(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      console.log("User registered:", userCredential.user.email);

      showAlert("✅ Regjistrimi u krye me sukses!");
      setTimeout(() => router.push("/auth/Login"), 1000);
    } catch (err) {
      console.log("Register error:", err);
      showAlert("❌ Gabim gjatë regjistrimit. " + (err?.message || ""));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Banner alert nalt */}
      <Animated.View
        style={[
          styles.alertBox,
          {
            opacity: alertVisible,
            transform: [
              {
                translateY: alertVisible.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.alertText}>{alertText}</Text>
      </Animated.View>

      <View style={styles.box}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          editable={!busy}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={!busy}
        />

        <TouchableOpacity
          style={[styles.primaryButton, busy && styles.disabled]}
          onPress={handleRegister}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/Login")}
          style={{ marginTop: 16 }}
          disabled={busy}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  alertBox: {
    position: "absolute",
    top: 40,
    backgroundColor: "#ff5555",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 10,
    maxWidth: "90%",
  },
  alertText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  box: {
    width: "92%",
    maxWidth: 480,
    padding: 28,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#1E90FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
    linkText: { textAlign: "center", color: "#1E90FF", fontWeight: "600" },
  disabled: { opacity: 0.6 },
});

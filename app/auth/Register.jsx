
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Plotëso fushat", "Vendos email dhe fjalëkalimin.");
      return;
    }

    setBusy(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Sukses", "Përdoruesi u krijua!");
      router.replace("/auth/Login"); // ridrejton te login
    } catch (err) {
      console.log("Register error:", err);
      Alert.alert("Gabim", err.message || "Regjistrim dështoi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.primaryButton, busy && styles.disabled]}
          onPress={handleRegister}
          disabled={busy}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/Login")}
          style={{ marginTop: 16 }}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  box: { width: "92%", maxWidth: 480, padding: 28, backgroundColor: "#fff", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#e6e6e6", padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  primaryButton: { backgroundColor: "#1E90FF", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 6 },
  primaryText: { color: "#fff", fontWeight: "700" },
  linkText: { textAlign: "center", color: "#1E90FF", fontWeight: "600" },
  disabled: { opacity: 0.6 },
});

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from "react-native";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 
  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

 
  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showAlert("Success", "Login successful!");
      console.log(" Login successful with email:", email);
      router.push("/Home"); 
    } catch (error) {
      console.error(" Login error:", error);
      showAlert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

 
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      showAlert("Success", `Signed in as ${user.email}`);
      console.log(" Google login success:", user);
      router.push("/Home"); 
    } catch (error) {
      console.error(" Google login error:", error);
      showAlert("Error", error.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={[styles.primaryButton, loading && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={loading}
          style={[styles.googleButton, loading && styles.disabled]}
        >
          <View style={styles.googleContent}>
            <Image
              source={require("../../assets/images/google.png")} // absolute path
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleText}>Login with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/Register")}
          style={{ marginTop: 18 }}
        >
          <Text style={styles.linkText}>
            Don’t have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
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
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  orText: {
    textAlign: "center",
    marginVertical: 16,
    color: "#666",
    fontWeight: "600",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#DB4437",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  googleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  googleText: {
    color: "#DB4437",
    fontWeight: "700",
  },
  linkText: {
    textAlign: "center",
    color: "#1E90FF",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import WifiManager from "react-native-wifi-reborn";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

interface WifiNetwork {
  SSID: string;
  BSSID: string;
  level: number; // Signal strength
  frequency: number; // Frequency in MHz
  capabilities: string; // Security capabilities (e.g., WPA, WPA2)
}

const WifiScanner: React.FC = () => {
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>([]);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      let permissionsGranted = true;

      // Check and request ACCESS_FINE_LOCATION (required for all Android versions)
      const fineLocationStatus = await check(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );
      if (fineLocationStatus !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (result !== RESULTS.GRANTED) {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to scan WiFi networks."
          );
          permissionsGranted = false;
        }
      }

      // Check and request NEARBY_WIFI_DEVICES (required for Android 12+)
      if (Platform.OS === "android" && Platform.Version >= 31) {
        const nearbyWifiStatus = await check(
          PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES
        );
        if (nearbyWifiStatus !== RESULTS.GRANTED) {
          const result = await request(PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES);
          if (result !== RESULTS.GRANTED) {
            Alert.alert(
              "Permission Denied",
              "Nearby WiFi permission is required to scan WiFi networks on Android 12+."
            );
            permissionsGranted = false;
          }
        }
      }

      return permissionsGranted;
    } catch (error) {
      console.error("Error checking/requesting permissions:", error);
      Alert.alert("Error", "An error occurred while requesting permissions.");
      return false;
    }
  };

  const scanWifiNetworks = async (): Promise<void> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setWifiNetworks([]);
      const networks: WifiNetwork[] = await WifiManager.loadWifiList();
      setWifiNetworks(networks);
      console.log("Available WiFi Networks:", networks);
    } catch (error) {
      console.error("Error fetching WiFi networks:", error);
      Alert.alert("Error", "Could not fetch WiFi networks.");
    }
  };

  useEffect(() => {
    scanWifiNetworks();
  }, []);

  const renderNetworkItem: ListRenderItem<WifiNetwork> = ({ item }) => (
    <View style={styles.networkItem}>
      <Text style={styles.networkName}>SSID: {item.SSID}</Text>
      <Text>BSSID: {item.BSSID}</Text>
      <Text>Signal Strength: {item.level}</Text>
      <Text>Frequency: {item.frequency} MHz</Text>
      <Text>Capabilities: {item.capabilities}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available WiFi Networks</Text>
      <Button title="Scan WiFi Networks" onPress={scanWifiNetworks} />
      <FlatList
        data={wifiNetworks}
        keyExtractor={(item, index) => `${item.BSSID}-${index}`}
        renderItem={renderNetworkItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.noNetworks}>No networks found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    marginTop: 16,
  },
  networkItem: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  networkName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noNetworks: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
  },
});

export default WifiScanner;

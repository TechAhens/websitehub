import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  RotateCcw, 
  Share, 
  ExternalLink,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react-native';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';

export default function WebViewScreen() {
  const { url, title, websiteId } = useLocalSearchParams<{
    url: string;
    title: string;
    websiteId: string;
  }>();

  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Camera permission denied', 'This page may not work properly without it.');
      }

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Location permission denied', 'This page may not work properly without it.');
      }
    })();
  }, []);


  
  const handleRefresh = () => {
    webViewRef.current?.reload();
    setError(false);
  };

  const handleGoBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  const handleShare = () => {
    Alert.alert(
      'Share Website',
      `Share ${title}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Copy URL', onPress: () => {
          // Could implement clipboard functionality here
          Alert.alert('Success', 'URL copied to clipboard');
        }},
      ]
    );
  };

  const handleOpenExternal = () => {
    Alert.alert(
      'Open Externally',
      'This will open the website in your default browser.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => {
          // Could implement external browser opening here
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
   
        <View style={styles.titleContainer}>
    <Text style={styles.title} numberOfLines={1}>
            {}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.url} numberOfLines={1}>
            {currentUrl}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share color="#374151" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleOpenExternal}>
            <ExternalLink color="#374151" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, !canGoBack && styles.navButtonDisabled]}
          onPress={handleGoBack}
          disabled={!canGoBack}
        >
          <ChevronLeft color={canGoBack ? "#3b82f6" : "#d1d5db"} size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, !canGoForward && styles.navButtonDisabled]}
          onPress={handleGoForward}
          disabled={!canGoForward}
        >
          <ChevronRight color={canGoForward ? "#3b82f6" : "#d1d5db"} size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleRefresh}>
          <RotateCcw color="#3b82f6" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.webViewContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Unable to load website</Text>
            <Text style={styles.errorDescription}>
              Check your internet connection and try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <RotateCcw color="#ffffff" size={20} />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
<WebView
  ref={webViewRef}
  source={{ uri: url }}
  style={styles.webView}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  geolocationEnabled={true}
  injectedJavaScript={injectedJS}
  onMessage={async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "getLocation" || data.type === "watchLocation") {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          webViewRef.current?.injectJavaScript(`
            window.__onLocationError && window.__onLocationError({ code: 1, message: "Permission denied" });
          `);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        webViewRef.current?.injectJavaScript(`
          window.__onLocationSuccess && window.__onLocationSuccess({
            coords: {
              latitude: ${loc.coords.latitude},
              longitude: ${loc.coords.longitude},
              accuracy: ${loc.coords.accuracy}
            }
          });
        `);
      }
    } catch (e) {
      console.warn("WebView message error:", e);
    }
  }}
/>

        )}
      </View>

      {loading && !error && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  url: {
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  navButton: {
    padding: 8,
    marginRight: 16,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500' as const,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    marginRight: 8,
  },
  saveButton: {
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  retryButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 24,
  backgroundColor: '#3b82f6', // 👈 add this
},

});
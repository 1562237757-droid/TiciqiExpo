import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { AppProvider, useApp } from './src/viewmodels/AppContext';
import DirectoryView from './src/views/DirectoryView';
import PreviewView from './src/views/PreviewView';
import FloatingOverlay from './src/components/FloatingOverlay';

function AppContent() {
  const { selectedScript, selectScript, isLoading, resetCardIndex } = useApp();
  const [showFloating, setShowFloating] = useState(false);

  const handleStartFloating = () => {
    resetCardIndex();
    setShowFloating(true);
  };

  const handleCloseFloating = () => {
    setShowFloating(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedScript ? (
        <DirectoryView />
      ) : (
        <PreviewView
          script={selectedScript}
          onBack={() => {
            selectScript(null);
            setShowFloating(false);
          }}
          onStartFloating={handleStartFloating}
        />
      )}

      {showFloating && selectedScript && (
        <FloatingOverlay
          script={selectedScript}
          onClose={handleCloseFloating}
        />
      )}

      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8e8e93',
  },
});
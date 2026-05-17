import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../viewmodels/AppContext';
import { Script } from '../models/Script';
import SettingsView from './SettingsView';

interface PreviewViewProps {
  script: Script;
  onBack: () => void;
  onStartFloating: () => void;
}

export default function PreviewView({ script, onBack, onStartFloating }: PreviewViewProps) {
  const { currentCardIndex, settings, nextCard, previousCard, canGoNext, canGoPrevious } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const handlePrevious = () => {
    if (canGoPrevious()) {
      previousCard();
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      nextCard();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀ 目录</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{script.title}</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewContent}>
        <Text style={styles.cardIndex}>
          {currentCardIndex + 1} / {script.cards.length}
        </Text>

        <View style={styles.cardContainer}>
          <Text
            style={[
              styles.cardText,
              { textAlign: settings.textAlignment === 'left' ? 'left' : 'center' },
            ]}
          >
            {script.cards[currentCardIndex]}
          </Text>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, !canGoPrevious() && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={!canGoPrevious()}
          >
            <Text style={[styles.navButtonText, !canGoPrevious() && styles.disabledText]}>◀</Text>
          </TouchableOpacity>

          <Text style={styles.navIndex}>{currentCardIndex + 1} / {script.cards.length}</Text>

          <TouchableOpacity
            style={[styles.navButton, !canGoNext() && styles.disabledButton]}
            onPress={handleNext}
            disabled={!canGoNext()}
          >
            <Text style={[styles.navButtonText, !canGoNext() && styles.disabledText]}>▶</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onStartFloating}>
          <Text style={styles.startButtonText}>开始拍摄</Text>
        </TouchableOpacity>
      </View>

      {showSettings && (
        <SettingsView onClose={() => setShowSettings(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007aff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  settingsButton: {
    paddingLeft: 16,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardIndex: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  cardText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 40,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 30,
    gap: 60,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: '#007aff',
  },
  disabledButton: {
    opacity: 0.3,
  },
  disabledText: {
    color: '#666',
  },
  navIndex: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
  startButton: {
    backgroundColor: '#007aff',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 40,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
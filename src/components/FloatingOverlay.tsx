import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useApp } from '../viewmodels/AppContext';
import { Script } from '../models/Script';

interface FloatingOverlayProps {
  script: Script;
  onClose: () => void;
}

export default function FloatingOverlay({ script, onClose }: FloatingOverlayProps) {
  const { currentCardIndex, settings, nextCard, previousCard, canGoNext, canGoPrevious, getActivePreset, updatePreset } = useApp();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const activePreset = getActivePreset();
  const initialConfig = activePreset?.config || settings.floatingWindow || { width: 280, height: 220, opacity: 0.95 };
  const initialX = initialConfig.x ?? 20;
  const initialY = initialConfig.y ?? 100;

  const [position] = useState(new Animated.ValueXY({ x: initialX, y: initialY }));
  const [size, setSize] = useState({ width: initialConfig.width, height: initialConfig.height });
  const [bgOpacity, setBgOpacity] = useState(initialConfig.opacity);
  const [showControls, setShowControls] = useState(false);

  const sizeRef = useRef({ width: initialConfig.width, height: initialConfig.height });
  const positionOffset = useRef({ x: initialX, y: initialY });
  const lastTap = useRef(0);

  useEffect(() => {
    const subscription = position.addListener((value) => {
      positionOffset.current = value;
    });
    return () => position.removeListener(subscription);
  }, [position]);

  const handleSizeChange = useCallback((deltaW: number, deltaH: number) => {
    const newWidth = Math.max(120, sizeRef.current.width + deltaW);
    const newHeight = Math.max(100, sizeRef.current.height + deltaH);
    setSize({ width: newWidth, height: newHeight });
    sizeRef.current = { width: newWidth, height: newHeight };
  }, []);

  const handleOpacityChange = useCallback((delta: number) => {
    setBgOpacity(prev => {
      const newOpacity = Math.max(0, Math.min(1, prev + delta));
      return newOpacity;
    });
  }, []);

  const handleSaveToPreset = useCallback(async () => {
    if (settings.activePresetId) {
      await updatePreset(settings.activePresetId, {
        width: sizeRef.current.width,
        height: sizeRef.current.height,
        opacity: bgOpacity,
        x: positionOffset.current.x,
        y: positionOffset.current.y,
      });
      Alert.alert('保存成功', '当前窗口设置已保存到预设');
    }
  }, [settings.activePresetId, updatePreset, bgOpacity]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          position.setOffset({
            x: positionOffset.current.x,
            y: positionOffset.current.y,
          });
          position.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_, gestureState) => {
          position.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: (_, gestureState) => {
          const finalX = positionOffset.current.x + gestureState.dx;
          const finalY = positionOffset.current.y + gestureState.dy;

          position.flattenOffset();
          positionOffset.current = { x: finalX, y: finalY };
        },
      }),
    []
  );

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      return;
    }
    lastTap.current = now;
    setShowControls(prev => !prev);
  }, []);

  const handleLongPress = useCallback(() => {
    setShowControls(true);
  }, []);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious()) {
      previousCard();
    }
  }, [canGoPrevious, previousCard]);

  const handleNext = useCallback(() => {
    if (canGoNext()) {
      nextCard();
    }
  }, [canGoNext, nextCard]);

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        {
          width: size.width,
          height: size.height,
          backgroundColor: `rgba(28,28,30,${bgOpacity})`,
          transform: [{ translateX: position.x }, { translateY: position.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={0.9}
        onPress={handleTap}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.indexText}>
              {currentCardIndex + 1} / {script.cards.length}
            </Text>
          </View>

          <View style={styles.cardArea}>
            <Text
              style={[
                styles.cardText,
                { textAlign: settings.textAlignment === 'left' ? 'left' : 'center' },
              ]}
              numberOfLines={6}
            >
              {script.cards[currentCardIndex]}
            </Text>
          </View>

          {showControls && (
            <View style={styles.controlsOverlay}>
              <View style={styles.sizeControls}>
                <Text style={styles.controlLabel}>窗口大小</Text>
                <View style={styles.sizeButtons}>
                  <TouchableOpacity
                    style={styles.sizeButton}
                    onPress={() => handleSizeChange(-20, -15)}
                  >
                    <Text style={styles.sizeButtonText}>➖</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sizeButton}
                    onPress={() => handleSizeChange(20, 15)}
                  >
                    <Text style={styles.sizeButtonText}>➕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.sizeValue}>{Math.round(sizeRef.current.width)}×{Math.round(sizeRef.current.height)}</Text>
              </View>

              <View style={styles.opacityControls}>
                <Text style={styles.controlLabel}>透明度</Text>
                <View style={styles.opacityButtons}>
                  <TouchableOpacity style={styles.opacityButton} onPress={() => handleOpacityChange(-0.1)}>
                    <Text style={styles.opacityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.opacityValue}>{Math.round(bgOpacity * 100)}%</Text>
                  <TouchableOpacity style={styles.opacityButton} onPress={() => handleOpacityChange(0.1)}>
                    <Text style={styles.opacityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveToPreset}>
                <Text style={styles.saveButtonText}>保存当前设置到预设</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.navigation}>
            <TouchableOpacity
              style={[styles.navBtn, !canGoPrevious() && styles.disabledBtn]}
              onPress={handlePrevious}
              disabled={!canGoPrevious()}
            >
              <Text style={styles.navBtnText}>◀</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, !canGoNext() && styles.disabledBtn]}
              onPress={handleNext}
              disabled={!canGoNext()}
            >
              <Text style={styles.navBtnText}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3a3a3c',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  touchArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  indexText: {
    fontSize: 12,
    color: '#8e8e93',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 26,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 12,
    padding: 12,
  },
  sizeControls: {
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 11,
    color: '#8e8e93',
    marginBottom: 6,
  },
  sizeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
  },
  sizeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  sizeValue: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 6,
    textAlign: 'center',
  },
  opacityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opacityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  opacityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2c2c2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opacityButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  opacityValue: {
    fontSize: 14,
    color: '#fff',
    minWidth: 40,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    gap: 40,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,122,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnText: {
    fontSize: 18,
    color: '#007aff',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,59,48,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: '#ff3b30',
  },
  disabledBtn: {
    opacity: 0.3,
  },
});
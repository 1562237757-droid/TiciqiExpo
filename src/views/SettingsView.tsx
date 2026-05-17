import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '../viewmodels/AppContext';

interface SettingsViewProps {
  onClose: () => void;
}

export default function SettingsView({ onClose }: SettingsViewProps) {
  const { settings, updateSettings, updatePreset, addPreset, deletePreset } = useApp();
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetWidth, setNewPresetWidth] = useState('280');
  const [newPresetHeight, setNewPresetHeight] = useState('220');
  const [newPresetOpacity, setNewPresetOpacity] = useState('95');
  const [newPresetX, setNewPresetX] = useState('20');
  const [newPresetY, setNewPresetY] = useState('100');

  const handleAlignmentChange = async (alignment: 'center' | 'left') => {
    await updateSettings({ ...settings, textAlignment: alignment });
  };

  const handlePresetSelect = async (presetId: string) => {
    const preset = settings.presets?.find(p => p.id === presetId);
    if (preset) {
      await updateSettings({ ...settings, activePresetId: presetId });
    }
  };

  const handleUpdateCurrentAsPreset = async () => {
    if (!settings.floatingWindow || !settings.activePresetId) return;
    await updatePreset(settings.activePresetId, settings.floatingWindow);
    Alert.alert('保存成功', '当前窗口设置已保存到预设');
  };

  const handleAddPreset = async () => {
    if (!newPresetName.trim()) {
      Alert.alert('请输入', '请输入预设名称');
      return;
    }
    const width = parseInt(newPresetWidth, 10) || 280;
    const height = parseInt(newPresetHeight, 10) || 220;
    const opacity = (parseInt(newPresetOpacity, 10) || 95) / 100;
    const x = parseInt(newPresetX, 10) || 20;
    const y = parseInt(newPresetY, 10) || 100;

    await addPreset(newPresetName.trim(), { width, height, opacity, x, y });
    setNewPresetName('');
    setNewPresetWidth('280');
    setNewPresetHeight('220');
    setNewPresetOpacity('95');
    setNewPresetX('20');
    setNewPresetY('100');
    setShowAddModal(false);
    Alert.alert('保存成功', '新预设已添加');
  };

  const handleDeletePreset = async (presetId: string) => {
    await deletePreset(presetId);
    setEditingPreset(null);
    Alert.alert('删除成功', '预设已删除');
  };

  const resetAddModal = () => {
    setNewPresetName('');
    setNewPresetWidth('280');
    setNewPresetHeight('220');
    setNewPresetOpacity('95');
    setNewPresetX('20');
    setNewPresetY('100');
    setShowAddModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设置</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>完成</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>文字显示</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>对齐方式</Text>
          </View>

          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                settings.textAlignment === 'center' && styles.pickerOptionSelected,
              ]}
              onPress={() => handleAlignmentChange('center')}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  settings.textAlignment === 'center' && styles.pickerOptionTextSelected,
                ]}
              >
                居中
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pickerOption,
                settings.textAlignment === 'left' && styles.pickerOptionSelected,
              ]}
              onPress={() => handleAlignmentChange('left')}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  settings.textAlignment === 'left' && styles.pickerOptionTextSelected,
                ]}
              >
                左对齐
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>窗口预设</Text>

          <View style={styles.presetsContainer}>
            {settings.presets?.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetItem,
                  settings.activePresetId === preset.id && styles.presetItemActive,
                ]}
                onPress={() => handlePresetSelect(preset.id)}
                onLongPress={() => setEditingPreset(preset.id)}
              >
                <Text style={[
                  styles.presetName,
                  settings.activePresetId === preset.id && styles.presetNameActive
                ]}>
                  {preset.name}
                </Text>
                <Text style={styles.presetSize}>
                  {preset.config.width}×{preset.config.height}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.addPresetButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addPresetText}>+ 新增预设</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveCurrentButton}
            onPress={handleUpdateCurrentAsPreset}
          >
            <Text style={styles.saveCurrentText}>保存当前窗口到选中预设</Text>
          </TouchableOpacity>
        </View>

        {editingPreset && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>编辑预设</Text>
            <View style={styles.presetEditInfo}>
              <Text style={styles.presetEditName}>
                {settings.presets?.find(p => p.id === editingPreset)?.name}
              </Text>
              <TouchableOpacity
                style={styles.deletePresetButton}
                onPress={() => handleDeletePreset(editingPreset)}
              >
                <Text style={styles.deletePresetText}>删除此预设</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>使用说明</Text>

          <View style={styles.helpItem}>
            <Text style={styles.helpNumber}>1</Text>
            <Text style={styles.helpText}>在目录页面点击 + 新建文案</Text>
          </View>

          <View style={styles.helpItem}>
            <Text style={styles.helpNumber}>2</Text>
            <Text style={styles.helpText}>点击文案进入预览模式</Text>
          </View>

          <View style={styles.helpItem}>
            <Text style={styles.helpNumber}>3</Text>
            <Text style={styles.helpText}>点击「开始拍摄」启动悬浮提词器</Text>
          </View>

          <View style={styles.helpItem}>
            <Text style={styles.helpNumber}>4</Text>
            <Text style={styles.helpText}>长按悬浮窗可调整大小和透明度</Text>
          </View>

          <View style={styles.helpItem}>
            <Text style={styles.helpNumber}>5</Text>
            <Text style={styles.helpText}>点击悬浮窗右上角 ✕ 关闭</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新增预设</Text>

            <TextInput
              style={styles.modalInput}
              value={newPresetName}
              onChangeText={setNewPresetName}
              placeholder="预设名称"
              placeholderTextColor="#8e8e93"
            />

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>宽度</Text>
                <TextInput
                  style={styles.numberInput}
                  value={newPresetWidth}
                  onChangeText={setNewPresetWidth}
                  keyboardType="numeric"
                  placeholder="280"
                  placeholderTextColor="#8e8e93"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>高度</Text>
                <TextInput
                  style={styles.numberInput}
                  value={newPresetHeight}
                  onChangeText={setNewPresetHeight}
                  keyboardType="numeric"
                  placeholder="220"
                  placeholderTextColor="#8e8e93"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>透明度(%)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={newPresetOpacity}
                  onChangeText={setNewPresetOpacity}
                  keyboardType="numeric"
                  placeholder="95"
                  placeholderTextColor="#8e8e93"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>X位置</Text>
                <TextInput
                  style={styles.numberInput}
                  value={newPresetX}
                  onChangeText={setNewPresetX}
                  keyboardType="numeric"
                  placeholder="20"
                  placeholderTextColor="#8e8e93"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Y位置</Text>
                <TextInput
                  style={styles.numberInput}
                  value={newPresetY}
                  onChangeText={setNewPresetY}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor="#8e8e93"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetAddModal}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddPreset}
              >
                <Text style={styles.confirmButtonText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 17,
    color: '#007aff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8e8e93',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 17,
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 4,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  pickerOptionSelected: {
    backgroundColor: '#007aff',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#8e8e93',
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetItem: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 14,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetItemActive: {
    borderColor: '#007aff',
  },
  presetName: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 4,
  },
  presetNameActive: {
    color: '#007aff',
    fontWeight: '600',
  },
  presetSize: {
    fontSize: 12,
    color: '#8e8e93',
  },
  addPresetButton: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 14,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3c',
    borderStyle: 'dashed',
  },
  addPresetText: {
    fontSize: 15,
    color: '#007aff',
  },
  saveCurrentButton: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  saveCurrentText: {
    fontSize: 15,
    color: '#8e8e93',
  },
  presetEditInfo: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 14,
  },
  presetEditName: {
    fontSize: 17,
    color: '#fff',
    marginBottom: 12,
  },
  deletePresetButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  deletePresetText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  helpNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2c2c2e',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 13,
    color: '#8e8e93',
    marginRight: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2c2c2e',
    borderRadius: 16,
    padding: 24,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: '#8e8e93',
    marginBottom: 6,
  },
  numberInput: {
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3a3a3c',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#007aff',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
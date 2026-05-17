import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useApp } from '../viewmodels/AppContext';
import { Script } from '../models/Script';
import SettingsView from './SettingsView';

export default function DirectoryView() {
  const { scripts, addScript, deleteScript, updateScriptTitle, selectScript } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [scriptToRename, setScriptToRename] = useState<Script | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState('');
  const [newScriptContent, setNewScriptContent] = useState('');

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleCreateScript = () => {
    setNewScriptTitle('');
    setNewScriptContent('');
    setCreateModalVisible(true);
  };

  const confirmCreate = async () => {
    try {
      const title = newScriptTitle.trim() || '未命名文案';
      const content = newScriptContent.trim();

      if (content.length === 0) {
        return;
      }

      const cards = content.split('\n').map(line => line.trim().replace(/\r/g, '')).filter(line => line.length > 0);

      if (cards.length === 0) {
        return;
      }

      await addScript(title, cards);
      setCreateModalVisible(false);
      setNewScriptTitle('');
      setNewScriptContent('');
    } catch (error) {
      console.error('confirmCreate error:', error);
    }
  };

  const handleDeleteScript = (script: Script) => {
    Alert.alert(
      '删除文案',
      `确定要删除"${script.title}"吗？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => deleteScript(script.id) },
      ]
    );
  };

  const handleRenameScript = (script: Script) => {
    setScriptToRename(script);
    setNewTitle(script.title);
    setRenameModalVisible(true);
  };

  const confirmRename = () => {
    if (scriptToRename && newTitle.trim().length > 0) {
      updateScriptTitle(scriptToRename.id, newTitle.trim());
    }
    setRenameModalVisible(false);
    setScriptToRename(null);
  };

  const toggleSelectMode = () => {
    if (isSelectMode) {
      setIsSelectMode(false);
      setSelectedIds(new Set());
    } else {
      setIsSelectMode(true);
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === scripts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(scripts.map(s => s.id)));
    }
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      '删除选中文案',
      `确定要删除选中的 ${selectedIds.size} 条文案吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            for (const id of selectedIds) {
              await deleteScript(id);
            }
            setSelectedIds(new Set());
            setIsSelectMode(false);
          },
        },
      ]
    );
  };

  const handleScriptPress = (script: Script) => {
    if (isSelectMode) {
      toggleSelectItem(script.id);
    } else {
      selectScript(script);
    }
  };

  const renderScriptItem = ({ item }: { item: Script }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <TouchableOpacity
        style={[styles.scriptItem, isSelected && styles.scriptItemSelected]}
        onPress={() => handleScriptPress(item)}
        onLongPress={isSelectMode ? undefined : () => handleRenameScript(item)}
      >
        {isSelectMode && (
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        )}
        <View style={styles.scriptInfo}>
          <Text style={styles.scriptTitle}>{item.title}</Text>
          <Text style={styles.scriptMeta}>{item.cards.length} 句</Text>
        </View>
        {!isSelectMode && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteScript(item)}
          >
            <Text style={styles.deleteButtonText}>🗑</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSelectMode}>
          <Text style={styles.headerTitle}>
            {isSelectMode ? '取消' : '我的文案'}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          {isSelectMode ? (
            <>
              <TouchableOpacity style={styles.headerButton} onPress={toggleSelectAll}>
                <Text style={styles.headerButtonText}>
                  {selectedIds.size === scripts.length ? '取消全选' : '全选'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerButton, selectedIds.size === 0 && styles.headerButtonDisabled]}
                onPress={deleteSelected}
                disabled={selectedIds.size === 0}
              >
                <Text style={[styles.headerButtonText, styles.deleteText]}>
                  删除 ({selectedIds.size})
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(true)}>
                <Text style={styles.headerButtonText}>⚙️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleCreateScript}>
                <Text style={styles.headerButtonText}>+</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {scripts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>点击 + 新建文案</Text>
          <Text style={styles.emptySubtitle}>手动输入或粘贴要提词的内容</Text>
        </View>
      ) : (
        <FlatList
          data={scripts}
          keyExtractor={item => item.id}
          renderItem={renderScriptItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Create Script Modal */}
      <Modal visible={createModalVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={styles.createModalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.createModalHeader}>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
              <Text style={styles.createModalCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.createModalTitle}>新建文案</Text>
            <TouchableOpacity onPress={confirmCreate}>
              <Text style={styles.createModalDone}>完成</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.createModalContent}>
            <TextInput
              style={styles.titleInput}
              value={newScriptTitle}
              onChangeText={setNewScriptTitle}
              placeholder="输入文案标题（可选）"
              placeholderTextColor="#8e8e93"
            />

            <View style={styles.contentInputContainer}>
              <TextInput
                style={styles.contentInput}
                value={newScriptContent}
                onChangeText={setNewScriptContent}
                placeholder="在此输入或粘贴文案内容..."
                placeholderTextColor="#8e8e93"
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.pasteButton}
              onPress={async () => {
                const Clipboard = require('expo-clipboard');
                const text = await Clipboard.getStringAsync();
                if (text) {
                  setNewScriptContent(prev => prev + (prev.length > 0 ? '\n' : '') + text);
                }
              }}
            >
              <Text style={styles.pasteButtonText}>📋 快捷粘贴</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Rename Modal */}
      <Modal visible={renameModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>重命名文案</Text>
            <TextInput
              style={styles.modalInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="输入新标题"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmRename}
              >
                <Text style={styles.confirmButtonText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSettings} animationType="slide">
        <SettingsView onClose={() => setShowSettings(false)} />
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
    color: '#007aff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonDisabled: {
    opacity: 0.4,
  },
  headerButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  deleteText: {
    color: '#ff3b30',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8e8e93',
  },
  listContent: {
    padding: 20,
  },
  scriptItem: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scriptItemSelected: {
    backgroundColor: 'rgba(0,122,255,0.15)',
    borderWidth: 1,
    borderColor: '#007aff',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8e8e93',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scriptInfo: {
    flex: 1,
  },
  scriptTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  scriptMeta: {
    fontSize: 14,
    color: '#8e8e93',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  createModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  createModalCancel: {
    fontSize: 17,
    color: '#8e8e93',
  },
  createModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  createModalDone: {
    fontSize: 17,
    color: '#007aff',
    fontWeight: '600',
  },
  createModalContent: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 16,
    fontSize: 17,
    color: '#fff',
    marginBottom: 16,
  },
  contentInputContainer: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  pasteButton: {
    marginTop: 16,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  pasteButtonText: {
    fontSize: 16,
    color: '#007aff',
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
    width: '85%',
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
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
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
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import DataManager, { Script, AppSettings, FloatingWindowConfig, WindowPreset } from '../models/Script';

interface AppContextType {
  scripts: Script[];
  selectedScript: Script | null;
  currentCardIndex: number;
  settings: AppSettings;
  isLoading: boolean;

  loadScripts: () => Promise<void>;
  addScript: (title: string, cards: string[]) => Promise<void>;
  deleteScript: (id: string) => Promise<void>;
  updateScriptTitle: (id: string, newTitle: string) => Promise<void>;
  selectScript: (script: Script | null) => void;
  nextCard: () => void;
  previousCard: () => void;
  resetCardIndex: () => void;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  updateSettings: (settings: AppSettings) => Promise<void>;
  saveFloatingWindowConfig: (config: FloatingWindowConfig) => Promise<void>;
  updatePreset: (presetId: string, config: FloatingWindowConfig) => Promise<void>;
  addPreset: (name: string, config: FloatingWindowConfig) => Promise<void>;
  deletePreset: (presetId: string) => Promise<void>;
  getActivePreset: () => WindowPreset | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [settings, setSettings] = useState<AppSettings>({
    textAlignment: 'center',
    floatingWindow: { width: 280, height: 220, opacity: 0.95 },
    presets: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadScripts = useCallback(async () => {
    const data = await DataManager.loadScripts();
    setScripts(data);
  }, []);

  const loadSettings = useCallback(async () => {
    const data = await DataManager.loadSettings();
    setSettings(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadScripts();
      await loadSettings();
      setIsLoading(false);
    };
    init();
  }, [loadScripts, loadSettings]);

  const addScript = async (title: string, cards: string[]) => {
    try {
      const newScript: Script = {
        id: DataManager.generateId(),
        title,
        cards,
        createdAt: new Date().toISOString(),
      };
      await DataManager.addScript(newScript);
      const data = await DataManager.loadScripts();
      setScripts([...data]);
    } catch (error) {
      console.error('addScript failed:', error);
    }
  };

  const deleteScript = async (id: string) => {
    try {
      await DataManager.deleteScript(id);
      const data = await DataManager.loadScripts();
      setScripts([...data]);
      if (selectedScript?.id === id) {
        setSelectedScript(null);
      }
    } catch (error) {
      console.error('deleteScript failed:', error);
    }
  };

  const updateScriptTitle = async (id: string, newTitle: string) => {
    try {
      await DataManager.updateScriptTitle(id, newTitle);
      const data = await DataManager.loadScripts();
      setScripts([...data]);
    } catch (error) {
      console.error('updateScriptTitle failed:', error);
    }
  };

  const selectScript = (script: Script | null) => {
    setSelectedScript(script);
    setCurrentCardIndex(0);
  };

  const nextCard = () => {
    if (selectedScript && currentCardIndex < selectedScript.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const resetCardIndex = () => {
    setCurrentCardIndex(0);
  };

  const canGoNext = () => {
    return selectedScript ? currentCardIndex < selectedScript.cards.length - 1 : false;
  };

  const canGoPrevious = () => {
    return currentCardIndex > 0;
  };

  const updateSettings = async (newSettings: AppSettings) => {
    await DataManager.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const saveFloatingWindowConfig = async (config: FloatingWindowConfig) => {
    const newSettings = { ...settings, floatingWindow: config };
    await DataManager.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const updatePreset = async (presetId: string, config: FloatingWindowConfig) => {
    if (!settings.presets) return;
    const updatedPresets = settings.presets.map(p =>
      p.id === presetId ? { ...p, config } : p
    );
    const newSettings = { ...settings, presets: updatedPresets };
    await DataManager.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const addPreset = async (name: string, config: FloatingWindowConfig) => {
    const newPreset: WindowPreset = {
      id: DataManager.generateId(),
      name,
      config,
    };
    const presets = [...(settings.presets || []), newPreset];
    const newSettings = { ...settings, presets };
    await DataManager.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const deletePreset = async (presetId: string) => {
    if (!settings.presets) return;
    if (settings.presets.length <= 1) return;
    const presets = settings.presets.filter(p => p.id !== presetId);
    const newSettings = { ...settings, presets };
    await DataManager.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const getActivePreset = () => {
    if (!settings.presets || settings.presets.length === 0) return undefined;
    return settings.presets.find(p => p.id === settings.activePresetId) || settings.presets[0];
  };

  return (
    <AppContext.Provider
      value={{
        scripts,
        selectedScript,
        currentCardIndex,
        settings,
        isLoading,
        loadScripts,
        addScript,
        deleteScript,
        updateScriptTitle,
        selectScript,
        nextCard,
        previousCard,
        resetCardIndex,
        canGoNext,
        canGoPrevious,
        updateSettings,
        saveFloatingWindowConfig,
        updatePreset,
        addPreset,
        deletePreset,
        getActivePreset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
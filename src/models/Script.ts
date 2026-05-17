import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Script {
  id: string;
  title: string;
  cards: string[];
  createdAt: string;
}

export interface FloatingWindowConfig {
  width: number;
  height: number;
  opacity: number;
  x?: number;
  y?: number;
}

export interface WindowPreset {
  id: string;
  name: string;
  config: FloatingWindowConfig;
}

export interface AppSettings {
  textAlignment: 'center' | 'left';
  floatingWindow?: FloatingWindowConfig;
  presets?: WindowPreset[];
  activePresetId?: string;
}

const SCRIPTS_KEY = 'scripts_data';
const SETTINGS_KEY = 'app_settings';

interface DataManagerType {
  loadScripts(): Promise<Script[]>;
  saveScripts(scripts: Script[]): Promise<void>;
  addScript(script: Script): Promise<Script[]>;
  deleteScript(id: string): Promise<Script[]>;
  updateScriptTitle(id: string, newTitle: string): Promise<Script[]>;
  loadSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
  generateId(): string;
}

const DataManagerInstance: DataManagerType = {
  async loadScripts() {
    try {
      const data = await AsyncStorage.getItem(SCRIPTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('loadScripts error:', error);
      return [];
    }
  },

  async saveScripts(scripts: Script[]) {
    try {
      await AsyncStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
    } catch (error) {
      console.error('saveScripts error:', error);
    }
  },

  async addScript(script: Script) {
    try {
      const data = await AsyncStorage.getItem(SCRIPTS_KEY);
      let scripts: Script[] = [];
      if (data) {
        scripts = JSON.parse(data);
      }
      scripts.unshift(script);
      await AsyncStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
      return scripts;
    } catch (error) {
      console.error('addScript error:', error);
      return [];
    }
  },

  async deleteScript(id: string) {
    try {
      const data = await AsyncStorage.getItem(SCRIPTS_KEY);
      if (data) {
        const scripts: Script[] = JSON.parse(data);
        const filtered = scripts.filter(s => s.id !== id);
        await AsyncStorage.setItem(SCRIPTS_KEY, JSON.stringify(filtered));
        return filtered;
      }
      return [];
    } catch (error) {
      console.error('deleteScript error:', error);
      return [];
    }
  },

  async updateScriptTitle(id: string, newTitle: string) {
    try {
      const data = await AsyncStorage.getItem(SCRIPTS_KEY);
      if (data) {
        const scripts: Script[] = JSON.parse(data);
        const index = scripts.findIndex(s => s.id === id);
        if (index !== -1) {
          scripts[index].title = newTitle;
          await AsyncStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
        }
        return scripts;
      }
      return [];
    } catch (error) {
      console.error('updateScriptTitle error:', error);
      return [];
    }
  },

  async loadSettings() {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        const settings = JSON.parse(data);
        if (!settings.presets || settings.presets.length === 0) {
          settings.presets = [
            { id: 'default', name: '默认预设', config: { width: 280, height: 220, opacity: 0.95 } },
            { id: 'small', name: '小窗口', config: { width: 200, height: 160, opacity: 0.9 } },
            { id: 'large', name: '大窗口', config: { width: 350, height: 280, opacity: 0.95 } },
          ];
        }
        return settings;
      }
      return {
        textAlignment: 'center',
        presets: [
          { id: 'default', name: '默认预设', config: { width: 280, height: 220, opacity: 0.95 } },
          { id: 'small', name: '小窗口', config: { width: 200, height: 160, opacity: 0.9 } },
          { id: 'large', name: '大窗口', config: { width: 350, height: 280, opacity: 0.95 } },
        ],
        floatingWindow: { width: 280, height: 220, opacity: 0.95 },
        activePresetId: 'default',
      };
    } catch (error) {
      console.error('loadSettings error:', error);
      return { textAlignment: 'center' };
    }
  },

  async saveSettings(settings: AppSettings) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('saveSettings error:', error);
    }
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  }
};

export default DataManagerInstance;
import React, { useState } from 'react';
import { customThemeManager, CustomTheme } from '../config/customThemeManager';
import { themeManager } from '../config/themeManager';
import useSettingsStore from '../stores/settingsStore';

interface CustomThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomThemePanel: React.FC<CustomThemePanelProps> = ({ isOpen, onClose }) => {
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(
    customThemeManager.getAllCustomThemes()
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [selectedBaseTheme, setSelectedBaseTheme] = useState('AppleNotesDark');
  const [authorName, setAuthorName] = useState('');

  const { selectedTheme, setSelectedTheme } = useSettingsStore();

  const refreshCustomThemes = () => {
    setCustomThemes(customThemeManager.getAllCustomThemes());
  };

  const handleCreateTheme = () => {
    if (!newThemeName.trim()) {
      alert('请输入主题名称');
      return;
    }

    // 获取当前用户设置
    const userConfig = useSettingsStore.getState();
    
    const newTheme = customThemeManager.createThemeFromCurrentSettings(
      newThemeName.trim(),
      selectedBaseTheme,
      userConfig,
      authorName.trim() || undefined
    );

    if (newTheme) {
      refreshCustomThemes();
      setShowCreateForm(false);
      setNewThemeName('');
      setAuthorName('');
      alert('自定义主题创建成功！');
    } else {
      alert('创建主题失败，请重试');
    }
  };

  const handleDeleteTheme = (themeId: string) => {
    if (confirm('确定要删除这个自定义主题吗？此操作不可撤销。')) {
      if (customThemeManager.deleteCustomTheme(themeId)) {
        refreshCustomThemes();
        // 如果删除的是当前选中的主题，切换到Apple Notes Dark主题
        if (selectedTheme === themeId) {
          setSelectedTheme('AppleNotesDark');
        }
        alert('主题删除成功');
      } else {
        alert('删除失败');
      }
    }
  };

  const handleExportTheme = (themeId: string) => {
    const exportData = customThemeManager.exportTheme(themeId);
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportData.theme.name}.theme.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        const importedTheme = customThemeManager.importTheme(importData);
        if (importedTheme) {
          refreshCustomThemes();
          alert('主题导入成功！');
        } else {
          alert('导入失败，请检查文件格式');
        }
      } catch (error) {
        alert('导入失败，文件格式不正确');
      }
    };
    reader.readAsText(file);
    
    // 清空input值，允许重复导入同一文件
    event.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--accent-primary)',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">自定义主题管理</h2>
              <p className="text-sm opacity-70">创建、管理和分享您的专属主题</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建主题
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              导入主题
              <input
                type="file"
                accept=".json"
                onChange={handleImportTheme}
                className="hidden"
              />
            </label>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div 
              className="p-4 rounded-lg mb-6 border"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)'
              }}
            >
              <h3 className="font-semibold mb-4">创建新主题</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">主题名称 *</label>
                  <input
                    type="text"
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    placeholder="输入主题名称"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">基础主题</label>
                  <select
                    value={selectedBaseTheme}
                    onChange={(e) => setSelectedBaseTheme(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {themeManager.getAllThemes().map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">作者名称</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="输入您的名称（可选）"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateTheme}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white'
                    }}
                  >
                    创建
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom Themes List */}
          <div>
            <h3 className="font-semibold mb-4">我的自定义主题 ({customThemes.length})</h3>
            
            {customThemes.length === 0 ? (
              <div 
                className="text-center py-8 rounded-lg border-2 border-dashed"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                <p>还没有自定义主题</p>
                <p className="text-sm mt-1">点击"创建主题"开始制作您的专属主题</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor: selectedTheme === theme.id ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      borderColor: selectedTheme === theme.id ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: selectedTheme === theme.id ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{theme.name}</h4>
                        <p className="text-sm opacity-70 mt-1">{theme.description}</p>
                        <div className="flex items-center gap-4 text-xs opacity-60 mt-2">
                          {theme.author && <span>作者: {theme.author}</span>}
                          <span>创建: {new Date(theme.createdAt).toLocaleDateString()}</span>
                          {theme.updatedAt !== theme.createdAt && (
                            <span>更新: {new Date(theme.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setSelectedTheme(theme.id)}
                          className="px-3 py-1 text-xs rounded-lg font-medium transition-all duration-200"
                          style={{
                            backgroundColor: selectedTheme === theme.id ? 'rgba(255,255,255,0.2)' : 'var(--accent-primary)',
                            color: selectedTheme === theme.id ? 'white' : 'white'
                          }}
                        >
                          {selectedTheme === theme.id ? '已选中' : '应用'}
                        </button>
                        
                        <button
                          onClick={() => handleExportTheme(theme.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="导出主题"
                          style={{ color: selectedTheme === theme.id ? 'white' : 'var(--text-secondary)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteTheme(theme.id)}
                          className="p-1 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                          title="删除主题"
                          style={{ color: selectedTheme === theme.id ? 'white' : 'var(--text-secondary)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomThemePanel;
# 社交媒体图片优化指南 / Social Media Image Optimization Guide

## 小红书 (Xiaohongshu) 图片优化

### 🎯 优化策略

小红书会对上传的图片进行压缩，为了保持最佳画质，我们实施了以下优化策略：

#### 1. **超高分辨率导出**
- **像素比率**: `pixelRatio: 4` (4倍原始分辨率)
- **尺寸倍增**: 宽度和高度都放大4倍
- **最终分辨率**: 通常达到 1760×2344 像素或更高

#### 2. **格式优化**
- **JPEG格式**: 使用 `toJpeg()` 而非 PNG
- **质量设置**: `quality: 0.98` (98%质量)
- **背景色**: 白色背景 (`#ffffff`) 避免透明度问题

#### 3. **专用导出按钮**
- 红色 📱 按钮：专为小红书优化的导出
- 文件名：`xiaohongshu-card.jpg`
- 一键下载超高清版本

### 📊 质量对比

| 导出方式 | 像素比率 | 格式 | 质量 | 适用场景 |
|---------|---------|------|------|---------|
| 普通下载 ⬇ | 3x | PNG | 100% | 通用、透明背景 |
| 复制 📋 | 3x | PNG | 100% | 快速分享 |
| 小红书 📱 | 4x | JPEG | 98% | 社交媒体优化 |

### 🔧 技术细节

#### 导出参数优化
```javascript
{
  backgroundColor: '#ffffff',    // 白色背景
  pixelRatio: 4,                // 4倍分辨率
  skipAutoScale: true,          // 禁用自动缩放
  quality: 0.98,               // 98%质量
  width: originalWidth * 4,     // 4倍宽度
  height: originalHeight * 4    // 4倍高度
}
```

#### 样式优化
- 移除宽度限制 (`maxWidth: none`)
- 确保内容完整显示 (`overflow: visible`)
- 防止文字换行问题 (`whiteSpace: normal`)
- 优化弹性布局 (`flexShrink: 0`)

### 💡 使用建议

#### 对于小红书用户：
1. **使用红色 📱 按钮**导出专用版本
2. **检查文字清晰度**：放大查看是否有模糊
3. **文件大小**：通常在 500KB-2MB 之间
4. **上传后检查**：确认平台压缩后效果

#### 对于其他平台：
- **Instagram**: 使用普通PNG导出 ⬇
- **微信朋友圈**: 使用小红书优化版本 📱
- **微博**: 使用普通PNG导出 ⬇
- **Twitter**: 使用普通PNG导出 ⬇

### 🚀 性能优化

#### 导出速度
- 小红书版本导出时间较长（4倍分辨率）
- 等待时间：150ms（比普通版本多50ms）
- 建议在导出时保持页面稳定

#### 内存使用
- 高分辨率导出会占用更多内存
- 建议关闭其他大型应用
- 导出完成后内存会自动释放

### 🎨 最佳实践

#### 内容设计
1. **字体大小**: 确保在压缩后仍然清晰
2. **对比度**: 使用高对比度颜色组合
3. **细节元素**: 避免过于精细的装饰
4. **边距设置**: 留足够边距防止裁切

#### 导出流程
1. 完成内容编辑
2. 预览效果
3. 选择合适的导出方式
4. 下载并检查质量
5. 上传到目标平台

### 🔍 故障排除

#### 常见问题
- **文字模糊**: 尝试增大字体或使用粗体
- **图片过大**: 检查原始尺寸设置
- **导出失败**: 刷新页面重试
- **质量不佳**: 确保使用小红书专用导出

#### 技术支持
如果遇到问题，请检查：
1. 浏览器控制台错误信息
2. 网络连接状态
3. 浏览器兼容性（推荐Chrome/Edge）

---

## English Version

### Xiaohongshu (Little Red Book) Image Optimization

#### Optimization Strategy
- **Ultra-high resolution**: 4x pixel ratio
- **JPEG format**: Better compression handling
- **Quality**: 98% for optimal balance
- **Background**: White background for consistency

#### Export Options
- 📱 **Red Button**: Xiaohongshu optimized (4x resolution JPEG)
- ⬇ **Download**: Standard PNG (3x resolution)
- 📋 **Copy**: Quick share PNG (3x resolution)

#### Best Practices
1. Use the red 📱 button for social media
2. Check text clarity after export
3. Verify quality after platform upload
4. Consider file size (500KB-2MB typical)

---

*最后更新: 2024年12月*
# easyName

A simple and efficient VS Code extension that automatically translates selected Chinese text into **camelCase** English variable names.

一个简单高效的 VS Code 插件，能将选中的中文文本一键翻译并转换为**小驼峰命名 (camelCase)** 的英文变量名。

## Features (功能特性)

- 🚀 **One-Click Translation**: Select any Chinese text and press the shortcut to translate it instantly. (一键翻译：选中中文，按下快捷键即可瞬间翻译)
- 🐪 **CamelCase Formatting**: Automatically formats the translated English into `camelCase`, perfect for programming variables. (自动驼峰：自动将翻译后的英文格式化为 `camelCase` 小驼峰命名，非常适合作为变量名)
- 🌍 **Powered by MyMemory**: Fast and free translation API out of the box. (基于 MyMemory 翻译 API，开箱即用的免费快速翻译服务)
- ⚙️ **Customizable**: Configure translation endpoints, source/target languages, and timeout settings. (高度可定制：可配置翻译接口地址、源语言/目标语言以及超时时间)

## Usage (使用说明)

1. Open any text file or code editor in VS Code. (在 VS Code 中打开任意文本或代码文件)
2. **Select the Chinese text** you want to translate. (选中你想要翻译的中文文本)
3. Use the shortcut `Ctrl+Alt+.` (Windows/Linux) or `Cmd+Alt+.` (Mac) to trigger the translation. (使用快捷键触发翻译)
4. The selected text will be replaced with the camelCase English variable name automatically! (选中的文本将自动被替换为小驼峰形式的英文变量名)

### Example (示例)

**Before (转换前):**

```javascript
const 用户名称 = 'John Doe';
const 获取详细信息列表 = () => {};
```

**After (按下 `Ctrl+Alt+.` 转换后):**

```javascript
const userName = 'John Doe';
const getDetailedInformationList = () => {};
```

## Extension Settings (配置项)

This extension contributes the following settings (可以在设置中搜索 `easyName` 进行配置):

- `easyName.translate.endpoint`: Translation API endpoint. Default is `https://api.mymemory.translated.net/get` (翻译接口地址)
- `easyName.translate.sourceLang`: Source language code. Default is `zh-CN` (源语言代码，默认为简体中文)
- `easyName.translate.targetLang`: Target language code. Default is `en-US` (目标语言代码，默认为英语)
- `easyName.translate.timeoutMs`: Request timeout in milliseconds. Default is `8000` (请求超时时间，单位毫秒)

## Known Issues (已知问题)

- The translation quality depends on the free MyMemory API. Long or highly technical sentences might need manual adjustment. (翻译质量依赖于免费的 MyMemory API。对于过长或高度专业的词汇可能需要微调)

## Feedback and Bug Reports (意见反馈与报错)

If you encounter any issues, bugs, or have feature requests, please feel free to open an issue on GitHub:
如果您在使用过程中遇到任何问题、报错，或者有新的功能建议，欢迎在 GitHub 上提出 Issue：

👉 [Submit an Issue (提交报错/反馈)](https://github.com/BZSH2/easyName/issues)

## Release Notes (版本记录)

See [CHANGELOG.md](changelog.md) for details.

---

**Enjoy coding with easyName!**

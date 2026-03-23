import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('easyName.main', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      void vscode.window.showWarningMessage('未找到激活编辑器');
      return;
    }

    const source = await resolveSourceText(editor);
    if (!source) {
      return;
    }

    try {
      const translatedText = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'easyName 正在翻译并生成命名...'
        },
        async () => translateText(source.text)
      );
      const pickedNaming = await pickNamingResult(translatedText);
      if (!pickedNaming) {
        void vscode.window.showInformationMessage('已取消命名应用');
        return;
      }
      if (!pickedNaming.value) {
        void vscode.window.showErrorMessage('翻译结果为空，无法生成命名');
        return;
      }

      await editor.edit((editBuilder) => {
        if (source.type === 'selection') {
          editBuilder.replace(source.selection, pickedNaming.value);
          return;
        }
        editBuilder.insert(source.position, pickedNaming.value);
      });
      const copyAction = '复制结果';
      const action = await vscode.window.showInformationMessage(
        `已生成 ${pickedNaming.label}: ${pickedNaming.value}`,
        copyAction
      );
      if (action === copyAction) {
        await vscode.env.clipboard.writeText(pickedNaming.value);
        void vscode.window.showInformationMessage('命名结果已复制到剪贴板');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '调用翻译接口失败';
      void vscode.window.showErrorMessage(message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}

type SourceInput =
  | {
      type: 'selection';
      text: string;
      selection: vscode.Selection;
    }
  | {
      type: 'input';
      text: string;
      position: vscode.Position;
    };

type NamingPick = {
  label: string;
  value: string;
  description: string;
};

type TranslateConfig = {
  endpoint: string;
  sourceLang: string;
  targetLang: string;
  timeoutMs: number;
};

function getTranslateConfig(): TranslateConfig {
  const config = vscode.workspace.getConfiguration('easyName');
  return {
    endpoint: config.get<string>('translate.endpoint', 'https://api.mymemory.translated.net/get'),
    sourceLang: config.get<string>('translate.sourceLang', 'zh-CN'),
    targetLang: config.get<string>('translate.targetLang', 'en-US'),
    timeoutMs: config.get<number>('translate.timeoutMs', 8000)
  };
}

async function translateText(text: string): Promise<string> {
  const { endpoint, sourceLang, targetLang, timeoutMs } = getTranslateConfig();
  const url = new URL(endpoint);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `${sourceLang}|${targetLang}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`翻译接口请求失败: ${response.status}`);
    }

    const result = (await response.json()) as {
      responseData?: { translatedText?: string };
    };
    const translated = result.responseData?.translatedText?.trim();
    if (!translated) {
      throw new Error('翻译接口返回空结果');
    }
    return translated;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('翻译请求超时');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function toCamelCase(input: string): string {
  const words = toWords(input);
  if (words.length === 0) {
    return '';
  }
  return words
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

function toPascalCase(input: string): string {
  const words = toWords(input);
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function toSnakeCase(input: string): string {
  return toWords(input).join('_');
}

function toKebabCase(input: string): string {
  return toWords(input).join('-');
}

function toWords(input: string): string[] {
  // MyMemory API 有时候会返回带标点符号的结果，或者本身包含大写字母（如 'Get User Info'）
  const normalized = input
    .replace(/[_-]+/g, ' ') // 连字符转空格
    .replace(/([a-z])([A-Z])/g, '$1 $2') // 处理原本就是驼峰的情况，将其拆开
    .replace(/[^a-zA-Z0-9\s]/g, ' ') // 移除非字母数字的字符
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim()
    .toLowerCase();
  if (!normalized) {
    return [];
  }
  return normalized.split(' ');
}

async function resolveSourceText(editor: vscode.TextEditor): Promise<SourceInput | undefined> {
  const selection = editor.selection;
  const selectedText = editor.document.getText(selection).trim();
  if (selectedText) {
    return {
      type: 'selection',
      text: selectedText,
      selection
    };
  }
  const input = await vscode.window.showInputBox({
    title: 'easyName 命名',
    prompt: '当前无选中内容，请输入中文描述后生成命名',
    placeHolder: '例如：用户列表查询条件'
  });
  const text = input?.trim();
  if (!text) {
    void vscode.window.showWarningMessage('未输入内容，已取消');
    return undefined;
  }
  return {
    type: 'input',
    text,
    position: selection.active
  };
}

async function pickNamingResult(translatedText: string): Promise<NamingPick | undefined> {
  const candidates: NamingPick[] = [
    {
      label: 'camelCase',
      value: toCamelCase(translatedText),
      description: '小驼峰（推荐变量/函数）'
    },
    {
      label: 'PascalCase',
      value: toPascalCase(translatedText),
      description: '大驼峰（推荐类型/类）'
    },
    { label: 'snake_case', value: toSnakeCase(translatedText), description: '下划线命名' },
    { label: 'kebab-case', value: toKebabCase(translatedText), description: '短横线命名' }
  ];
  const quickPickItems = candidates.map((candidate) => ({
    label: `${candidate.label}: ${candidate.value || '(空结果)'}`,
    description: candidate.description,
    candidate
  }));
  const picked = await vscode.window.showQuickPick(quickPickItems, {
    title: '选择命名格式',
    placeHolder: '请选择要应用的命名格式'
  });
  return picked?.candidate;
}

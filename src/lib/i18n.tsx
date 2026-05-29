import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { EntityType } from './entities';

export type Lang = 'en' | 'zh';

type EntityMap = Record<EntityType, string>;

interface Strings {
  nav: { workbench: string; how: string; model: string; limitations: string; repo: string };
  hero: {
    eyebrow: string;
    h1a: string;
    h1b: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    params: string; paramsNote: string;
    context: string; contextNote: string;
    classes: string; classesNote: string;
    previewTitle: string;
    live: string;
    from: string; date: string; phone: string; address: string;
    body1: string; body2: string; body3: string; body4: string; body5: string;
    entitiesDetected: string;
  };
  workbench: {
    title: string; lede: string;
    pasteTab: string; fileTab: string;
    words: string; chars: string;
    placeholder: string;
    dropTitle: string; dropProcessed: string;
    clearFile: string; note: string; moreChars: (n: string) => string;
    highlight: string; mask: string; redact: string; export: string;
    loadingTitle: string; loadingSize: string;
    errorLead: string; errorTip: string;
    detected: string;
    footerNote: string;
  };
  how: { h2: string; lede: string; steps: { title: string; body: string }[] };
  model: {
    eyebrow: string; h2: string; lede: string;
    archTitle: string;
    fType: string; vType: string;
    fBackbone: string; vBackbone: string;
    fAttention: string; vAttention: string;
    fFfn: string; vFfn: string;
    fWidth: string; vWidth: string;
    fHead: string; vHead: string;
    glance: string;
    total: string; activePerToken: string;
    contextWindow: string;
    spanCategories: string;
    detectedEntities: string; classes: string;
  };
  formats: {
    h2: string; lede: string;
    names: Record<string, string>;
    sameOut: string; txtOut: string;
  };
  limitations: {
    eyebrow: string; h2: string; lede: string;
    items: { title: string; body: string }[];
  };
  footer: { tagline: string; modelHF: string; repo: string; modelCard: string };
  status: { idle: string; loadingModel: string; loading: (p: string) => string; ready: string; analyzing: string; error: string };
  entityLabel: EntityMap;
  entityDesc: EntityMap;
}

const en: Strings = {
  nav: { workbench: 'Workbench', how: 'How it works', model: 'Model', limitations: 'Limitations', repo: 'Model repo' },
  hero: {
    eyebrow: 'Open weights · Apache 2.0',
    h1a: 'Privacy never leaves',
    h1b: 'your device.',
    lede: "LocalMask is a browser-native PII filter powered by OpenAI's open-weight Privacy Filter. Text, PDF, Word, and Excel are analyzed entirely on your machine. Nothing is uploaded.",
    ctaPrimary: 'Open the workbench',
    ctaSecondary: 'How it works',
    params: 'Params', paramsNote: '/ 50M active',
    context: 'Context', contextNote: 'tokens',
    classes: 'Classes', classesNote: 'entities',
    previewTitle: 'Preview · sample input',
    live: 'Live',
    from: 'From:', date: 'Date:', phone: 'Phone:', address: 'Address:',
    body1: 'Please rotate the API key',
    body2: 'before the audit. The legacy webhook at',
    body3: 'is no longer in scope.',
    body4: 'Charge confirmation #',
    body5: 'was processed.',
    entitiesDetected: '8 entities detected',
  },
  workbench: {
    title: 'Workbench',
    lede: 'Paste text or drop a file. The model loads once, runs locally, and never sees the network after the initial download.',
    pasteTab: 'Paste text', fileTab: 'Upload file',
    words: 'words', chars: 'chars',
    placeholder: 'Paste any text containing names, emails, addresses, keys, or other identifiers…',
    dropTitle: 'Drop a file or click to browse',
    dropProcessed: 'Processed entirely in this tab',
    clearFile: 'Clear file', note: 'Note',
    moreChars: (n) => `… ${n} more chars`,
    highlight: 'Highlight', mask: 'Mask', redact: 'Redact', export: 'Export',
    loadingTitle: 'Model loading on first visit', loadingSize: '~700 MB · cached after',
    errorLead: 'Model failed to load.',
    errorTip: 'Tip: WebGPU works best in Chrome / Edge / latest Safari. Older browsers fall back to WASM which is slower but still functional.',
    detected: 'detected',
    footerNote: 'Output formats: text, Markdown, JSON, CSV, and TSV export to their original format with substitutions applied. PDF, Word, and Excel files are flattened to plain text on export because rewriting the original layout in-browser is out of scope.',
  },
  how: {
    h2: 'On-device, end to end.',
    lede: 'Everything that touches your text runs in this browser tab. The lifecycle in four steps.',
    steps: [
      { title: 'The weights download once.', body: "On your first visit, the openai/privacy-filter ONNX weights (q4f16, around 700 MB) are fetched from Hugging Face and stored in your browser's Cache Storage. After that, the page works offline." },
      { title: 'Files are parsed in this tab.', body: 'PDFs go through pdf.js, Word documents through Mammoth, spreadsheets through SheetJS, and plain formats are read directly. No bytes leave the page.' },
      { title: 'A Web Worker runs the model.', body: 'Transformers.js hosts the classifier in a dedicated worker thread, on WebGPU when available, otherwise WASM. The main thread stays responsive while a single bidirectional pass labels every token.' },
      { title: 'You decide what to do with it.', body: 'Highlight to inspect, mask to replace each span with a typed placeholder for downstream pipelines, or redact to erase the span entirely. Export as a clean file when you are ready.' },
    ],
  },
  model: {
    eyebrow: 'The model',
    h2: 'A bidirectional classifier, not a chatbot.',
    lede: 'OpenAI Privacy Filter is a token-classification model adapted from a gpt-oss-style autoregressive checkpoint. Instead of generating text, it labels every token in a single forward pass and decodes coherent spans with a constrained Viterbi procedure.',
    archTitle: 'Architecture',
    fType: 'Type', vType: 'Bidirectional token classifier',
    fBackbone: 'Backbone', vBackbone: 'Pre-norm transformer, 8 blocks',
    fAttention: 'Attention', vAttention: 'GQA · 14 Q heads / 2 KV heads · RoPE · banded (window 257)',
    fFfn: 'FFN', vFfn: 'Sparse MoE · 128 experts · top-4 routing',
    fWidth: 'Width', vWidth: 'd_model = 640',
    fHead: 'Output head', vHead: '33 classes (1 O + 8 × BIOES)',
    glance: 'At a glance',
    total: 'total', activePerToken: '50M active per token',
    contextWindow: 'context window, no chunking',
    spanCategories: 'privacy span categories',
    detectedEntities: 'Detected entities', classes: '8 classes',
  },
  formats: {
    h2: 'Eight formats in, two formats out.',
    lede: 'Plain formats round-trip. Rich documents are parsed for analysis and exported as plain text so layout can never leak through.',
    names: {
      TXT: 'Plain text', MD: 'Markdown', JSON: 'JSON', CSV: 'Comma-separated', TSV: 'Tab-separated',
      PDF: 'PDF document', DOCX: 'Word document', XLSX: 'Excel workbook',
    },
    sameOut: 'same format out', txtOut: 'exports as .txt',
  },
  limitations: {
    eyebrow: 'Model card excerpt',
    h2: 'What this is not.',
    lede: "Reading the model card carefully is part of using the model responsibly. The bullets below come directly from OpenAI's published limitations.",
    items: [
      { title: 'A redaction aid, not an anonymization guarantee.', body: 'Privacy Filter is a data-minimization aid. Treating its output as proof of anonymization risks missing the actual privacy objective. Use it as one layer in a holistic privacy-by-design approach.' },
      { title: 'A static label policy.', body: 'The model identifies eight categories of personal data. Real privacy use cases are more varied. Changing label boundaries requires fine-tuning the model, not configuration at runtime.' },
      { title: 'Best in English, on Latin scripts.', body: 'Performance may drop on non-English text, non-Latin scripts, protected-group naming patterns, or domains that are out of distribution.' },
      { title: 'Known failure modes.', body: 'Possible under-detection of uncommon names, regional naming conventions, initials, and domain-specific identifiers. Possible over-redaction of public entities, organizations, or benign high-entropy strings that resemble secrets. Fragmented spans in heavy-layout text.' },
      { title: 'High-sensitivity workflows need human review.', body: 'Medical, legal, financial, HR, education, and government workflows carry real cost on both false negatives and false positives. Keep humans in the loop.' },
    ],
  },
  footer: { tagline: 'Browser-native PII filter', modelHF: 'Model on Hugging Face', repo: 'openai/privacy-filter', modelCard: 'Model card (PDF)' },
  status: { idle: 'Idle', loadingModel: 'Loading model', loading: (p) => `Loading model · ${p}%`, ready: 'Ready', analyzing: 'Analyzing', error: 'Error' },
  entityLabel: {
    private_person: 'Person', private_email: 'Email', private_phone: 'Phone', private_address: 'Address',
    private_url: 'URL', private_date: 'Date', account_number: 'Account', secret: 'Secret',
  },
  entityDesc: {
    private_person: 'A person name or identifier',
    private_email: 'An email address',
    private_phone: 'A phone or fax number',
    private_address: 'A physical or mailing address',
    private_url: 'A URL pointing to a private resource',
    private_date: 'A date attached to a person',
    account_number: 'A financial or account number',
    secret: 'A password, key, token, or credential',
  },
};

const zh: Strings = {
  nav: { workbench: '工作台', how: '工作原理', model: '模型', limitations: '局限性', repo: '模型仓库' },
  hero: {
    eyebrow: '开放权重 · Apache 2.0',
    h1a: '隐私数据',
    h1b: '永不离开你的设备。',
    lede: 'LocalMask 是一款浏览器原生的 PII 过滤器，由 OpenAI 开放权重的 Privacy Filter 模型驱动。文本、PDF、Word 和 Excel 全部在你本机分析，任何内容都不会上传。',
    ctaPrimary: '打开工作台',
    ctaSecondary: '工作原理',
    params: '参数', paramsNote: '/ 5000万激活',
    context: '上下文', contextNote: 'tokens',
    classes: '类别', classesNote: '种实体',
    previewTitle: '预览 · 示例输入',
    live: '实时',
    from: '发件人：', date: '日期：', phone: '电话：', address: '地址：',
    body1: '请在审计前轮换 API 密钥',
    body2: '。位于以下地址的旧版 webhook',
    body3: '已不在范围内。',
    body4: '扣款确认号 #',
    body5: '已处理完成。',
    entitiesDetected: '检测到 8 个实体',
  },
  workbench: {
    title: '工作台',
    lede: '粘贴文本或拖入文件。模型只加载一次，在本地运行，首次下载后不再访问网络。',
    pasteTab: '粘贴文本', fileTab: '上传文件',
    words: '词', chars: '字符',
    placeholder: '粘贴任何包含姓名、邮箱、地址、密钥或其他标识信息的文本……',
    dropTitle: '拖入文件或点击浏览',
    dropProcessed: '完全在本标签页中处理',
    clearFile: '清除文件', note: '注意',
    moreChars: (n) => `…… 还有 ${n} 个字符`,
    highlight: '高亮', mask: '替换', redact: '涂黑', export: '导出',
    loadingTitle: '首次访问正在加载模型', loadingSize: '约 700 MB · 之后缓存',
    errorLead: '模型加载失败。',
    errorTip: '提示：WebGPU 在 Chrome / Edge / 最新版 Safari 上效果最佳。旧版浏览器会回退到 WASM，速度较慢但仍可用。',
    detected: '已检测',
    footerNote: '导出格式：文本、Markdown、JSON、CSV 和 TSV 会以原格式导出并应用替换。PDF、Word 和 Excel 文件在导出时会展平为纯文本，因为在浏览器内重写原始排版不在本工具范围内。',
  },
  how: {
    h2: '端到端，全程在设备上。',
    lede: '接触你文本的每一步都在这个浏览器标签页内运行。生命周期分为四步。',
    steps: [
      { title: '权重只下载一次。', body: '首次访问时，openai/privacy-filter 的 ONNX 权重（q4f16，约 700 MB）会从 Hugging Face 获取并存入浏览器的 Cache Storage。此后页面即可离线工作。' },
      { title: '文件在本标签页内解析。', body: 'PDF 经由 pdf.js，Word 文档经由 Mammoth，电子表格经由 SheetJS，纯文本格式直接读取。没有任何字节离开页面。' },
      { title: 'Web Worker 运行模型。', body: 'Transformers.js 在独立的 worker 线程中托管分类器，可用时使用 WebGPU，否则使用 WASM。单次双向前向传播为每个 token 打标签时，主线程始终保持响应。' },
      { title: '由你决定如何处理。', body: '高亮以检查，替换以将每个片段换成带类型的占位符供下游流程使用，或涂黑以彻底抹去片段。准备好后导出为干净的文件。' },
    ],
  },
  model: {
    eyebrow: '关于模型',
    h2: '一个双向分类器，而非聊天机器人。',
    lede: 'OpenAI Privacy Filter 是一个 token 分类模型，由 gpt-oss 风格的自回归检查点改造而来。它不生成文本，而是在单次前向传播中为每个 token 打标签，并用受约束的 Viterbi 算法解码出连贯的片段。',
    archTitle: '架构',
    fType: '类型', vType: '双向 token 分类器',
    fBackbone: '主干', vBackbone: 'Pre-norm transformer，8 层',
    fAttention: '注意力', vAttention: 'GQA · 14 Q 头 / 2 KV 头 · RoPE · 带状（窗口 257）',
    fFfn: '前馈网络', vFfn: '稀疏 MoE · 128 专家 · top-4 路由',
    fWidth: '宽度', vWidth: 'd_model = 640',
    fHead: '输出头', vHead: '33 类（1 个 O + 8 × BIOES）',
    glance: '一览',
    total: '总计', activePerToken: '每 token 激活 5000 万',
    contextWindow: '上下文窗口，无需分块',
    spanCategories: '种隐私片段类别',
    detectedEntities: '可检测实体', classes: '8 个类别',
  },
  formats: {
    h2: '八种格式进，两种格式出。',
    lede: '纯文本格式可原样往返。富文档会被解析以供分析，并以纯文本导出，使排版永远不会泄露。',
    names: {
      TXT: '纯文本', MD: 'Markdown', JSON: 'JSON', CSV: '逗号分隔', TSV: '制表符分隔',
      PDF: 'PDF 文档', DOCX: 'Word 文档', XLSX: 'Excel 工作簿',
    },
    sameOut: '原格式导出', txtOut: '导出为 .txt',
  },
  limitations: {
    eyebrow: '模型卡摘录',
    h2: '它不是什么。',
    lede: '认真阅读模型卡是负责任地使用该模型的一部分。以下条目直接来自 OpenAI 公布的局限性说明。',
    items: [
      { title: '一种脱敏辅助手段，而非匿名化保证。', body: 'Privacy Filter 是一种数据最小化辅助工具。将其输出视为匿名化的证明，可能会偏离真正的隐私目标。请将它作为整体「隐私设计」方案中的一层。' },
      { title: '固定的标签策略。', body: '该模型识别八类个人数据。真实的隐私场景更为多样。改变标签边界需要对模型进行微调，而非运行时配置。' },
      { title: '在英语、拉丁字母上表现最佳。', body: '在非英语文本、非拉丁字母、受保护群体的命名模式，或分布外的领域上，性能可能下降。' },
      { title: '已知的失效模式。', body: '可能漏检不常见的姓名、地区性命名习惯、缩写以及领域特定的标识符。可能过度涂黑公众实体、组织，或与密钥相似的良性高熵字符串。在重排版文本中片段可能被切碎。' },
      { title: '高敏感场景需要人工复核。', body: '医疗、法律、金融、人力资源、教育和政府场景中，漏报和误报都会带来实际代价。请保留人工把关。' },
    ],
  },
  footer: { tagline: '浏览器原生 PII 过滤器', modelHF: '在 Hugging Face 上查看模型', repo: 'openai/privacy-filter', modelCard: '模型卡（PDF）' },
  status: { idle: '空闲', loadingModel: '正在加载模型', loading: (p) => `正在加载模型 · ${p}%`, ready: '就绪', analyzing: '分析中', error: '错误' },
  entityLabel: {
    private_person: '人名', private_email: '邮箱', private_phone: '电话', private_address: '地址',
    private_url: '网址', private_date: '日期', account_number: '账号', secret: '密钥',
  },
  entityDesc: {
    private_person: '人名或个人标识',
    private_email: '电子邮箱地址',
    private_phone: '电话或传真号码',
    private_address: '实体或邮寄地址',
    private_url: '指向私有资源的网址',
    private_date: '与个人关联的日期',
    account_number: '金融或账户号码',
    secret: '密码、密钥、token 或凭据',
  },
};

const DICT: Record<Lang, Strings> = { en, zh };

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: Strings }
const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = 'localmask-lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') return saved;
  } catch { /* ignore */ }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  return <LangContext.Provider value={{ lang, setLang, t: DICT[lang] }}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

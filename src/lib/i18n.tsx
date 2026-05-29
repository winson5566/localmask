import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { EntityType } from './entities';

export type Lang = 'en' | 'zh';

type EntityMap = Record<EntityType, string>;

interface Strings {
  nav: { workbench: string; how: string; repo: string };
  hero: {
    h1a: string;
    h1b: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
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
    detect: string; detecting: string;
    highlight: string; mask: string; redact: string; export: string; exporting: string;
    loadingTitle: string; loadingSize: string;
    errorLead: string; errorTip: string;
    detected: string;
    footerNote: string;
  };
  how: { h2: string; lede: string; steps: { title: string; body: string }[] };
  formats: {
    h2: string; lede: string;
    names: Record<string, string>;
    sameOut: string; pdfOut: string;
  };
  footer: { tagline: string };
  status: { idle: string; loadingModel: string; loading: (p: string) => string; ready: string; analyzing: string; error: string };
  entityLabel: EntityMap;
  entityDesc: EntityMap;
}

const en: Strings = {
  nav: { workbench: 'Try it', how: 'How it works', repo: 'GitHub' },
  hero: {
    h1a: 'Privacy never leaves',
    h1b: 'your device.',
    lede: 'LocalMask is a browser-native filter for identifiable information (PII). Text, PDF, Word, and Excel are analyzed entirely on your machine. Nothing is uploaded.',
    ctaPrimary: 'Open the workbench',
    ctaSecondary: 'How it works',
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
    title: 'Try it',
    lede: 'Paste text or drop a file. The model loads once, runs locally, and never sees the network after the initial download.',
    pasteTab: 'Paste text', fileTab: 'Upload file',
    words: 'words', chars: 'chars',
    placeholder: 'Paste any text containing names, emails, addresses, keys, or other identifiers…',
    dropTitle: 'Drop a file or click to browse',
    dropProcessed: 'Processed entirely in this tab',
    clearFile: 'Clear file', note: 'Note',
    moreChars: (n) => `… ${n} more chars`,
    detect: 'Detect', detecting: 'Detecting…',
    highlight: 'Highlight', mask: 'Mask', redact: 'Redact', export: 'Export', exporting: 'Exporting…',
    loadingTitle: 'Model loading on first visit', loadingSize: '~700 MB · cached after',
    errorLead: 'Model failed to load.',
    errorTip: 'Tip: WebGPU works best in Chrome / Edge / latest Safari. Older browsers fall back to WASM which is slower but still functional.',
    detected: 'detected',
    footerNote: 'Mask and Redact export in the original format. Text, Markdown, JSON, CSV, and TSV round-trip directly. Excel and Word keep their structure; PDF pages are rasterized to images so redacted text is truly removed (the exported PDF is image-based and not selectable). Pick Mask or Redact to export a document — Highlight is for on-screen review.',
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
  formats: {
    h2: 'Same format in, same format out.',
    lede: 'Plain text formats round-trip directly. Excel and Word keep their structure and layout; PDF stays a PDF, rasterized to images so redacted content is truly removed.',
    names: {
      TXT: 'Plain text', MD: 'Markdown', JSON: 'JSON', CSV: 'Comma-separated', TSV: 'Tab-separated',
      PDF: 'PDF document', DOCX: 'Word document', XLSX: 'Excel workbook',
    },
    sameOut: 'same format out', pdfOut: 'image PDF out',
  },
  footer: { tagline: 'Browser-native PII filter' },
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
  nav: { workbench: '试一试', how: '工作原理', repo: 'GitHub' },
  hero: {
    h1a: '隐私数据',
    h1b: '永不离开你的设备。',
    lede: 'LocalMask 是一款浏览器原生的可识别信息（PII）过滤器。文本、PDF、Word 和 Excel 全部在你本机分析，任何内容都不会上传。',
    ctaPrimary: '打开工作台',
    ctaSecondary: '工作原理',
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
    title: '试一试',
    lede: '粘贴文本或拖入文件。模型只加载一次，在本地运行，首次下载后不再访问网络。',
    pasteTab: '粘贴文本', fileTab: '上传文件',
    words: '词', chars: '字符',
    placeholder: '粘贴任何包含姓名、邮箱、地址、密钥或其他标识信息的文本……',
    dropTitle: '拖入文件或点击浏览',
    dropProcessed: '完全在本标签页中处理',
    clearFile: '清除文件', note: '注意',
    moreChars: (n) => `…… 还有 ${n} 个字符`,
    detect: '检测', detecting: '检测中…',
    highlight: '高亮', mask: '替换', redact: '涂黑', export: '导出', exporting: '导出中…',
    loadingTitle: '首次访问正在加载模型', loadingSize: '约 700 MB · 之后缓存',
    errorLead: '模型加载失败。',
    errorTip: '提示：WebGPU 在 Chrome / Edge / 最新版 Safari 上效果最佳。旧版浏览器会回退到 WASM，速度较慢但仍可用。',
    detected: '已检测',
    footerNote: '替换和涂黑都按原格式导出。文本、Markdown、JSON、CSV 和 TSV 直接原样往返；Excel 和 Word 保留结构；PDF 页面会栅格化为图片，使涂黑的文字被彻底移除（导出的 PDF 为图片型、不可选中）。导出文档请选择「替换」或「涂黑」——「高亮」仅用于屏幕查看。',
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
  formats: {
    h2: '什么格式进，什么格式出。',
    lede: '纯文本格式直接原样往返；Excel 和 Word 保留结构与排版；PDF 仍是 PDF，会栅格化为图片以彻底移除涂黑内容。',
    names: {
      TXT: '纯文本', MD: 'Markdown', JSON: 'JSON', CSV: '逗号分隔', TSV: '制表符分隔',
      PDF: 'PDF 文档', DOCX: 'Word 文档', XLSX: 'Excel 工作簿',
    },
    sameOut: '原格式导出', pdfOut: '图片型 PDF',
  },
  footer: { tagline: '浏览器原生 PII 过滤器' },
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

# LocalMask

A browser-native PII filter powered by [OpenAI Privacy Filter](https://huggingface.co/openai/privacy-filter).
Text, PDF, Word, and Excel are analyzed entirely on your device. Nothing is uploaded.

- Open weights, Apache 2.0
- 1.5B params (50M active, MoE), 128k context
- Runs on WebGPU when available, falls back to WASM
- Detects 8 entity classes: person, email, phone, address, URL, date, account number, secret

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output to ./dist
npm run preview  # serve dist locally
```

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- `@huggingface/transformers` running in a Web Worker
- File parsers (all client-side): `pdfjs-dist`, `mammoth`, `xlsx`

## Deployment

Static build (`dist/`) served by any HTTP server. On Coolify: build command
`npm run build`, publish directory `dist`.

## Output formats

TXT / MD / JSON / CSV / TSV round-trip to the same format.
PDF / DOCX / XLSX are parsed for analysis and exported as plain text;
rewriting the original document layout in-browser is out of scope.

## Honest limits

LocalMask is a redaction aid, not an anonymization guarantee. See the
[OpenAI Privacy Filter model card](https://cdn.openai.com/pdf/c66281ed-b638-456a-8ce1-97e9f5264a90/OpenAI-Privacy-Filter-Model-Card.pdf)
for the full list of failure modes and the recommendation to keep humans in
the loop for high-sensitivity workflows.

## License

Apache 2.0, matching the upstream model license.

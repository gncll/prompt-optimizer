# Claude API Setup

Claude API'sı CORS kısıtlamaları nedeniyle browser'dan direkt çağrılamaz. Bu yüzden basit bir proxy server oluşturduk.

## Kurulum

1. **Proxy Server'ı Başlatın:**
   ```bash
   npm run proxy
   ```
   Bu komut `http://localhost:3001` adresinde proxy server'ı başlatır.

2. **React Uygulamasını Başlatın:**
   ```bash
   npm start
   ```
   Bu komut `http://localhost:3000` adresinde React uygulamasını başlatır.

3. **Alternatif - Her İkisini Birden Başlatın:**
   ```bash
   npm run dev
   ```
   Bu komut hem proxy server'ı hem de React uygulamasını aynı anda başlatır.

## API Key Konfigürasyonu

`.env` dosyasında Anthropic API key'iniz tanımlı olmalı:
```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-api03-...
```

## Nasıl Çalışır?

- React uygulaması Claude API'sına doğrudan erişemez (CORS hatası)
- Proxy server (`server.js`) Claude API'sına backend'den erişir
- React uygulaması proxy server'a istek yapar: `http://localhost:3001/api/claude`
- Proxy server Claude API'sına isteği iletir ve yanıtı React'a döner

## Troubleshooting

**"Claude proxy server is not running" Hatası:**
- Proxy server'ın çalıştığından emin olun: `npm run proxy`
- Health check: `curl http://localhost:3001/health`

**API Key Hatası:**
- `.env` dosyasında `REACT_APP_ANTHROPIC_API_KEY` tanımlı olmalı
- Server'ı yeniden başlatın: `npm run proxy`

**Port Çakışması:**
- Proxy server port 3001 kullanır
- React app port 3000 kullanır
- Gerekirse `server.js`'de port'u değiştirin 
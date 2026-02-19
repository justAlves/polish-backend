# Polish Backend

Backend para app de conversação por voz com IA para prática de idiomas.

## 📋 O que é o Polish?

O Polish permite que usuários pratiquem idiomas conversando por voz com uma IA, simulando uma ligação telefônica. Após cada sessão, o sistema analisa a conversa e fornece feedback personalizado sobre pontos de melhoria no idioma praticado.

**Fluxo básico:**
1. Usuário inicia uma "ligação" escolhendo o idioma
2. Conversa por voz com a IA em tempo real
3. Sistema salva a conversa (texto + áudio)
4. IA gera análise com pontos de melhoria, erros comuns e recomendações

## 🛠️ Stack Tecnológica

- **Runtime**: [Bun](https://bun.sh) - Runtime JavaScript ultra-rápido
- **Framework**: [Elysia.js](https://elysiajs.com) - Framework web TypeScript-first
- **Autenticação**: [Better Auth](https://www.better-auth.com) - Auth moderno e type-safe
- **Banco de dados**: PostgreSQL
- **ORM**: Prisma
- **IA + Speech (MVP - custo-benefício)**:
  - **Speech-to-Text**: [Groq Whisper](https://groq.com) - Whisper ultra-rápido e **GRATUITO** (até 25 req/min)
  - **Conversação**: [Groq Llama](https://groq.com) - Llama 3.3 70B **GRATUITO** (rápido, 300 tokens/s)
  - **Text-to-Speech**: [ElevenLabs](https://elevenlabs.io) - 10k chars/mês grátis (ou OpenAI TTS $15/1M chars)
  - **Análise**: [OpenAI GPT-4o-mini](https://openai.com) - $0.15/1M tokens (barato e bom)
  
## 🚀 Próximos Passos

1. ✅ Setup básico: Bun + Elysia + Prisma + Better Auth
2. 🔄 Implementar fluxo de conversação com Groq
3. 🔄 Adicionar TTS com ElevenLabs
4. 🔄 Implementar análise com GPT-4o-mini
5. ⏳ Deploy (Railway/Fly.io/Render)
6. ⏳ Conectar com app React Native

## 📚 Recursos

- [Groq Documentation](https://console.groq.com/docs)
- [ElevenLabs API](https://elevenlabs.io/docs)
- [Elysia Documentation](https://elysiajs.com)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [Prisma + PostgreSQL](https://www.prisma.io/docs)
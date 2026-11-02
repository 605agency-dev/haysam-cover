# Haysam Cover

Claude uchun plagin: Instagram muqovasini bitta gapdan sizning Figma faylingizda yasaydi.

Siz matn, tool va bitta gap yo'nalish berasiz. Claude g'oyani topadi, 15 ta layoutdan yangisini tanlaydi, rasmni Nano Banana 2 da yaratadi va tahrirlanadigan 9:16 + 4:5 muqovani Figmangizga qo'yadi.

Sayt: https://haysam-cover.vercel.app

## O'rnatish (Claude Code / Claude Desktop)

```
/plugin marketplace add 605agency-dev/haysam-cover
/plugin install haysam-cover@haysam
/mcp
```

`/mcp` da Figma va Higgsfield'ga o'z profilingiz bilan kiring. API kalit kerak emas.

## Ishlatish

```
haysam cover: "Yangi darslik chiqdi", Claude, kod yozmasdan sayt yasash
```

Natija: Figma faylingizdagi `Haysam Covers` sahifasida 9:16 muqova va 4:5 kesimi.

## Nima bor

| Yo'l | Nima |
| --- | --- |
| `.claude-plugin/` | plagin va marketplace manifesti |
| `.mcp.json` | Figma va Higgsfield MCP (OAuth) |
| `skills/haysam-cover/` | skill, layout retseptlari, Figma kit skripti, rasmiy logolar |
| `web/` | landing sahifa |

## English

Claude plugin that builds editable Instagram covers (9:16 + 4:5) in your own Figma file from a headline, a tool name and one line of direction. Connect Figma and Higgsfield with your own accounts via `/mcp`; no API keys.

Third party logos are trademarks of their owners. Code is MIT licensed.

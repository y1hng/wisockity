# wisockity
wisockity: A lightweight, low-level custom TCP/IP binary protocol and secure Server-Client communication framework engineered from scratch in Python with custom 25-byte packet headers and session rotation.

## 🛠️ Protocol Architecture (25 Bytes Header)
- **Magic Bytes (`!H`):** `0x1346`
- **Checksum (`!H`):** `0x4441`
- **Session UUID (`!16s`):** 16-byte raw binary unique identifier.
- **Payload Length (`!I`):** 4-byte big-endian integer (supports up to 4GB payloads).
- **Command & Flags (`!B`):** Bitmask flags for state control (`STR`, `DNN`, `PSH`, `RST`, `KLL`).

## 📚 Documentation & Dev Logs
Explore the complete architecture planning and daily development logs on the [wisockity Docs Website](https://y1hng.github.io/wisockity).

# wisockity
Wisockity is an early-stage Python project for a custom binary client-server protocol. The current work establishes protocol utilities: a 25-byte header, UTF-8 payload encoding, command flags, and an initial time-window-based session ID design. Client/server transport and protocol validation are not implemented yet, so the project should not be considered a complete or security-reviewed communication framework.

## Protocol Architecture (25-byte Header)
- **Magic Bytes (`!H`):** `0x1346`
- **Checksum (`!H`):** `0x4441`
- **Session ID (`!16s`):** 16-byte header field. The current generator returns 16 hexadecimal characters derived from HMAC-SHA256 and a client fingerprint; it is not a raw UUID and does not guarantee a unique ID per connection.
- **Payload Length (`!I`):** 4-byte big-endian integer (supports up to 4GB payloads).
- **Command & Flags (`!B`):** Command values currently defined as flags (`STR`, `DNN`, `PSH`, `RST`, `KLL`, and planned ping flag `PNN`).

## Documentation
See the live documentation page at [`docs/index.html`](docs/index.html). It fetches and renders the Markdown files in `docs/` directly; serve the repository over HTTP to use it. The docs describe current code and known gaps, and do not claim that transport, session validation, or security features are complete. MkDocs is not required.



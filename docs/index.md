# Project overview

**Wisockity** is an early-stage Python project for a custom binary protocol between a client and a server. Current work is focused on the protocol's core primitives: packet header packing and unpacking, command flags, and an initial session ID design. The repository does not yet contain a working TCP client or server.

## Current status

| Area | Current state |
| --- | --- |
| Fixed packet header | Defined in `PACK.py` and `UNPACK.py`; 25 bytes |
| Payload encoding | UTF-8 encoding and decoding helpers exist |
| Command flags | Defined in `flags.py`; `PNN` is a planned ping flag |
| ID generation | HMAC-SHA256 prefix scoped to a 10-minute time window and client fingerprint |
| ID validation | Initial helper exists, but its calls omit a required client fingerprint |
| Ping exchange | Planned; `PNN.py` does not implement heartbeat behavior yet |
| Client and server | Files are placeholders; no connection flow is implemented |

## Intended packet flow

1. Encode a text payload as UTF-8.
2. Pack `magic`, `check`, `id`, payload length, and command into the fixed-width header.
3. Send the header and payload over a transport layer. The transport is not implemented yet.
4. Unpack the fields and payload on the receiving side, then validate them according to the protocol rules.

Read the [module guide](modules.md) for a file-by-file explanation, or the [protocol specification](protocol_spec.md) for the header layout and current limits.

## Known gaps

- The repository does not yet implement client/server TCP transport.
- `validid.checkid` calls `generate_session_id` without its required `client_fingerprint` argument, so the current validation path raises an error.
- The same client fingerprint produces the same ID in a given time window. The current design does not guarantee a unique ID per connection or absolute uniqueness across clients.
- Earlier README wording described security and session rotation more strongly than the source code supports. This documentation records current behavior; it is not a security review.

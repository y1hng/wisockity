# Current protocol specification

This specification is based on the `struct` format in `PACK.py` and `UNPACK.py`, together with the project's `header.txt` notes. It describes the current header foundation, not a complete transport protocol.

## Header layout

The Python format string is `!HH16sIB`. Its fixed size is 25 bytes.

| Offset | Field | Size | Type | Current value or meaning |
| ---: | --- | ---: | --- | --- |
| 0 | `magic` | 2 bytes | `H` | `0x1346` in the project notes |
| 2 | `check` | 2 bytes | `H` | `0x4441` in the project notes |
| 4 | `id` | 16 bytes | `16s` | Session ID, passed into the field as supplied |
| 20 | `length` | 4 bytes | `I` | Payload length in bytes; theoretical maximum is `2^32 - 1` |
| 24 | `cmd` | 1 byte | `B` | Command/flag value |

`!` selects network byte order (big-endian). Total size: `2 + 2 + 16 + 4 + 1 = 25` bytes.

## Command flags

| Flag | Value | Recorded meaning |
| --- | ---: | --- |
| `STR` | `0x01` | Start |
| `DNN` | `0x02` | Done / acknowledgment |
| `PSH` | `0x04` | Push data |
| `RST` | `0x08` | Reset ID |
| `KLL` | `0x10` | Close connection |
| `PNN` | `0x20` | Planned ping flag; heartbeat behavior is not implemented |

## Payload encoding

`PACK.enc` encodes text as UTF-8 and calculates the length from the resulting bytes. `UNPACK.dec` decodes UTF-8 bytes back into text. There is not yet a helper that combines header and payload, nor a TCP read loop that ensures the complete header and payload have arrived.

## Session ID and validation

`generate_session_id` returns the first 16 hexadecimal characters of an HMAC-SHA256 digest calculated from the shared secret, a 10-minute time slot, and a client fingerprint. Although it is 16 characters long, this is not a raw UUID as older README wording suggested. When a string is passed to `packing`, it is UTF-8 encoded before being placed into the `16s` field.

Validation is intended to compare the current and previous IDs. However, `validid.checkid` does not pass the required `client_fingerprint` to the generator, so the current call fails. The same fingerprint also yields the same ID in the same time slot; the design does not provide a unique ID per connection. The identity input and uniqueness requirements need to be settled before this becomes a stable protocol contract.

## Current implementation limits

- No client/server implementation or TCP transport is present in the current files.
- `magic`, `check`, and payload-length bounds are not validated during unpacking.
- Flag meanings are recorded, but state transitions and combinations are not defined in code.
- The protocol should not be treated as complete or security-reviewed until transport, validation, and threat-model work are addressed.

# Module guide

This guide describes the files as they exist today and separates implemented helpers from planned behavior. Paths below are relative to `wisockity/server/core/` unless noted.

## `flags.py`

Defines the `flags` dictionary mapping command names to bitmask values.

| Name | Value | Recorded meaning |
| --- | ---: | --- |
| `STR` | `0x01` | Start |
| `DNN` | `0x02` | Done / acknowledgment, according to the project notes |
| `PSH` | `0x04` | Push data |
| `RST` | `0x08` | Reset ID, according to the current notes |
| `KLL` | `0x10` | Close connection |
| `PNN` | `0x20` | New planned ping flag; heartbeat behavior is not implemented |

The values are defined, but state transitions and interactions between flags are not implemented in the client or server.

## `idgen.py`

`generate_session_id(SHARED_SECRET, client_fingerprint, offset=0)` takes a shared secret and a client fingerprint. It calculates a 10-minute time slot, applies `offset` to select another slot, and computes HMAC-SHA256 over `time_slot:client_fingerprint`. The function returns the first 16 hexadecimal characters of the digest.

The same secret and fingerprint produce the same ID within a time slot. Including a fingerprint associates the value with an input identity, but does not make it unique per connection or guarantee absolute uniqueness across clients. The returned value is 16 hex characters, not a raw UUID.

## `validid.py`

Imports `generate_session_id` and uses `hmac.compare_digest` to compare a supplied ID with the IDs for the current and previous time slots.

**Current issue:** `generate_session_id` requires `client_fingerprint`, but `checkid` calls it as `generate_session_id(key, offset=0)` and `generate_session_id(key, offset=-1)`. Calling `checkid` as written raises an error because the required argument is missing. The client fingerprint also needs to be part of the validation inputs.

## `PACK.py`

- `packing(magic, check, Id, length, cmd)` encodes a string ID as UTF-8 when necessary, then packs the fields with `struct.pack("!HH16sIB", ...)`.
- `!` selects network byte order (big-endian); `H` is an unsigned 16-bit value, `16s` is a 16-byte field, `I` is an unsigned 32-bit value, and `B` is an unsigned 8-bit value.
- `enc(payload)` encodes text as UTF-8 and returns the bytes together with their byte length, not the character count.

These helpers do not combine header and payload into a complete transmitted message or send data over a socket.

## `UNPACK.py`

- `unpacking(header)` unpacks the five fields using the same `!HH16sIB` format.
- `dec(data)` decodes payload bytes as UTF-8.

`unpacking` assumes it receives a complete 25-byte header. It does not currently validate `magic`, `check`, or the declared payload length.

## `PNN.py`

The file currently contains only an import of `struct`. `PNN` is defined in `flags.py` as the planned ping flag, but sending/receiving heartbeats and handling timeouts are not implemented.

## Client and server files

`wisockity/client/client.py` is effectively empty, and `wisockity/server/server.py` contains only a comment. A complete connection lifecycle or command-processing flow is not present yet.

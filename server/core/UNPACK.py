import struct

enco = 'utf-8'
def unpacking(header):
    magic, check, Id, length, cmd = struct.unpack("!HH16sIB", header)
    if isinstance(Id, bytes):
        Id = Id.decode(enco)
    return magic, check, Id, length, cmd

def dec(data):
    payload = data.decode(enco)
    return payload

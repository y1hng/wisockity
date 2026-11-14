import struct
enco = 'utf-8'
def packing(magic, check, Id, length, cmd):
    if isinstance(Id, str):
        Id = Id.encode(enco)
    header = struct.pack("!HH16sIB", magic, check, Id, length, cmd)
    return header

def enc(payload):
    data = payload.encode(enco)
    length = len(data)
    return data, length
  

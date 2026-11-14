import time
import hmac
import hashlib

def generate_session_id(SHARED_SECRET, client_fingerprint, offset=0):
    time_slot = int(time.time() // 600) + offset    
    msg = f"{time_slot}:{client_fingerprint}".encode('utf-8')        
    digest = hmac.new(SHARED_SECRET, msg, hashlib.sha256).hexdigest()
    return digest[:16]

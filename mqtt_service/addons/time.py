import socket
import struct
import time
from addons.addon import Addon

class TimeAddon(Addon):
  @staticmethod
  def requestTimefromNtp(addr='au.pool.ntp.org'):
    # Source: https://stackoverflow.com/a/56613595/3475385
    REF_TIME_1970 = 2208988800  # Reference time
    ntpClient = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    data = b'\x1b' + 47 * b'\0'
    ntpClient.sendto(data, (addr, 123))
    data, address = ntpClient.recvfrom(1024)
    if data:
      t = struct.unpack('!12I', data)[10]
      t -= REF_TIME_1970
    return time.ctime(t), t

  @staticmethod
  def update():
    # Get the UNIX timestamp from ntp server
    return TimeAddon.requestTimefromNtp(TimeAddon.config['ntpServer'])[1]

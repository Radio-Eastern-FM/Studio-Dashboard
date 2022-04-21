# Inherit from Addon to implement your own add-ons
# Within settings.py, ensure you register it as a MQTT worker
# Each time the MQTT worker requests data, it will call update()
# Return type must be string, bytearray, int, float or None

class Addon:
  @staticmethod
  def update():
    raise NotImplementedError('Do not instantiate Addon class. Inherit Addon.update() from it to  implement your own addons.');

import random
from settings import ADDONS
from utils.mqtt_client import MQTT
from utils.mqtt_worker import MQTTWorker

# Run the service if this is the main module
if __name__ == '__main__':
  # Init and Start MQTT client
  MQTT.initialise()
  MQTT.start()
  
  # Init our MQTT workers
  for addon in ADDONS:
    MQTTWorker(MQTT.client, addon.update, addon.config['interval'], addon.config['topic'])
  
  # and workers
  MQTTWorker.startAll()
  
  # Run forever
  MQTTWorker.loop()

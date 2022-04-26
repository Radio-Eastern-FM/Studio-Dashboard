import random

from paho.mqtt import client as mqtt_client

from settings import MQTT_CONFIGURATION as config

class MQTT:
  # Init a unique MQTT identifier
  client_id = config['mqttID'] + f'-{random.randint(0, 1000)}'
  client = None
  
  @staticmethod
  def connect():
    def on_connect(client, userdata, flags, rc):
      if rc == 0:
        print("Connected to MQTT Broker!")
      else:
        raise ConnectionError("Failed to connect to MQTT, return code %d\n", rc)
    
    MQTT.client.username_pw_set(config['username'], config['password'])
    MQTT.client.on_connect = on_connect
    try:
      MQTT.client.connect(config['host'], config['port'])
      return True
    except (ConnectionRefusedError): 
      print('Couldn\'t connect to MQTT broker');
      return False
  
  @staticmethod
  def initialise():
    # Create client
    MQTT.client = mqtt_client.Client(MQTT.client_id)
    # Connect to the MQTT broker
    while (not MQTT.connect()): pass
  
  @staticmethod
  def start():
    if(MQTT.client):
      MQTT.client.loop_start()
    else:
      raise ReferenceError("MQTT client must be initialise first; do so by calling MQTT.initialise()")
  
  @staticmethod
  def stop():
    MQTT.client.disconnect()
  


import threading
import time

class MQTTWorker(threading.Thread):
  workers = []
  def __init__(self, client, function, interval, topic):
    threading.Thread.__init__(self)
    
    self.event = threading.Event()
    self.function = function
    self.interval = interval
    self.topic = topic
    MQTTWorker.client = client
    
    # Add the new thread to the static workers list
    MQTTWorker.workers.append(self)
  
  def run(self):
    try:
      while not self.event.is_set():
        # Get actual message from the worker function
        msg = self.function()
        
        # Publish to MQTT
        result = MQTTWorker.client.publish(self.topic, msg)
        # Get the response status
        status = result[0]
        
        # If message sending went OK, print message and topic
        if status == 0:
          print(f"Send '{(msg[:40] + '...') if len(str(msg)) > 40 else msg}' to topic '{self.topic}'")
        # If message sending failed, print error and further details
        else:
          print(f"Failed to send message to topic {self.topic}. Message:\n\n{msg}")
        
        # Wait for an interval and kill all if KeyboardInterrupt
        self.event.wait(self.interval)
    
    # If a KeyboardInterrupt occurs, we kill all threads
    except KeyboardInterrupt:
      self.stop()
  
  def stop(self):
    self.event.set()
  
  @staticmethod
  def startAll():
    # Start every worker thread
    for worker in MQTTWorker.workers:
      worker.start()
  
  @staticmethod
  def stopAll():
    # Stop every worker thread
    for worker in MQTTWorker.workers:
      worker.stop()
  
  # Infinite loop
  @staticmethod
  def loop():
    while True: #
      try:
        time.sleep(0.05) # 50ms
      except KeyboardInterrupt:
        MQTTWorker.stopAll()
        MQTTWorker.client.disconnect()
        return

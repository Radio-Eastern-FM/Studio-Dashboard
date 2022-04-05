import datetime
import json
from pyclbr import Function
import threading
import time
from django.http import HttpResponse, StreamingHttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.template import loader
import urllib
from django.conf import settings

datetime_timer_running = False
weather_timer_running = False

class Message:
  def __init__(self, type: str, body:dict):
    self.type = type
    self.body = body
  def json(self):
    return json.dumps(self, default=lambda o: o.__dict__)


class Subscription:
  def __init__(self):
    self.queue = []
    self.messageAvailable = False
  
  def add(self, message:Message):
    self.queue.append(message)
    self.messageAvailable = True
  
  def pop(self):
    msg = self.queue.pop()
    
    if(len(self.queue) == 0):
      self.messageAvailable = False
    
    return msg

class MessageDeliverer:
  def __init__(self):
    self.subscribers = []
  
  def register(self, subscriber:Subscription):
    self.subscribers.append(subscriber)
    
  def deregister(self, subscriber:Subscription):
    self.subscribers.remove(subscriber)
  
  def notify(self, message:Message):
    for subscriber in self.subscribers:
      subscriber.add(message)

class StreamingHttpResponseWithCallback(StreamingHttpResponse):
  def setOnClose(self, func:Function):
    self.onClose = func
    
  def close(self):
    super(StreamingHttpResponseWithCallback, self).close()
    self.onClose()

message_deliverer = MessageDeliverer()

def update_time():
  threading.Timer(30, update_time).start()
  message_deliverer.notify(Message('date', {"date": datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}))
  
def update_weather():
  # threading.Timer(60, update_weather).start()
  threading.Timer(5*60, update_time).start()
  secret = settings.OPEN_WEATHER_API_KEY
  weatherURL = f"https://api.openweathermap.org/data/2.5/onecall?lat=-37.79616776238214&lon=145.2922194203585&APPID={secret}&exclude=hourly,minutely"
  with urllib.request.urlopen(weatherURL) as url:
    data = json.loads(url.read().decode())
    message_deliverer.notify(Message('weather', data))
  

def index(request):
  template = loader.get_template('index.html')
  context = {}
  response = HttpResponse(template.render(context, request))
  response.status = 200
  return response;

def stream(request):
  # Begin time service
  global datetime_timer_running
  if not datetime_timer_running:
    datetime_timer_running = True
    update_time()
    
  # Begin weather service
  global weather_timer_running
  if not weather_timer_running:
    weather_timer_running = True
    update_weather()
  
  subscription = Subscription()
  message_deliverer.register(subscription)
  
  def event_stream():
    while True:
      time.sleep(0.25)
      
      # Push messages from queue
      if subscription.messageAvailable:
        result = 'data: ['
        while(subscription.messageAvailable):
          result += subscription.pop().json() + ','
        
        result = result[:-1] + ']\n\n'
        yield result
  
  resp = StreamingHttpResponseWithCallback(event_stream(), content_type='text/event-stream')
  resp.setOnClose(lambda: message_deliverer.deregister(subscription))
  return resp

@xframe_options_exempt
def setLED(request):
  LED = request.GET["id"]
  state = str(request.GET["state"]) == "ON"
  
  msg = Message("pad", {'id': LED, 'state': state})
  message_deliverer.notify(msg);
  print(msg.json())
  
  response = HttpResponse(content=f"Set {msg.body['id']} to {msg.body['state']}", content_type='text/plain')
  response.status = 200
  return response;

@xframe_options_exempt
def alert(request):
  msg = Message("alert", {
    'text': request.GET["text"],
    'level': request.GET["level"],
    'timestamp': datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
  })
  message_deliverer.notify(msg);
  
  response = HttpResponse(content=msg.json(), content_type='text/plain')
  response.status = 200
  return response;

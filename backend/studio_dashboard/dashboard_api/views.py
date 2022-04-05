import datetime
import json
import threading
import time
from django.http import HttpResponse, StreamingHttpResponse
from django.template import loader
import urllib
from django.conf import settings

messageQueue = []

datetime_timer_running = False
weather_timer_running = False

class Message:
  def __init__(self, type: str, body:dict):
    self.type = type
    self.body = body
  def json(self):
    return json.dumps(self, default=lambda o: o.__dict__)

def update_time():
  threading.Timer(30, update_time).start()
  messageQueue.append(Message('date', {"date": datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}))
  
def update_weather():
  # threading.Timer(60, update_weather).start()
  threading.Timer(5*60, update_time).start()
  secret = settings.OPEN_WEATHER_API_KEY
  weatherURL = f"https://api.openweathermap.org/data/2.5/onecall?lat=-37.79616776238214&lon=145.2922194203585&APPID={secret}&exclude=hourly,minutely"
  with urllib.request.urlopen(weatherURL) as url:
    data = json.loads(url.read().decode())
    messageQueue.append(Message('weather', data))
  

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
  
  def event_stream():
    while True:
      time.sleep(0.25)
      
      # Push messages from queue
      if len(messageQueue) > 0:
        result = 'data: ['
        while(len(messageQueue) > 0):
          result += messageQueue.pop().json() + ','
        
        result = result[:-1] + ']\n\n'
        yield result
  
  return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

def setLED(request):
  LED = request.GET["id"]
  state = str(request.GET["state"]) == "ON"
  
  msg = Message("pad", {'id': LED, 'state': state})
  messageQueue.append(msg);
  
  response = HttpResponse(content=f"Set {msg.body['id']} to {msg.body['state']}", content_type='text/plain')
  response.status = 200
  return response;

def alert(request):
  msg = Message("alert", {
    'text': request.GET["text"],
    'level': request.GET["level"],
    'timestamp': datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
  })
  messageQueue.append(msg);
  
  for message in messageQueue:
    print(message.type)
  
  response = HttpResponse(content=msg.json(), content_type='text/plain')
  response.status = 200
  return response;

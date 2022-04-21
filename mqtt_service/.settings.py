from addons.time import TimeAddon
from addons.weather import WeatherAddon

TimeAddon.config = dict(
  ntpServer = 'au.pool.ntp.org',
  
  interval = 15,
  topic = 'efm/time'
)

WeatherAddon.config = dict(
  openWeatherApiKey = '<OPEN WEATHER API KEY>',
  lat = -37.79616776238214,
  lon = 145.2922194203585,
  
  interval = 30,
  topic = 'efm/weather'
)

defaultMQTT = dict(
  host = 'localhost',
  port = 1883,
  username = '',
  password = '',
  mqttmqttID = 'master'
)

MQTT_CONFIGURATION = defaultMQTT

ADDONS = [
  TimeAddon,
  WeatherAddon
]

# cd "g:/Program Files/mosquitto/"; ./mosquitto -v -c .\EFM.conf

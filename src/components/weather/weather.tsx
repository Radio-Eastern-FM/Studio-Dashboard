import React, { useEffect } from 'react';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';
import { faCloudRain, faRuler, faTemperatureHigh, faTemperatureLow } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import theme from '../../settings/theme';
import WeatherIcon from './WeatherIcon';
import usePersistentState from '../../services/persistent-state';

const Wrapper = styled.a`
  display: flex;
  flex-direction: column;
  color: ${theme.foreground};
  min-height: 20vh;
  background-color: ${theme.backgroundMuted};
  cursor: pointer;
  text-align: center;
  font-size: 1em;
  padding: 0.5em 0;
  text-decoration: none;
  h5{
    font-size: 1.1em;
    padding: 0.1em 0
  }
`;

const WeatherIconImg = styled.img`
  width: 100%;
  height: auto;
  max-width: 7.5rem;
  margin: auto;
`;

const WeatherIconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  & > div{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const WeatherDay = styled.div`
  border-radius: 3px;
  background-color: ${theme.backgroundAccent};
  display: flex;
  flex-direction: column;
  padding: 0.5em;
  margin: 0.5em 0.1em;
  align-items: flex-end;
  width: 100%;
  & > em{
    text-transform: capitalize;
    align-self: center;
    padding-bottom: 0.75em;
    margin-top: auto;
  }
  & > h5{
    align-self: center;
  }
`;

const WeatherField = styled.span`
  font-size: max(${(props:{size:number}) => props.size ? props.size : 1.25}em, ${(props:{size:number}) => props.size ? props.size*2 : 1.5}vw);
  color: ${(props:{colour:string}) => props.colour};
  margin: 0.1em 0;
`;

const WeatherDaysWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const numForcastDays = 4

function toCelsius (kelvin:number, decimals:number=0) {
  return toNDecimals(kelvin - 273.15, decimals);
  
}
function toNDecimals (value:number, decimals:number=0) {
  return Math.round((value)*Math.pow(10, decimals))/Math.pow(10, decimals);
}

function Weather(props: {children?:React.ReactNode, weather?:any, currentTemperature:number|null}) {
  const [isSelected, setIsSelected] = React.useState(false);
  const [lastUpdated, setLastUpdated] = usePersistentState<Date>("weatherLastUpdated", new Date());
  useEffect(() => {
    if(props.weather) setLastUpdated(new Date());
  }, [props.weather])
  return (
    <Wrapper
      loaded={props.weather !== null && props.weather !== undefined }
      onContextMenu={() => 
        window?.open("https://openweathermap.org/city/2169867", '_blank')?.focus()
      }
      onClick={() => setIsSelected(!isSelected)}>
      {(props.weather !== null && props.weather !== undefined ) &&
        <>  
          <WeatherIconWrapper>
            <WeatherIconImg
              src={WeatherIcon[props.weather.current.weather?.[0].icon]}
              alt=""
            />
            <div>
              <WeatherField size={2}>
                {toCelsius(props.weather.current.temp, 1)}&deg;
              </WeatherField>
              <WeatherField size={0.6}>
                <FontAwesomeIcon color={theme.weatherMeasurement} icon={faRuler}/>&nbsp;
                {props.currentTemperature && <>{toNDecimals(props.currentTemperature)}&deg;C</>}
              </WeatherField>
              <br />
              <WeatherField colour={theme.weatherHigh}>
                <FontAwesomeIcon icon={faTemperatureHigh}/>&nbsp;
                {toCelsius(props.weather.daily[0].temp.max)}&deg;C
              </WeatherField>
              <WeatherField colour={theme.weatherLow}>
                <FontAwesomeIcon icon={faTemperatureLow}/>&nbsp;
                {toCelsius(props.weather.daily[0].temp.min)}&deg;C
              </WeatherField>
              <WeatherField colour={theme.weatherRain}>
                <FontAwesomeIcon icon={faCloudRain}/>&nbsp;
                {props.weather.daily[0].pop*100}%
              </WeatherField>
            </div>
          </WeatherIconWrapper>
          {isSelected &&
            <>
            <WeatherField size={0.35}>
              Last updated: &nbsp;
              {lastUpdated.toLocaleDateString()} &nbsp;
              {lastUpdated.toLocaleTimeString()}
            </WeatherField>
              <WeatherDaysWrapper>
                {props.weather.daily.slice(1, numForcastDays).map((day:any, key:number) =>
                  (
                    <WeatherDay key={key}>
                      <h5>
                      {key === 0 ?
                        "Tomorrow" :
                        new Date(day.dt * 1000).toLocaleDateString("en-GB")}
                      </h5>
                      <WeatherIconImg
                        src={WeatherIcon[day.weather?.[0].icon]}
                        alt=""
                      />
                      <em>{day.weather[0].description}</em>
                      <WeatherField colour={theme.weatherHigh}>&nbsp;
                          <FontAwesomeIcon icon={faTemperatureHigh}/>
                        {toCelsius(day.temp.max)}&deg;C
                      </WeatherField>
                      <WeatherField colour={theme.weatherLow}>&nbsp;
                          <FontAwesomeIcon icon={faTemperatureLow}/>
                        {toCelsius(day.temp.min)}&deg;C
                      </WeatherField>
                      <WeatherField colour={theme.weatherRain}>
                        <FontAwesomeIcon icon={faCloudRain}/>&nbsp;
                        {day.pop*100}%
                      </WeatherField>
                    </WeatherDay>
                  )
                )}
              </WeatherDaysWrapper>
            </>
          }
        </>
      }
    </Wrapper>
  );
}

export default Weather;

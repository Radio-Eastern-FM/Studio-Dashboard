import React from 'react';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';
import { faCloudRain, faTemperatureHigh, faTemperatureLow } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import theme from '../../theme';
import WeatherIcon from './WeatherIcon';

const Wrapper = styled.a`
  display: flex;
  flex-direction: column;
  color: ${theme.foreground};
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
  border-radius: 10px;
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

const toCelsius = (kelvin:number, decimals:number=0) => Math.round((kelvin - 273.15)*Math.pow(10, decimals))/Math.pow(10, decimals)

function Weather(props: {children?:React.ReactNode, weather:any|null}) {
  return (
    <Wrapper href="https://openweathermap.org/city/2169867" target="_blank">
      {props.weather && 
        <>  
          <WeatherIconWrapper>
            <WeatherIconImg
              src={WeatherIcon[props.weather.current.weather?.[0].icon]}
              alt=""
            />
            <div>
              <WeatherField size={2}>
                {toCelsius(props.weather.current.temp, 1)}&#8451;
              </WeatherField>
              <br />
              <WeatherField colour={theme.weatherHigh}>
                <FontAwesomeIcon icon={faTemperatureHigh}/>&nbsp;
                {toCelsius(props.weather.daily[0].temp.max)}&#8451;
              </WeatherField>
              <WeatherField colour={theme.weatherLow}>
                <FontAwesomeIcon icon={faTemperatureLow}/>&nbsp;
                {toCelsius(props.weather.daily[0].temp.min)}&#8451;
              </WeatherField>
              <WeatherField colour={theme.weatherRain}>
                <FontAwesomeIcon icon={faCloudRain}/>&nbsp;
                {props.weather.daily[0].pop*100}%
              </WeatherField>
            </div>
          </WeatherIconWrapper>
          <WeatherDaysWrapper>
            {props.weather.daily.slice(1, 4).map((day:any, key:number) =>
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
                    {toCelsius(day.temp.max)}&#8451;
                  </WeatherField>
                  <WeatherField colour={theme.weatherLow}>&nbsp;
                      <FontAwesomeIcon icon={faTemperatureLow}/>
                    {toCelsius(day.temp.min)}&#8451;
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
    </Wrapper>
  );
}

export default Weather;

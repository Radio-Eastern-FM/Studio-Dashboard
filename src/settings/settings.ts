import { faHourglass2 } from '@fortawesome/free-regular-svg-icons'
import { faBell,  faPhone, faTowerCell, IconDefinition } from '@fortawesome/free-solid-svg-icons'

export const pads:Array<{
  id: string,
  text: string,
  colour: string,
  side: string,
  icon: IconDefinition}> = 
[
{
  id: "tower",
  text: "Tower",
  colour: "#35c28f",
  side: "right",
  icon: faTowerCell
},
// {
//   id: "streaming",
//   text: "Streaming",
//   colour: "#800000",
//   side: "left",
//   icon: faRadio
// },
{
  id: "pips",
  text: "Pips",
  colour: "#2147ae",
  side: "left",
  icon: faHourglass2
},
{
  id: "phone",
  text: "Phone",
  colour: "#eb851e",
  side: "left",
  icon: faPhone
},
{
  id: "door",
  text: "Doorbell",
  colour: "#f33333",
  side: "left",
  icon: faBell
}]

import { faBell, faCoffee, faMicrophone, faPhone, faRadio, faTowerCell, IconDefinition } from '@fortawesome/free-solid-svg-icons'

export const pads:Array<{
  id: string,
  text: string,
  colour: string,
  side: string,
  icon: IconDefinition}> = 
[{
  id: "tower",
  text: "Tower",
  colour: "#35c28f",
  side: "left",
  icon: faTowerCell
},
{
  id: "streaming",
  text: "Streaming",
  colour: "#800000",
  side: "left",
  icon: faRadio
},
{
  id: "mic",
  text: "Microphone",
  colour: "#2147ae",
  side: "left",
  icon: faMicrophone
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
  side: "right",
  icon: faBell
},
{
  id: "cofee",
  text: "Coffee",
  colour: "#f33333",
  side: "left",
  icon: faCoffee 
}]

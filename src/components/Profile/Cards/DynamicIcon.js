import React from 'react'
import {FontAwesome5, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';


const iconLibraries = {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
};
export default function DynamicIcon({library, name, size = 24, color = "#FFA500"}) {
  const IconComponent = iconLibraries[library]; 
  if (!IconComponent) {
    return null;
  }  
  return <IconComponent name={name} size={size} color={color} />;
}
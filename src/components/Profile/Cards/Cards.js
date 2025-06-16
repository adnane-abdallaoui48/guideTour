import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import DynamicIcon from './DynamicIcon'
import { fonts } from '../../../../assets/styles/font'
export default function Cards({name, iconName, iconLibrary, onPress}) {
  return (
    <View style={styles.container}>
        <View style={styles.cardsContainer}>
          <DynamicIcon name={iconName} library={iconLibrary} />
          <Text style={styles.title}>{name}</Text>
        </View>
        {
        (name === "Profil" || name === "Paramètres") ?  
                <TouchableOpacity onPress={onPress}>
                    <DynamicIcon name="arrow-forward-ios" library="MaterialIcons" />            
                </TouchableOpacity>
            : null
        }
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontFamily : fonts.medium,
        marginLeft: 30,

    },
})
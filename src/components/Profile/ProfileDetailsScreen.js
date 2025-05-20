import { View, Text } from 'react-native'

const ProfileDetailsScreen = ({route}) => {
  const { user } = route.params || {};
  return (
    <View>
      <Text>{user.firstName}</Text>
    </View>
  )
}

export default ProfileDetailsScreen


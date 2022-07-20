import React, { useEffect } from 'react'
import { 
  View,
  SafeAreaView, 
  ScrollView,
  Text ,
} from 'react-native'

const HomeContainer = ({ navigation }) => {
  const { Layout, Gutters, Fonts } = useTheme()

  const { t } = useTranslation()

  const init = async () => {
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true)
      }, 2000),
    )
    await setDefaultTheme({ theme: 'default', darkMode: null })
  }

  useEffect(() => {
    init()
  })

  return (
    <SafeAreaView style={[{backgroundColor: 'red'}]}>
      <ScrollView style={[Layout.fullWidth, {backgroundColor: 'red'}]}>
        <Text>
          Balakutak
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeContainer

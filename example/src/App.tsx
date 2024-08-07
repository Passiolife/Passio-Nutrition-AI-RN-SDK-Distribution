import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { LoadingContainerView } from './LoadingContainerView'

export default function App() {
  return (
    <View style={styles.container}>
      <LoadingContainerView />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})

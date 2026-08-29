import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const index = () => {
  return (
    <View>
      <Text>hellloooo</Text>

      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </View>

  )
}

export default index

const styles = StyleSheet.create({})
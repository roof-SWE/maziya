import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Login from '../screens/LoginScreen'
import Registration from '../screens/Registration'



function MainStackNavigator() {
    const Stack = createStackNavigator()
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name='Login' component={Login}  options={{ title: 'Login' }}/>
          <Stack.Screen name='Registration' component={Registration} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  
  export default MainStackNavigator
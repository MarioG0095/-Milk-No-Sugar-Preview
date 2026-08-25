import { Tabs } from 'expo-router';
import { colors } from '@/src/theme/theme';
export default function TabLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:colors.rose,tabBarStyle:{backgroundColor:'#FFFDFC',borderTopColor:colors.line}}}>
  <Tabs.Screen name="index" options={{title:'Read'}}/>
  <Tabs.Screen name="chapters" options={{title:'Chapters'}}/>
</Tabs>}

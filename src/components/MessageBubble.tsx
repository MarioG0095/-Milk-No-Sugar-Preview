import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/theme';

export function MessageBubble({sender,text}:{sender:string;text:string}){
  const mine=sender==='Me';
  const system=sender==='System';
  if(system)return <View style={s.system}><Text style={s.systemText}>{text}</Text></View>;
  return <View style={[s.row,mine&&s.rowMine]}>
    {!mine&&<View style={s.avatar}><Text style={s.initial}>{sender.slice(0,1).toUpperCase()}</Text></View>}
    <View style={[s.bubble,mine&&s.bubbleMine]}>
      {!mine&&<Text style={s.sender}>{sender}</Text>}
      <Text style={[s.text,mine&&s.textMine]}>{text}</Text>
    </View>
  </View>;
}

const s=StyleSheet.create({
  row:{width:'100%',flexDirection:'row',alignItems:'flex-end',gap:8,marginVertical:5},
  rowMine:{justifyContent:'flex-end'},
  avatar:{width:30,height:30,borderRadius:15,backgroundColor:colors.roseSoft,alignItems:'center',justifyContent:'center',marginBottom:1},
  initial:{color:colors.rose,fontWeight:'900',fontSize:11},
  bubble:{maxWidth:'80%',backgroundColor:colors.white,borderRadius:18,borderBottomLeftRadius:5,paddingHorizontal:14,paddingVertical:10},
  bubbleMine:{backgroundColor:colors.rose,borderBottomLeftRadius:18,borderBottomRightRadius:5},
  sender:{color:colors.rose,fontSize:10,fontWeight:'800',marginBottom:3,textTransform:'uppercase',letterSpacing:.6},
  text:{color:colors.ink,fontSize:16,lineHeight:22},
  textMine:{color:colors.white},
  system:{alignItems:'center',paddingVertical:8},
  systemText:{fontSize:11,color:colors.mutedInk,fontWeight:'700'},
});

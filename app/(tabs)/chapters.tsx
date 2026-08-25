import { Pressable,ScrollView,StyleSheet,Text,View } from 'react-native';
import { useRouter } from 'expo-router';
import book from '@/src/data/book';
import { colors } from '@/src/theme/theme';

export default function Chapters(){
  const r=useRouter();
  return <ScrollView style={s.root} contentContainerStyle={s.body}>
    <Text style={s.kicker}>INTERACTIVE PREVIEW</Text>
    <Text style={s.h1}>Chapters 1–4.</Text>
    <Text style={s.lead}>This public test contains only the first four chapters. The full manuscript remains in the private production repository.</Text>
    <View style={s.list}>{book.chapters.map(c=><Pressable key={c.id} style={s.card} onPress={()=>r.push(`/reader/${c.id}`)}><Text style={s.num}>CHAPTER {c.sourceChapter}</Text><Text style={s.title}>{c.title}</Text><Text style={s.loc}>{c.location}</Text></Pressable>)}</View>
  </ScrollView>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.paper},body:{paddingTop:70,paddingHorizontal:22,paddingBottom:40},kicker:{fontSize:11,letterSpacing:2,color:colors.rose,fontWeight:'800'},h1:{fontSize:36,fontWeight:'900',color:colors.ink,marginTop:8},lead:{fontSize:16,lineHeight:23,color:colors.mutedInk,marginTop:8},list:{marginTop:20,gap:12},card:{backgroundColor:'#FFFDFC',borderWidth:1,borderColor:colors.line,borderRadius:18,padding:18},num:{fontSize:9,letterSpacing:1.5,fontWeight:'900',color:colors.rose},title:{fontSize:21,fontWeight:'900',color:colors.ink,marginTop:5},loc:{fontSize:11,textTransform:'uppercase',letterSpacing:1,color:colors.mutedInk,marginTop:6}});

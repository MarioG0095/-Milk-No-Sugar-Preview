import { useCallback,useState } from 'react';
import { Pressable,ScrollView,StyleSheet,Text,View } from 'react-native';
import { useFocusEffect,useRouter } from 'expo-router';
import book from '@/src/data/book';
import { getProgress } from '@/src/lib/progress';
import { colors } from '@/src/theme/theme';

export default function Home(){
  const router=useRouter();
  const[p,setP]=useState({lastChapter:1,highestChapter:0});
  useFocusEffect(useCallback(()=>{getProgress().then(setP);},[]));
  const chapter=book.chapters[Math.max(0,Math.min(book.chapters.length-1,(p.lastChapter||1)-1))]||book.chapters[0];
  const returning=p.highestChapter>0;
  return <ScrollView style={s.root} contentContainerStyle={s.content}>
    <View style={s.hero}>
      <View style={s.badge}><Text style={s.badgeText}>INTERACTIVE PREVIEW</Text></View>
      <Text style={s.over}>AN INTERACTIVE NOVEL</Text>
      <Text style={s.milk}>MILK,</Text><Text style={s.sugar}>No Sugar</Text>
      <Text style={s.author}>MARIO GONCALVES</Text><Text style={s.tag}>{book.tagline}</Text>
    </View>
    <View style={s.body}>
      <Text style={s.kicker}>{returning?'WELCOME BACK':'TEST BUILD'}</Text>
      <Text style={s.h1}>{returning?chapter.title:'Chapters 1–4 are ready to test.'}</Text>
      <Text style={s.lead}>{returning?`Continue from Chapter ${chapter.sourceChapter}, ${chapter.title}.`:'Scroll through the story and watch messages reveal, type, haptic and disappear with your movement.'}</Text>
      <Pressable style={s.btn} onPress={()=>router.push(`/reader/${chapter.id}`)}><Text style={s.btnText}>{returning?'CONTINUE READING':'BEGIN CHAPTER ONE'}</Text></Pressable>
      <View style={s.featureRow}><View style={s.feature}><Text style={s.featureN}>04</Text><Text style={s.featureL}>CHAPTERS</Text></View><View style={s.feature}><Text style={s.featureN}>LIVE</Text><Text style={s.featureL}>MESSAGES</Text></View><View style={s.feature}><Text style={s.featureN}>HAPTIC</Text><Text style={s.featureL}>SCROLL REVEAL</Text></View></View>
      <View style={s.note}><Text style={s.noteLabel}>WHAT TO TEST</Text><Text style={s.noteText}>Chapter 1 has the first Liam thread. Chapter 4 has the larger SLAGS group chat. Scroll slowly through each thread, then reverse direction to test the Apple-style reversible reveal.</Text></View>
    </View>
  </ScrollView>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.paper},content:{paddingBottom:100},hero:{minHeight:500,backgroundColor:colors.ink,paddingHorizontal:24,paddingTop:64,paddingBottom:38,justifyContent:'flex-end'},badge:{alignSelf:'flex-start',borderWidth:1,borderColor:'rgba(255,255,255,.22)',borderRadius:999,paddingHorizontal:11,paddingVertical:7,marginBottom:26},badgeText:{fontSize:9,letterSpacing:1.6,color:'#F5D7E6',fontWeight:'900'},over:{fontSize:10,letterSpacing:2.4,color:'#F5D7E6',fontWeight:'900'},milk:{fontSize:72,lineHeight:72,fontWeight:'900',letterSpacing:-3,color:'#fff',marginTop:12},sugar:{fontSize:52,lineHeight:58,fontWeight:'300',fontStyle:'italic',letterSpacing:-2,color:colors.rose,marginTop:-8},author:{fontSize:11,letterSpacing:3,color:'#fff',fontWeight:'800',marginTop:20},tag:{fontSize:14,lineHeight:21,color:'#D8D2D7',marginTop:22,maxWidth:300},body:{padding:24},kicker:{fontSize:10,letterSpacing:2,color:colors.rose,fontWeight:'900'},h1:{fontSize:34,lineHeight:38,fontWeight:'900',color:colors.ink,marginTop:8},lead:{fontSize:17,lineHeight:25,color:colors.mutedInk,marginTop:12},btn:{backgroundColor:colors.ink,borderRadius:999,paddingVertical:17,alignItems:'center',marginTop:24},btnText:{color:'#fff',fontSize:12,fontWeight:'900',letterSpacing:1.1},featureRow:{flexDirection:'row',gap:8,marginTop:18},feature:{flex:1,borderWidth:1,borderColor:colors.line,borderRadius:15,padding:11,minHeight:72,justifyContent:'space-between'},featureN:{fontSize:13,fontWeight:'900',color:colors.ink},featureL:{fontSize:8,lineHeight:11,letterSpacing:.7,fontWeight:'800',color:colors.mutedInk},note:{backgroundColor:'#EFE5DE',borderRadius:18,padding:18,marginTop:24},noteLabel:{fontSize:10,letterSpacing:1.7,fontWeight:'900'},noteText:{fontSize:14,lineHeight:21,color:colors.mutedInk,marginTop:7}});

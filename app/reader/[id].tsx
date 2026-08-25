import { useEffect,useRef,useState } from 'react';
import { Animated,Pressable,StyleSheet,Text,View,useWindowDimensions } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import book from '@/src/data/book';
import { StoryRenderer } from '@/src/components/StoryRenderer';
import { markChapterOpened } from '@/src/lib/progress';
import { colors } from '@/src/theme/theme';

export default function Reader(){
  const{id}=useLocalSearchParams<{id:string}>();
  const r=useRouter();
  const chapterId=Math.min(book.chapters.length,Math.max(1,Number(id)||1));
  const chapter=book.chapters[chapterId-1];
  const[fontSize,setFontSize]=useState(18);
  const[contentTop,setContentTop]=useState(0);
  const scrollY=useRef(new Animated.Value(0)).current;
  const{height:viewportHeight}=useWindowDimensions();
  useEffect(()=>{markChapterOpened(chapterId);},[chapterId]);
  const isLast=chapterId===book.chapters.length;
  const next=()=>isLast?r.replace('/(tabs)/chapters'):r.replace(`/reader/${chapterId+1}`);

  return <SafeAreaView style={s.safe} edges={['top']}>
    <View style={s.top}><Pressable onPress={()=>r.back()}><Text style={s.close}>‹</Text></Pressable><View style={s.topMid}><Text style={s.topChapter}>CHAPTER {chapter.sourceChapter}</Text><Text style={s.topTitle} numberOfLines={1}>{chapter.title}</Text></View><Pressable onPress={()=>setFontSize(v=>v>=22?17:v+1)}><Text style={s.aa}>Aa</Text></Pressable></View>
    <Animated.ScrollView style={s.reader} contentContainerStyle={s.content} scrollEventThrottle={16} onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:true})}>
      <Text style={s.kicker}>CHAPTER {chapter.numberLabel}</Text><Text style={s.title}>{chapter.title}</Text><Text style={s.location}>{chapter.location}</Text>
      <View style={s.story} onLayout={e=>setContentTop(e.nativeEvent.layout.y)}><StoryRenderer blocks={chapter.blocks} fontSize={fontSize} scrollY={scrollY} viewportHeight={viewportHeight} contentTop={contentTop}/></View>
      <View style={s.end}><Text style={s.endLabel}>{isLast?'END OF PREVIEW':'END OF CHAPTER'}</Text><Pressable style={s.next} onPress={next}><Text style={s.nextText}>{isLast?'BACK TO CHAPTERS':'NEXT CHAPTER  →'}</Text></Pressable></View>
    </Animated.ScrollView>
  </SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.paper},top:{height:62,flexDirection:'row',alignItems:'center',paddingHorizontal:16,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:colors.line},close:{fontSize:36,color:colors.ink,width:40},topMid:{flex:1,alignItems:'center'},aa:{fontSize:16,fontWeight:'800',color:colors.ink,width:40,textAlign:'right'},topChapter:{fontSize:9,letterSpacing:1.5,color:colors.rose,fontWeight:'800'},topTitle:{fontSize:13,fontWeight:'700',color:colors.ink,maxWidth:230,marginTop:2},reader:{flex:1,backgroundColor:colors.paper},content:{paddingHorizontal:24,paddingTop:46,paddingBottom:60},kicker:{fontSize:10,letterSpacing:2.2,color:colors.rose,fontWeight:'900'},title:{fontSize:38,lineHeight:42,fontWeight:'900',color:colors.ink,marginTop:8},location:{fontSize:13,letterSpacing:1.2,textTransform:'uppercase',color:colors.mutedInk,marginTop:10},story:{marginTop:28},end:{marginTop:36,paddingTop:28,borderTopWidth:1,borderTopColor:colors.line,alignItems:'center'},endLabel:{fontSize:10,letterSpacing:2,color:colors.mutedInk,fontWeight:'800'},next:{backgroundColor:colors.ink,borderRadius:999,paddingVertical:16,paddingHorizontal:28,marginTop:16},nextText:{color:'#fff',fontWeight:'900',letterSpacing:1,fontSize:12}});

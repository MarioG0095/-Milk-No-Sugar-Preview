import { useEffect,useMemo,useRef,useState } from 'react';
import { Animated,LayoutChangeEvent,StyleSheet,Text,View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MessageBubble } from './MessageBubble';
import { colors } from '@/src/theme/theme';

type Message={id?:string;sender:string;text:string};
type Props={messages:Message[];threadTitle?:string;scrollY:Animated.Value;viewportHeight:number;contentTop:number};

function TypingIndicator({sender}:{sender:string}){
  const pulse=useRef(new Animated.Value(.25)).current;
  useEffect(()=>{const loop=Animated.loop(Animated.sequence([
    Animated.timing(pulse,{toValue:1,duration:360,useNativeDriver:true}),
    Animated.timing(pulse,{toValue:.25,duration:360,useNativeDriver:true}),
  ]));loop.start();return()=>loop.stop();},[pulse]);
  return <View style={s.typingRow}>
    <View style={s.avatar}><Text style={s.initial}>{sender.slice(0,1).toUpperCase()}</Text></View>
    <View style={s.typing}><Text style={s.sender}>{sender}</Text><Animated.Text style={[s.dots,{opacity:pulse}]}>•••</Animated.Text></View>
  </View>;
}

function ScrollRevealBubble({message,sequenceTop,scrollY,viewportHeight}:{message:Message;sequenceTop:number;scrollY:Animated.Value;viewportHeight:number}){
  const[localY,setLocalY]=useState(0);
  const[measured,setMeasured]=useState(false);
  const lastScroll=useRef<number|null>(null);
  const hapticArmed=useRef(true);
  const system=message.sender==='System';
  const incoming=message.sender!=='Me'&&!system;
  const absoluteY=sequenceTop+localY;
  const thresholds=useMemo(()=>({
    enterStart:absoluteY-viewportHeight*.92,
    enterEnd:absoluteY-viewportHeight*.72,
    exitStart:absoluteY-viewportHeight*.14,
    exitEnd:absoluteY+viewportHeight*.03,
  }),[absoluteY,viewportHeight]);
  const opacity=scrollY.interpolate({inputRange:[thresholds.enterStart,thresholds.enterEnd,thresholds.exitStart,thresholds.exitEnd],outputRange:[0,1,1,0],extrapolate:'clamp'});
  const translateY=scrollY.interpolate({inputRange:[thresholds.enterStart,thresholds.enterEnd,thresholds.exitStart,thresholds.exitEnd],outputRange:[18,0,0,-8],extrapolate:'clamp'});
  const scale=scrollY.interpolate({inputRange:[thresholds.enterStart,thresholds.enterEnd,thresholds.exitStart,thresholds.exitEnd],outputRange:[.985,1,1,.992],extrapolate:'clamp'});
  const typingOpacity=scrollY.interpolate({inputRange:[thresholds.enterStart,(thresholds.enterStart+thresholds.enterEnd)/2,thresholds.enterEnd],outputRange:[0,incoming?1:0,0],extrapolate:'clamp'});

  useEffect(()=>{
    if(!measured||system)return;
    const listener=scrollY.addListener(({value})=>{
      const previous=lastScroll.current;
      if(previous===null){
        if(hapticArmed.current&&value>=thresholds.enterEnd&&value<=thresholds.exitEnd){hapticArmed.current=false;Haptics.selectionAsync().catch(()=>undefined);}
        lastScroll.current=value;return;
      }
      if(hapticArmed.current&&previous<thresholds.enterEnd&&value>=thresholds.enterEnd){hapticArmed.current=false;Haptics.selectionAsync().catch(()=>undefined);}
      if(value<thresholds.enterEnd-28)hapticArmed.current=true;
      lastScroll.current=value;
    });
    return()=>scrollY.removeListener(listener);
  },[measured,scrollY,system,thresholds.enterEnd,thresholds.exitEnd]);

  const onLayout=(event:LayoutChangeEvent)=>{setLocalY(event.nativeEvent.layout.y);setMeasured(true)};
  return <View onLayout={onLayout} style={s.slot}>
    {incoming&&<Animated.View pointerEvents="none" style={[s.typingOverlay,{opacity:typingOpacity}]}><TypingIndicator sender={message.sender}/></Animated.View>}
    <Animated.View style={{opacity,transform:[{translateY},{scale}]}}><MessageBubble sender={message.sender} text={message.text}/></Animated.View>
  </View>;
}

export function AnimatedMessageSequence({messages,threadTitle,scrollY,viewportHeight,contentTop}:Props){
  const[sequenceY,setSequenceY]=useState(0);
  const sequenceTop=contentTop+sequenceY;
  return <View onLayout={e=>setSequenceY(e.nativeEvent.layout.y)} style={s.wrap} accessibilityLabel={`${threadTitle??'Message'} conversation. Scroll to reveal messages.`}>
    <View style={s.top}><Text style={s.label}>MESSAGES</Text><Text style={s.thread}>{threadTitle?.toUpperCase()??'THREAD'}</Text></View>
    {messages.map((m,i)=><ScrollRevealBubble key={m.id??`${i}-${m.sender}-${m.text}`} message={m} sequenceTop={sequenceTop} scrollY={scrollY} viewportHeight={viewportHeight}/>) }
  </View>;
}

const s=StyleSheet.create({
  wrap:{backgroundColor:'#EFECEF',borderRadius:24,padding:14,marginVertical:22,overflow:'hidden'},
  top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:4,paddingBottom:10},
  label:{fontSize:9,letterSpacing:1.7,fontWeight:'900',color:colors.mutedInk},
  thread:{fontSize:9,letterSpacing:1.2,fontWeight:'900',color:colors.rose},
  slot:{position:'relative'},
  typingOverlay:{position:'absolute',left:0,right:0,bottom:0,zIndex:2},
  typingRow:{flexDirection:'row',alignItems:'flex-end',gap:8,marginVertical:5},
  avatar:{width:30,height:30,borderRadius:15,backgroundColor:colors.roseSoft,alignItems:'center',justifyContent:'center',marginBottom:1},
  initial:{color:colors.rose,fontWeight:'900',fontSize:11},
  typing:{backgroundColor:'#fff',borderRadius:18,borderBottomLeftRadius:5,paddingHorizontal:14,paddingVertical:9,minWidth:68},
  sender:{fontSize:9,fontWeight:'800',color:colors.rose,textTransform:'uppercase',letterSpacing:.6},
  dots:{fontSize:18,color:colors.mutedInk,letterSpacing:2,marginTop:1},
});

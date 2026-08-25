import type { ReactNode } from 'react';
import { Animated,StyleSheet,Text,View } from 'react-native';
import type { StoryBlock } from '@/src/data/book';
import { AnimatedMessageSequence } from './AnimatedMessageSequence';

type Props={blocks:StoryBlock[];fontSize:number;scrollY:Animated.Value;viewportHeight:number;contentTop:number};
export function StoryRenderer({blocks,fontSize,scrollY,viewportHeight,contentTop}:Props){
  const out:ReactNode[]=[];let i=0;
  while(i<blocks.length){const b=blocks[i];
    if(b.type==='message'){
      const messages=[];const thread=b.thread;let j=i;
      while(j<blocks.length&&blocks[j].type==='message'&&(blocks[j] as Extract<StoryBlock,{type:'message'}>).thread===thread){
        const m=blocks[j] as Extract<StoryBlock,{type:'message'}>;messages.push({id:m.id,sender:m.sender,text:m.text});j++;
      }
      out.push(<AnimatedMessageSequence key={b.id??`msg-${i}`} messages={messages} threadTitle={thread} scrollY={scrollY} viewportHeight={viewportHeight} contentTop={contentTop}/>);i=j;continue;
    }
    out.push(<Text key={b.id??`p-${i}`} style={[s.para,{fontSize,lineHeight:Math.round(fontSize*1.58)}]}>{b.text}</Text>);i++;
  }
  return <View>{out}</View>;
}
const s=StyleSheet.create({para:{fontFamily:'Georgia',color:'#262127',marginBottom:19}});

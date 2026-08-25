import type { StoryBlock } from '../bookTypes';

type Moment = { match: string[]; replacement: StoryBlock[] };
const message = (thread:string,sender:string,text:string,origin:'manuscript'|'app'='manuscript'):StoryBlock=>({type:'message',thread,sender,text,origin});
const paragraph = (text:string):StoryBlock=>({type:'paragraph',text});

const moments: Record<number, Moment[]> = {
  1:[{
    match:['Liam: Let me know when you’re close and I’ll meet you at the station. No rush.','I type back: On the train in 10. Should be there around 1.','Three dots appear immediately, then: Sound. See you soon.'],
    replacement:[
      message('Liam','Liam','Morning mate. Still all good for today?','app'),
      message('Liam','Me','Yeah. Heading to the station now.','app'),
      message('Liam','Liam','Let me know when you’re close and I’ll meet you at the station. No rush.'),
      message('Liam','Me','On the train in 10. Should be there around 1.'),
      message('Liam','Liam','Sound. See you soon.')
    ]
  }],
  2:[
    {
      match:['Rio: mums already crying lol I smile despite myself and type back: I’ve been gone 20 minutes.','Rio: yeah but she made another batch of pastéis this morning “just in case”','Rio: dad told her to calm down and she said “you don’t understand” and he just went back to reading the paper Rio: standard I can picture it perfectly. Mum in the kitchen, Dad in his chair, Rio on the sofa with his phone, the whole house settling back into its routine now that I’m not there to disrupt it.'],
      replacement:[
        message('Rio','Rio','mums already crying lol'),
        message('Rio','Me','I’ve been gone 20 minutes.'),
        message('Rio','Rio','yeah but she made another batch of pastéis this morning “just in case”'),
        message('Rio','Rio','dad told her to calm down and she said “you don’t understand” and he just went back to reading the paper'),
        message('Rio','Rio','standard'),
        message('Rio','Me','Keep an eye on her for me.','app'),
        message('Rio','Rio','yeah yeah. enjoy london loser','app'),
        paragraph('I can picture it perfectly. Mum in the kitchen, Dad in his chair, Rio on the sofa with his phone, the whole house settling back into its routine now that I’m not there to disrupt it.')
      ]
    },
    {
      match:['Liam: You close? I type back: Just got to Stratford. Walking now.','Liam: Nice one. It’s about 10 mins from the station. Let me know if you get lost.'],
      replacement:[
        message('Liam','Liam','You close?'),
        message('Liam','Me','Just got to Stratford. Walking now.'),
        message('Liam','Liam','Nice one. It’s about 10 mins from the station. Let me know if you get lost.'),
        message('Liam','Liam','Buzz Flat 12 when you’re outside.','app'),
        message('Liam','Me','Will do.','app')
      ]
    },
    {
      match:['Mum: Did you arrive safely? Have you eaten? Text me. I smile and type back: Yeah, I’m here. Flat’s nice. Flatmates are sound. I’ll call you tomorrow. Love you. Three dots appear almost immediately.','Mum: Good. Eat something. Rest. Love you too.'],
      replacement:[
        message('Mum','Mum','Did you arrive safely? Have you eaten? Text me.'),
        message('Mum','Me','Yeah, I’m here. Flat’s nice. Flatmates are sound. I’ll call you tomorrow. Love you.'),
        message('Mum','Mum','Good. Eat something. Rest. Love you too.'),
        message('Mum','Mum','Send me a photo of your room tomorrow.','app'),
        message('Mum','Me','Tomorrow. Promise.','app')
      ]
    }
  ],
  3:[{
    match:['Mum: How was your day? Did you eat?','I smile and type back: Yeah. Explored a bit. Cooked dinner with the flatmates. All good.','Three dots appear almost immediately.','Mum: Good. I’m glad. Love you.','Me: Love you too. I put my phone down and close my eyes. The flat’s quiet now. Just the faint sound of Alan moving around in his room, the hum of traffic outside, the city settling into night. I’m not happy, exactly. But I’m here. And for now, that’s enough.'],
    replacement:[
      message('Mum','Mum','How was your day? Did you eat?'),
      message('Mum','Me','Yeah. Explored a bit. Cooked dinner with the flatmates. All good.'),
      message('Mum','Mum','Good. I’m glad. Love you.'),
      message('Mum','Me','Love you too.'),
      message('Mum','Mum','Your dad keeps asking if the room is warm. He thinks I don’t notice.','app'),
      message('Mum','Me','Tell him it’s warm. And tell him I said thanks.','app'),
      paragraph('I put my phone down and close my eyes. The flat’s quiet now. Just the faint sound of Alan moving around in his room, the hum of traffic outside, the city settling into night. I’m not happy, exactly. But I’m here. And for now, that’s enough.')
    ]
  }],
  4:[{
    match:['Hannah: What time are we meeting?','Alan: 8pm. The Owl and Pussycat. Shoreditch High Street.','Dev: That place is a tourist trap.','Alan: It has character.','Dev: It has overpriced pints and sticky floors.','Reece: I love sticky floors. Very authentic.','Hannah: You’re disgusting.','Reece: Thank you.','Liam: I’ll be there by 8.','Alan: Diego will also be there by 8 because I’m dressing him and we’re leaving together.','Me: I can dress myself.','Alan: Incorrect.'],
    replacement:[
      message('SLAGS','System','Alan added Diego','app'),
      message('SLAGS','Hannah','Welcome to the circus, Diego x','app'),
      message('SLAGS','Reece','NEW BLOOD','app'),
      message('SLAGS','Dev','Please ignore Reece.','app'),
      message('SLAGS','Me','Already learning.','app'),
      message('SLAGS','Hannah','What time are we meeting?'),
      message('SLAGS','Alan','8pm. The Owl and Pussycat. Shoreditch High Street.'),
      message('SLAGS','Dev','That place is a tourist trap.'),
      message('SLAGS','Alan','It has character.'),
      message('SLAGS','Dev','It has overpriced pints and sticky floors.'),
      message('SLAGS','Reece','I love sticky floors. Very authentic.'),
      message('SLAGS','Hannah','You’re disgusting.'),
      message('SLAGS','Reece','Thank you.'),
      message('SLAGS','Liam','I’ll be there by 8.'),
      message('SLAGS','Alan','Diego will also be there by 8 because I’m dressing him and we’re leaving together.'),
      message('SLAGS','Me','I can dress myself.'),
      message('SLAGS','Alan','Incorrect.')
    ]
  }]
};

function matchesAt(blocks:StoryBlock[],index:number,match:string[]){
  return match.every((text,offset)=>{const block=blocks[index+offset];return block?.type==='paragraph'&&block.text===text});
}
export function applyMessageMoments(chapter:number,blocks:StoryBlock[]):StoryBlock[]{
  const chapterMoments=moments[chapter]??[]; if(!chapterMoments.length)return blocks;
  const output:StoryBlock[]=[]; let index=0;
  while(index<blocks.length){
    const moment=chapterMoments.find(candidate=>matchesAt(blocks,index,candidate.match));
    if(!moment){output.push(blocks[index]);index+=1;continue;}
    const baseId=blocks[index]?.id??`ch${String(chapter).padStart(2,'0')}-b${String(index+1).padStart(3,'0')}`;
    moment.replacement.forEach((block,replacementIndex)=>output.push({...block,id:`${baseId}-i${String(replacementIndex+1).padStart(2,'0')}`}));
    index+=moment.match.length;
  }
  return output;
}

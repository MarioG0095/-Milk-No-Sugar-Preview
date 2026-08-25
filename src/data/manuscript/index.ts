import type { PreviewChapter, StoryBlock } from '../bookTypes';
import ch01a from './ch01/part1';
import ch01b from './ch01/part2';
import ch02a from './ch02/part1';
import ch02b from './ch02/part2';
import ch03a from './ch03/part1';
import ch03b from './ch03/part2';
import ch04a from './ch04/part1';
import ch04b from './ch04/part2';
import { applyMessageMoments } from './messageMoments';

const blocks=(chapter:number,paragraphs:readonly string[]):StoryBlock[]=>applyMessageMoments(chapter,paragraphs.map((text,index)=>({type:'paragraph',id:`ch${String(chapter).padStart(2,'0')}-b${String(index+1).padStart(3,'0')}`,text})));

const chapters:PreviewChapter[]=[
  {id:1,sourceChapter:1,numberLabel:'ONE',title:'Leaving King’s Lynn',location:'King’s Lynn',blocks:blocks(1,[...ch01a,...ch01b])},
  {id:2,sourceChapter:2,numberLabel:'TWO',title:'The Train South',location:'King’s Lynn to London',blocks:blocks(2,[...ch02a,...ch02b])},
  {id:3,sourceChapter:3,numberLabel:'THREE',title:'First Morning in the Flat',location:'Stratford',blocks:blocks(3,[...ch03a,...ch03b])},
  {id:4,sourceChapter:4,numberLabel:'FOUR',title:'First Night Out with the SLAGS',location:'Shoreditch',blocks:blocks(4,[...ch04a,...ch04b])},
];
export default chapters;

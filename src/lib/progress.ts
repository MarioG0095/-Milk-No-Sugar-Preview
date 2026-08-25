import Storage from 'expo-sqlite/kv-store';
export type ReadingProgress={lastChapter:number;highestChapter:number};
const KEY='mns-preview-progress-v1';
const DEFAULT:ReadingProgress={lastChapter:1,highestChapter:0};
export async function getProgress(){const raw=await Storage.getItem(KEY);if(!raw)return DEFAULT;try{return{...DEFAULT,...JSON.parse(raw)}}catch{return DEFAULT}}
export async function markChapterOpened(chapter:number){const current=await getProgress();const next={lastChapter:chapter,highestChapter:Math.max(current.highestChapter,chapter)};await Storage.setItem(KEY,JSON.stringify(next));return next;}

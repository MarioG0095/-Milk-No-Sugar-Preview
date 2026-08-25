export type ParagraphBlock = { id?: string; type: 'paragraph'; text: string };
export type MessageBlock = { id?: string; type: 'message'; thread: string; sender: string; text: string; origin?: 'manuscript' | 'app' };
export type StoryBlock = ParagraphBlock | MessageBlock;
export type PreviewChapter = {
  id: number;
  sourceChapter: number;
  numberLabel: string;
  title: string;
  location: string;
  blocks: StoryBlock[];
};

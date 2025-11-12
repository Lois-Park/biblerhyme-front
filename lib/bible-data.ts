export interface BibleBook {
  name: string;
  chapters: number;
}

export const bibleBooks: BibleBook[] = [
  { name: "창세기", chapters: 50 },
  { name: "출애굽기", chapters: 40 },
  { name: "레위기", chapters: 27 },
  { name: "민수기", chapters: 36 },
  { name: "신명기", chapters: 34 },
  { name: "여호수아", chapters: 24 },
  { name: "사사기", chapters: 21 },
  { name: "룻기", chapters: 4 },
  { name: "사무엘상", chapters: 31 },
  { name: "사무엘하", chapters: 24 },
  { name: "열왕기상", chapters: 22 },
  { name: "열왕기하", chapters: 25 },
  { name: "역대상", chapters: 29 },
  { name: "역대하", chapters: 36 },
  { name: "에스라", chapters: 10 },
  { name: "느헤미야", chapters: 13 },
  { name: "에스더", chapters: 10 },
  { name: "욥기", chapters: 42 },
  { name: "시편", chapters: 150 },
  { name: "잠언", chapters: 31 },
  { name: "전도서", chapters: 12 },
  { name: "아가", chapters: 8 },
  { name: "이사야", chapters: 66 },
  { name: "예레미야", chapters: 52 },
  { name: "예레미야애가", chapters: 5 },
  { name: "에스겔", chapters: 48 },
  { name: "다니엘", chapters: 12 },
  { name: "호세아", chapters: 14 },
  { name: "요엘", chapters: 3 },
  { name: "아모스", chapters: 9 },
  { name: "오바댜", chapters: 1 },
  { name: "요나", chapters: 4 },
  { name: "미가", chapters: 7 },
  { name: "나훔", chapters: 3 },
  { name: "하박국", chapters: 3 },
  { name: "스바냐", chapters: 3 },
  { name: "학개", chapters: 2 },
  { name: "스가랴", chapters: 14 },
  { name: "말라기", chapters: 4 },
  { name: "마태복음", chapters: 28 },
  { name: "마가복음", chapters: 16 },
  { name: "누가복음", chapters: 24 },
  { name: "요한복음", chapters: 21 },
  { name: "사도행전", chapters: 28 },
  { name: "로마서", chapters: 16 },
  { name: "고린도전서", chapters: 16 },
  { name: "고린도후서", chapters: 13 },
  { name: "갈라디아서", chapters: 6 },
  { name: "에베소서", chapters: 6 },
  { name: "빌립보서", chapters: 4 },
  { name: "골로새서", chapters: 4 },
  { name: "데살로니가전서", chapters: 5 },
  { name: "데살로니가후서", chapters: 3 },
  { name: "디모데전서", chapters: 6 },
  { name: "디모데후서", chapters: 4 },
  { name: "디도서", chapters: 3 },
  { name: "빌레몬서", chapters: 1 },
  { name: "히브리서", chapters: 13 },
  { name: "야고보서", chapters: 5 },
  { name: "베드로전서", chapters: 5 },
  { name: "베드로후서", chapters: 3 },
  { name: "요한일서", chapters: 5 },
  { name: "요한이서", chapters: 1 },
  { name: "요한삼서", chapters: 1 },
  { name: "유다서", chapters: 1 },
  { name: "요한계시록", chapters: 22 },
];

export interface RapStyle {
  id: string;
  name: string;
  description: string;
  previewUrl: string; // 비트 미리듣기 URL
}

export const rapStyles: RapStyle[] = [
  {
    id: 'boom-bap',
    name: '붐뱁 (Boom Bap)',
    description: '90년대 정통 힙합 스타일. 묵직한 드럼과 재즈 샘플링이 특징입니다.',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'trap',
    name: '트랩 (Trap)',
    description: '현대적이고 리드미컬한 비트. 808 베이스와 빠른 하이햇이 돋보입니다.',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'lo-fi',
    name: '로파이 힙합 (Lo-fi Hip Hop)',
    description: '잔잔하고 편안한 분위기. 명상이나 휴식에 어울리는 부드러운 비트입니다.',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 'gospel-rap',
    name: '가스펠 랩 (Gospel Rap)',
    description: '찬양과 랩의 융합. 영적인 메시지를 담은 감동적인 스타일입니다.',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 'k-hiphop',
    name: 'K-힙합 (K-HipHop)',
    description: '한국어 발음에 최적화된 트렌디한 스타일. 다양한 장르가 혼합됩니다.',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
];
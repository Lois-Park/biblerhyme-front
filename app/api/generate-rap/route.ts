import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { book, chapter, verse, text, style } = await request.json();

  console.log('AI 음원 생성 요청 수신:');
  console.log(`- 말씀: ${book} ${chapter}:${verse} "${text.substring(0, 30)}..."`);
  console.log(`- 랩 스타일: ${style}`);

  // 실제 AI 서비스 호출 (ElevenLabs, Suno AI 등) 로직이 여기에 들어갑니다.
  // 현재는 시뮬레이션을 위해 3초 지연 후 가상의 데이터를 반환합니다.
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 지연

  const mockAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // 가상의 MP3 URL
  const mockAlbumArtUrl = 'https://via.placeholder.com/300x300?text=BibleRhyme+AI+Rap'; // 가상의 앨범 아트 URL

  return NextResponse.json({
    success: true,
    audioUrl: mockAudioUrl,
    albumArtUrl: mockAlbumArtUrl,
    title: `${book} ${chapter}:${verse} (${style} Ver.)`,
    message: '음원이 성공적으로 생성되었습니다!',
  });
}

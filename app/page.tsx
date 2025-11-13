'use client';

import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Box, Grid, Paper, Button, List, ListItem, ListItemButton, ListItemText, CircularProgress, Card, CardContent, CardMedia, CardActions, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { bibleBooks, BibleBook, RapStyle, rapStyles } from '../lib/bible-data';
import { genesisChapter1, Verse } from '../lib/genesis-1-data';

type View = 'book' | 'verse' | 'text' | 'style' | 'generating' | 'result';

interface GeneratedRap {
  audioUrl: string;
  albumArtUrl: string;
  title: string;
  message: string;
}

// 텍스트 내에서 특정 키워드를 하이라이트하는 헬퍼 함수
const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) {
    return text;
  }
  const regex = new RegExp(`(${highlight})`, 'gi'); // 'gi'는 대소문자 구분 없이 전역 검색
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default function VerseSelectionPage() {
  const [view, setView] = React.useState<View>('book');
  const [expanded, setExpanded] = React.useState<string | false>(false);
  
  const [selectedBook, setSelectedBook] = React.useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = React.useState<number | null>(null);
  const [selectedVerse, setSelectedVerse] = React.useState<number | null>(null);
  const [selectedVerseText, setSelectedVerseText] = React.useState<string | null>(null); // 선택된 절의 텍스트
  const [searchTerm, setSearchTerm] = React.useState('');

  const [bibleData, setBibleData] = React.useState<Verse[]>([]);
  const [selectedRapStyle, setSelectedRapStyle] = React.useState<RapStyle | null>(null);
  const [generatedRap, setGeneratedRap] = React.useState<GeneratedRap | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = React.useState<string | null>(null); // 현재 재생 중인 미리듣기 ID
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingPreview(null);
  }, [view]); // 뷰가 변경되면 미리듣기 중지

  const handleChapterClick = (book: BibleBook, chapter: number) => {
    if (book.name === '창세기' && chapter === 1) {
      setSelectedBook(book);
      setSelectedChapter(chapter);
      setBibleData(genesisChapter1);
      setView('verse');
      setSearchTerm(''); 
    } else {
      alert(`현재는 '창세기 1장'에 대한 말씀 데이터만 준비되어 있습니다.`);
    }
  };

  const handleVerseClick = (verse: number) => {
    setSelectedVerse(verse);
    const verseText = genesisChapter1.find(v => v.verse === verse)?.text || null;
    setSelectedVerseText(verseText);
    setView('text');
  };

  const handleBack = (targetView: View) => {
    setView(targetView);
    if (targetView === 'book') {
      setSelectedChapter(null);
      setSelectedBook(null);
      setSelectedVerse(null);
      setSelectedVerseText(null);
      setSearchTerm(''); 
      setGeneratedRap(null); // 결과 화면에서 돌아올 때 초기화
    }
    if (targetView === 'verse') {
      setSelectedVerse(null);
      setSelectedVerseText(null);
    }
    if (targetView === 'text') { // 스타일 선택 화면에서 돌아올 때
      setSelectedRapStyle(null);
    }
  };

  const handleGenerateRap = async () => {
    if (!selectedBook || !selectedChapter || !selectedVerse || !selectedVerseText || !selectedRapStyle) {
      alert('말씀과 랩 스타일을 모두 선택해주세요.');
      return;
    }

    setView('generating');
    setGeneratedRap(null); // 이전 결과 초기화

    try {
      const response = await fetch('/api/generate-rap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: selectedBook.name,
          chapter: selectedChapter,
          verse: selectedVerse,
          text: selectedVerseText,
          style: selectedRapStyle.name,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 음원 생성 실패');
      }

      const data: GeneratedRap = await response.json();
      setGeneratedRap(data);
      setView('result');
    } catch (error) {
      console.error('음원 생성 중 오류 발생:', error);
      alert('음원 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      setView('text'); // 오류 발생 시 말씀 보기 화면으로 돌아감
    }
  };

  const handlePreviewPlay = (url: string, styleId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (isPlayingPreview === styleId) {
      setIsPlayingPreview(null);
    } else {
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setIsPlayingPreview(null);
      setIsPlayingPreview(styleId);
    }
  };

  // 책 선택 화면
  const renderBookSelection = () => {
    const filteredBooks = bibleBooks.filter(book =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        {filteredBooks.map((book) => (
          <Accordion key={book.name} expanded={expanded === book.name} onChange={(e, isExpanded) => setExpanded(isExpanded ? book.name : false)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: '500' }}>{book.name}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#f7f7f7' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => (
                  <Paper key={chapter} onClick={() => handleChapterClick(book, chapter)} sx={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '12px', '&:hover': { backgroundColor: 'primary.light', color: 'primary.contrastText' } }} elevation={2}>
                    <Typography variant="body1">{chapter}</Typography>
                  </Paper>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  };

  // 통합 검색 결과 화면
  const renderSearchResults = () => {
    const searchResults = genesisChapter1.filter(verse =>
      verse.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResultClick = (verseNumber: number) => {
      const genesisBook = bibleBooks.find(b => b.name === '창세기');
      if (genesisBook) {
        setSelectedBook(genesisBook);
        setSelectedChapter(1);
        setBibleData(genesisChapter1);
        setSelectedVerse(verseNumber);
        const verseText = genesisChapter1.find(v => v.verse === verseNumber)?.text || null;
        setSelectedVerseText(verseText);
        setView('text');
      }
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          '{searchTerm}' 검색 결과
        </Typography>
        <List>
          {searchResults.length > 0 ? (
            searchResults.map(verse => (
              <ListItem key={verse.verse} disablePadding>
                <ListItemButton onClick={() => handleResultClick(verse.verse)}>
                  <ListItemText
                    primary={`창세기 1:${verse.verse}`}
                    secondary={highlightText(verse.text, searchTerm)}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="검색 결과가 없습니다." />
            </ListItem>
          )}
        </List>
      </Box>
    );
  };

  // 절 선택 화면
  const renderVerseSelection = () => (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => handleBack('book')} sx={{ mb: 2 }}>책 선택으로 돌아가기</Button>
      <Typography variant="h5" gutterBottom>{selectedBook?.name} {selectedChapter}장</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Array.from({ length: bibleData.length }, (_, i) => i + 1).map((verseNum) => (
          <Paper key={verseNum} onClick={() => handleVerseClick(verseNum)} sx={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '12px', '&:hover': { backgroundColor: 'primary.light', color: 'primary.contrastText' } }} elevation={2}>
            <Typography variant="body1">{verseNum}</Typography>
          </Paper>
        ))}
      </Box>
    </>
  );

  // 말씀 보기 화면
  const renderTextView = () => (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => handleBack(searchTerm ? 'book' : 'verse')} sx={{ mb: 2 }}>
        {searchTerm ? '검색 결과로 돌아가기' : '절 선택으로 돌아가기'}
      </Button>
      <Typography variant="h5" gutterBottom>{selectedBook?.name} {selectedChapter}장</Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        {bibleData.map((verse) => (
          <Typography key={verse.verse} variant="body1" component="p" gutterBottom sx={{ display: 'inline', backgroundColor: verse.verse === selectedVerse ? 'lightblue' : 'transparent', fontWeight: verse.verse === selectedVerse ? 'bold' : 'normal', lineHeight: 1.8 }}>
            <Typography variant="caption" sx={{ mr: 1, fontWeight: 'bold', color: 'primary.main' }}>{verse.verse}</Typography>
            {highlightText(verse.text, searchTerm)}{' '}
          </Typography>
        ))}
      </Paper>
      <Button variant="contained" fullWidth onClick={() => setView('style')}>
        랩 스타일 선택하기
      </Button>
    </>
  );

  // 랩 스타일 선택 화면
  const renderStyleSelection = () => (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => handleBack('text')} sx={{ mb: 2 }}>
        말씀 보기로 돌아가기
      </Button>
      <Typography variant="h5" gutterBottom>랩 스타일 선택</Typography>
      <Typography variant="body1" gutterBottom>
        선택된 말씀: {selectedBook?.name} {selectedChapter}:{selectedVerse} "{selectedVerseText?.substring(0, 20)}..."
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {rapStyles.map((style) => (
          <Box key={style.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' }, flexGrow: 1 }}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                border: selectedRapStyle?.id === style.id ? '2px solid primary.main' : '1px solid #e0e0e0',
                backgroundColor: selectedRapStyle?.id === style.id ? 'primary.light' : 'background.paper',
                color: selectedRapStyle?.id === style.id ? 'primary.contrastText' : 'text.primary',
                height: '100%'
              }}
              onClick={() => setSelectedRapStyle(style)}
            >
              <CardContent>
                <Typography variant="h6">{style.name}</Typography>
                <Typography variant="body2">{style.description}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton onClick={(e) => { e.stopPropagation(); handlePreviewPlay(style.previewUrl, style.id); }} size="small">
                  {isPlayingPreview === style.id ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <Typography variant="caption">미리듣기</Typography>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
      <Button 
        variant="contained" 
        fullWidth 
        sx={{ mt: 3 }} 
        onClick={handleGenerateRap} 
        disabled={!selectedRapStyle}
      >
        음원 생성하기
      </Button>
    </>
  );

  // 음원 생성 중 화면
  const renderGeneratingView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>음원 생성 중...</Typography>
      <Typography variant="body1" color="text.secondary">
        비트를 믹싱하고, 가사를 입히는 중입니다. 잠시만 기다려 주세요.
      </Typography>
    </Box>
  );

  // 음원 결과 화면
  const renderResultView = () => (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => handleBack('book')} sx={{ mb: 2 }}>
        새로운 말씀 선택하기
      </Button>
      <Typography variant="h5" gutterBottom align="center">음원 생성 완료!</Typography>
      {generatedRap && (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 3 }}>
          <CardMedia
            component="img"
            height="200"
            image={generatedRap.albumArtUrl}
            alt="앨범 아트"
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {generatedRap.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {generatedRap.message}
            </Typography>
            <audio controls src={generatedRap.audioUrl} style={{ width: '100%', marginTop: '16px' }} />
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-around' }}>
            <Button size="small" startIcon={<DownloadIcon />} href={generatedRap.audioUrl} download>다운로드</Button>
            <Button size="small" startIcon={<ShareIcon />}>공유하기</Button>
            <Button size="small" onClick={() => handleBack('text')}>다시 만들기</Button>
          </CardActions>
        </Card>
      )}
    </>
  );


  const renderContent = () => {
    if (view === 'book' && searchTerm.trim() !== '') {
      return renderSearchResults();
    }
    switch (view) {
      case 'verse': return renderVerseSelection();
      case 'text': return renderTextView();
      case 'style': return renderStyleSelection();
      case 'generating': return renderGeneratingView();
      case 'result': return renderResultView();
      case 'book': default: return renderBookSelection();
    }
  };

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 }, maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 2, mb: 4 }}>말씀 선택</Typography>
      <Box sx={{ mb: 4 }}>
        <TextField 
          fullWidth 
          label="성경 구절 또는 키워드 검색" 
          variant="outlined" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요 (예: 하나님, 빛)"
          disabled={view === 'verse' || view === 'style' || view === 'generating' || view === 'result'}
        />
      </Box>
      {renderContent()}
    </Box>
  );
}
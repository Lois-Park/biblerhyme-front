'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Image Node Component
const ImageNode = ({ data }: { data: { label?: string; imageUrl: string } }) => {
  return (
    <div style={{
      width: 120, // Increased width for image
      height: 120, // Increased height for image
      borderRadius: '50%', // Circular shape
      overflow: 'hidden', // Hide overflow for circular shape
      border: '3px solid #fff', // White border
      boxShadow: '0 0 10px rgba(0,0,0,0.6)', // Shadow for depth
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: '#333', // Fallback background
      textAlign: 'center',
    }}>
      <img src={data.imageUrl} alt={data.label || 'character'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {data.label && <div style={{ color: 'white', fontSize: '0.8em', marginTop: '-20px', position: 'relative', zIndex: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>{data.label}</div>}
    </div>
  );
};

// 1. 노드 데이터 정의
const initialNodes: Node[] = [
  // Phase 1: 말씀의 핵
  {
    id: 'core-verse',
    type: 'input',
    data: { label: '시편 23:1' },
    position: { x: 0, y: 0 },
    style: {
      background: '#ff4d4d',
      color: 'white',
      border: '1px solid #ff1a1a',
      width: 180,
      fontSize: '1.2rem',
    },
  },

  // Phase 2: 보컬 성운
  // 1차 노드 (보컬 타입)
  {
    id: 'vocal-type-prophet',
    type: 'imageNode', // Changed to custom image node type
    data: { label: '선지자', imageUrl: '/images/3d-character-children.jpg' }, // Added image URL
    position: { x: -250, y: -150 },
    style: { width: 120, height: 120 }, // Adjusted size for image node
  },
  {
    id: 'vocal-type-poet',
    type: 'imageNode', // Changed to custom image node type
    data: { label: '시인', imageUrl: '/images/3d-character-cute-woman.jpg' }, // Added image URL
    position: { x: 250, y: -150 },
    style: { width: 120, height: 120 }, // Adjusted size for image node
  },
  // 2차 노드 (보컬 특징)
  {
    id: 'vocal-attr-heavy',
    type: 'output',
    data: { label: '#묵직한' },
    position: { x: -450, y: -250 },
  },
  {
    id: 'vocal-attr-aged',
    type: 'output',
    data: { label: '#연륜있는' },
    position: { x: -250, y: -250 },
  },
  {
    id: 'vocal-attr-warm',
    type: 'output',
    data: { label: '#따뜻한' },
    position: { x: 250, y: -250 },
  },

  // Phase 3: 리듬 성단
  // 1차 노드 (리듬 장르)
  {
    id: 'rhythm-genre-lofi',
    type: 'default',
    data: { label: '로파이' },
    position: { x: -250, y: 150 },
    style: { background: '#33cc33', color: 'white' },
  },
  {
    id: 'rhythm-genre-jazz',
    type: 'default',
    data: { label: '재즈힙합' },
    position: { x: 250, y: 150 },
    style: { background: '#33cc33', color: 'white' },
  },
  // 2차 노드 (리듬 무드)
  {
    id: 'rhythm-mood-dawn',
    type: 'output',
    data: { label: '#새벽감성' },
    position: { x: -250, y: 250 },
  },
  {
    id: 'rhythm-mood-rainy',
    type: 'output',
    data: { label: '#비오는날' },
    position: { x: -50, y: 250 },
  },
];

// 2. 엣지(선) 데이터 정의 (선택된 상태를 가정)
const initialEdges: Edge[] = [
  // 보컬 연결
  { id: 'e-core-vocal', source: 'core-verse', target: 'vocal-type-prophet', animated: true },
  { id: 'e-vocal-attr1', source: 'vocal-type-prophet', target: 'vocal-attr-heavy' },
  { id: 'e-vocal-attr2', source: 'vocal-type-prophet', target: 'vocal-attr-aged' },
  // 리듬 연결
  { id: 'e-core-rhythm', source: 'core-verse', target: 'rhythm-genre-lofi', animated: true },
  { id: 'e-rhythm-mood', source: 'rhythm-genre-lofi', target: 'rhythm-mood-dawn' },
];

const SampleUiPage = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const nodeTypes = React.useMemo(() => ({ imageNode: ImageNode }), []); // Define nodeTypes

  return (
    <div style={{ height: '100vh', width: '100%', background: '#1a1a1a' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes} // Register custom node types
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)' }}>
        <button 
          style={{
            padding: '15px 30px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(45deg, #ff4d4d, #4d94ff)',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
          }}
          onClick={() => alert('음원 생성을 시작합니다!')}
        >
          이 성좌로 라임 생성하기
        </button>
      </div>
    </div>
  );
};

export default SampleUiPage;

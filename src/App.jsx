import React, { useState, useEffect, useRef } from 'react';


const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Inter, Segoe UI, Nunito, Roboto, Helvetica Neue, Arial, sans-serif',
    background: 'linear-gradient(120deg, #f1f5f9 0%, #93c5fd 80%, #0ea5e9 100%)',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    color: '#334155',
    marginBottom: '34px',
    fontSize: '2.8em',
    textShadow: '0 2px 16px rgba(52,65,85,0.10)',
    fontWeight: 700,
    letterSpacing: '2px',
  },
  controls: {
    background: '#e0eaf6',
    padding: '28px',
    borderRadius: '18px',
    boxShadow: '0 10px 30px rgba(14,165,233,0.11)',
    marginBottom: '28px',
    border: '1.5px solid #a5b4fc',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '18px'
  },
  label: {
    display: 'block',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#0ea5e9',
    fontSize: '15px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  input: {
    padding: '10px 16px',
    border: '2px solid #93c5fd',
    borderRadius: '8px',
    fontSize: '15px',
    background: '#f1f5f9',
    color: '#334155',
    minWidth: '155px',
    transition: 'all 0.3s',
    outline: 'none',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '17px',
    justifyContent: 'center',
  },
  btnBase: {
    padding: '13px 26px',
    border: '2px solid',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.24s',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 0 10px #93c5fd33',
    color: '#fff',
    background: '#334155',
    borderColor: '#334155',
    fontFamily: 'inherit',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  btnInsert: {
    background: '#0ea5e9',
    color: '#fff',
    borderColor: '#0ea5e9',
    boxShadow: '0 0 12px #0ea5e966',
  },
  btnSearch: {
    background: '#fff',
    color: '#0ea5e9',
    borderColor: '#0ea5e9',
    boxShadow: '0 0 10px #a5b4fc33',
  },
  btnDelete: {
    background: '#fff',
    color: '#334155',
    borderColor: '#334155',
    boxShadow: '0 0 10px #33415526',
  },
  btnClear: {
    background: '#f1f5f9',
    color: '#0ea5e9',
    borderColor: '#0ea5e9',
    boxShadow: '0 0 10px #0ea5e933',
  },
  message: {
    background: '#fff',
    padding: '17px 22px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontWeight: 600,
    color: '#334155',
    boxShadow: '0 3px 20px #93c5fd1a',
    border: '2px solid #a5b4fc',
    opacity: 0,
    transform: 'translateY(-10px)',
  },
  hashInfo: {
    background: '#e0eaf6',
    padding: '18px 26px',
    borderRadius: '12px',
    marginBottom: '28px',
    boxShadow: '0 2px 14px #93c5fd1a',
    border: '1.5px solid #a5b4fc',
  },
  hashInfoText: {
    margin: '9px 0',
    color: '#334155',
    fontSize: '15px',
  },
  probeCalcs: {
    background: '#fff',
    border: '2px solid #a5b4fc',
    borderRadius: '12px',
    boxShadow: '0 3px 18px #93c5fd1a',
    padding: '16px 24px',
    margin: '18px auto 18px auto',
    fontSize: '15px',
    color: '#334155',
    maxWidth: '800px',
  },
  probeCalcStep: {
    color: '#0ea5e9',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '15px',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  tableWrapper: {
    background: '#fff',
    padding: '36px',
    borderRadius: '17px',
    boxShadow: '0 10px 40px #93c5fd1a',
    overflowX: 'auto',
    border: '2px solid #a5b4fc',
    marginBottom: '0px'
  },
  bucket: {
    display: 'flex',
    alignItems: 'center',
    background: '#e0eaf6',
    border: '2px solid #f1f5f9',
    borderRadius: '11px',
    padding: '18px',
    minHeight: '70px',
    transition: 'all 0.2s',
  },
  bucketAnimating: {
    borderColor: '#0ea5e9',
    background: '#93c5fd44',
    boxShadow: '0 0 16px #0ea5e988',
  },
  bucketProbing: {
    borderColor: '#fff',
    background: 'rgba(255,255,255,0.10)',
  },
  bucketIndex: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#0ea5e9',
    minWidth: '50px',
    textAlign: 'center',
    background: '#93c5fd34',
    borderRadius: '9px',
    padding: '10px',
    marginRight: '22px',
    border: '2px solid #93c5fd44',
    boxShadow: '0 0 8px #a5b4fc33',
  },
  bucketChain: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    flexWrap: 'wrap',
    flex: 1,
  },
  chainNode: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  emptyNode: {
    color: '#cbd5e1',
    fontStyle: 'italic',
    fontSize: '15px',
  },
  nodeValue: {
    background: '#93c5fd30',
    color: '#334155',
    padding: '11px 19px',
    borderRadius: '11px',
    fontWeight: 700,
    fontSize: '16px',
    boxShadow: '0 0 8px #93c5fd22',
    border: '2px solid #93c5fd22',
    opacity: 1,
    transform: 'translateX(0) scale(1)',
  },
  nodeArrow: {
    color: '#0ea5e9',
    fontSize: '23px',
    fontWeight: 'bold',
  },
  openTable: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
    gap: '19px',
  },
  slot: {
    background: '#93c5fd40',
    border: '3px solid #a5b4fc',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.2s',
    position: 'relative',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotOccupied: {
    borderColor: '#334155',
    background: '#93c5fd40',
    boxShadow: '0 0 16px #33415533',
  },
  slotAnimating: {
    borderColor: '#fff',
    background: 'rgba(255,255,255,0.08)',
    boxShadow: '0 0 16px #e0eaf688',
  },
  slotProbing: {
    borderColor: '#e0eaf6',
    background: 'rgba(224,234,246,0.26)',
  },
  slotIndex: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#334155',
    background: '#93c5fd12',
    borderRadius: '7px',
    padding: '6px 14px',
    marginBottom: '14px',
    border: '2px solid #a5b4fc14',
  },
  slotValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0ea5e9',
  },
  slotValueEmpty: {
    color: '#a5b4fc',
    fontSize: '30px',
  },
  probeIndicator: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    background: '#334155',
    color: '#fff',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    boxShadow: '0 0 10px #33415560',
    border: '2px solid #a5b4fc',
    opacity: 0,
    scale: 0,
  },
  probeSequence: {
    background: '#93c5fd34',
    color: '#334155',
    border: '2px solid #a5b4fc',
    boxShadow: '0 0 18px #33415520, 0 0 8px #93c5fd22',
    padding: '17px 22px',
    borderRadius: '12px',
    marginTop: '22px',
    textAlign: 'center',
    fontSize: '18px',
    opacity: 0,
    transform: 'translateY(10px)',
  },
};



const App = () => {
  const [tableSize, setTableSize] = useState(10);
  const [hashingMethod, setHashingMethod] = useState('closed');
  const [probingMethod, setProbingMethod] = useState('linear');
  const [table, setTable] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [probeSequence, setProbeSequence] = useState([]);
  const [probeCalcs, setProbeCalcs] = useState([]);
  const [message, setMessage] = useState('');
  const [isOperating, setIsOperating] = useState(false);


  const operationRef = useRef(false);
  const tableRef = useRef(null);
  const messageRef = useRef(null);
  const probeRef = useRef(null);


  useEffect(() => () => { operationRef.current = false; }, []);
  useEffect(() => { initializeTable(); }, [tableSize, hashingMethod]);
  useEffect(() => {
    if (message && messageRef.current) {
      anime({
        targets: messageRef.current,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 400,
        easing: 'easeOutCubic',
      });
    }
  }, [message]);
  useEffect(() => {
    if (probeSequence.length > 0 && probeRef.current) {
      anime({
        targets: probeRef.current,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 400,
        easing: 'easeOutCubic',
      });
    }
  }, [probeSequence]);


  const initializeTable = () => {
    operationRef.current = false;
    setIsOperating(false);
    setAnimatingIndex(null);
    setProbeSequence([]);
    setProbeCalcs([]);
    setMessage('');
    if (hashingMethod === 'closed') {
      setTable(Array(tableSize).fill(null).map(() => []));
    } else {
      setTable(Array(tableSize).fill(null).map(() => ({ value: null, status: 'empty' })));
    }
  };
  const hash1 = (key) => key % tableSize;
  const hash2 = (key) => {
    const prime = tableSize > 7 ? 7 : 5;
    return prime - (key % prime);
  };
  const probeFormula = (key, i, method) => {
    let h1 = hash1(key);
    if (method === 'linear') {
      return `P${i}: (h(${key}) + ${i}) mod ${tableSize} = (${h1} + ${i}) mod ${tableSize} = ${(h1 + i) % tableSize}`;
    }
    if (method === 'quadratic') {
      return `P${i}: (h(${key}) + ${i}²) mod ${tableSize} = (${h1} + ${i * i}) mod ${tableSize} = ${(h1 + i * i) % tableSize}`;
    }
    if (method === 'double') {
      let h2 = hash2(key);
      return `P${i}: (h1(${key}) + ${i} × h2(${key})) mod ${tableSize} = (${h1} + ${i} × ${h2}) mod ${tableSize} = ${(h1 + i * h2) % tableSize}`;
    }
    return `P${i}: ${h1}`;
  };
  const getProbeIndex = (key, i) => {
    const h1 = hash1(key);
    switch (probingMethod) {
      case 'linear': return (h1 + i) % tableSize;
      case 'quadratic': return (h1 + i * i) % tableSize;
      case 'double': return (h1 + i * hash2(key)) % tableSize;
      default: return h1;
    }
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  const animateBucket = (index) => {
    const element = document.querySelector(`[data-bucket="${index}"]`);
    if (!element) return;
    anime({ targets: element, scale: [1, 1.05, 1], duration: 500, easing: 'easeInOutQuad', });
  };
  const animateSlot = (index) => {
    const element = document.querySelector(`[data-slot="${index}"]`);
    if (!element) return;
    anime({ targets: element, scale: [1, 1.1, 1], duration: 500, easing: 'easeOutElastic(1, .6)', });
  };
  const animateProbeIndicator = (index, probeNum) => {
    const indicator = document.querySelector(`[data-probe="${index}"]`);
    if (!indicator) return;
    anime({ targets: indicator, opacity: [0, 1], scale: [0, 1], duration: 300, easing: 'easeOutBack', });
  };
  const animateNodeInsertion = (bucketIndex, nodeIndex) => {
    const node = document.querySelector(`[data-node="${bucketIndex}-${nodeIndex}"]`);
    if (!node) return;
    anime({ targets: node, opacity: [0, 1], translateX: [-20, 0], scale: [0.8, 1], duration: 500, easing: 'spring(1, 80, 10, 0)', });
  };
  const animateNodeDeletion = (element) =>
    anime({ targets: element, opacity: [1, 0], translateX: [0, 20], scale: [1, 0.8], duration: 400, easing: 'easeInCubic', }).finished;
  const animateSlotValue = (index, type = 'insert') => {
    const value = document.querySelector(`[data-slot-value="${index}"]`);
    if (!value) return;
    if (type === 'insert') {
      anime({ targets: value, scale: [0, 1], rotate: [-180, 0], opacity: [0, 1], duration: 600, easing: 'easeOutElastic(1, .6)', });
    } else if (type === 'delete') {
      anime({ targets: value, scale: [1, 0], rotate: [0, 180], opacity: [1, 0], duration: 400, easing: 'easeInCubic', });
    }
  };


  const insertClosed = async (value) => {
    const key = parseInt(value);
    if (isNaN(key)) { setMessage('Please enter a valid number'); return; }
    operationRef.current = true; setIsOperating(true);
    try {
      const index = hash1(key);
      setAnimatingIndex(index); setProbeSequence([index]); setProbeCalcs([]);
      animateBucket(index);
      await sleep(500);
      if (!operationRef.current) return;
      const newTable = [...table];
      const oldLength = newTable[index].length;
      newTable[index] = [...newTable[index], key];
      setTable(newTable);
      setMessage(`Inserted ${key} at index ${index} (chain length: ${newTable[index].length})`);
      await sleep(100);
      if (!operationRef.current) return;
      animateNodeInsertion(index, oldLength);
      await sleep(500);
      if (!operationRef.current) return;
      setAnimatingIndex(null); setProbeSequence([]); setProbeCalcs([]);
    } finally { setIsOperating(false); operationRef.current = false; }
  };
  const searchClosed = async (value) => {
    const key = parseInt(value); if (isNaN(key)) { setMessage('Please enter a valid number'); return; }
    operationRef.current = true; setIsOperating(true); setProbeSequence([]); setProbeCalcs([]);
    try {
      const index = hash1(key);
      setAnimatingIndex(index); setProbeSequence([index]); setProbeCalcs([]);
      animateBucket(index);
      await sleep(500);
      if (!operationRef.current) return;
      const found = table[index].includes(key);
      if (found) {
        const position = table[index].indexOf(key);
        setMessage(`Found ${key} at index ${index}, position ${position} in chain`);
        const node = document.querySelector(`[data-node="${index}-${position}"]`);
        if (node) { anime({ targets: node, scale: [1, 1.2, 1], duration: 600, easing: 'easeInOutQuad', }); }
      } else { setMessage(`${key} not found`); }
      await sleep(500);
      if (!operationRef.current) return;
      setAnimatingIndex(null); setProbeSequence([]); setProbeCalcs([]);
    } finally { setIsOperating(false); operationRef.current = false; }
  };
  const deleteClosed = async (value) => {
    const key = parseInt(value); if (isNaN(key)) { setMessage('Please enter a valid number'); return; }
    operationRef.current = true; setIsOperating(true); setProbeSequence([]); setProbeCalcs([]);
    try {
      const index = hash1(key);
      setAnimatingIndex(index); setProbeSequence([index]); setProbeCalcs([]);
      animateBucket(index);
      await sleep(500);
      if (!operationRef.current) return;
      const newTable = [...table];
      const keyIndex = newTable[index].indexOf(key);
      if (keyIndex !== -1) {
        const node = document.querySelector(`[data-node="${index}-${keyIndex}"]`);
        if (node) { await animateNodeDeletion(node); }
        if (!operationRef.current) return;
        newTable[index] = newTable[index].filter((_, i) => i !== keyIndex);
        setTable(newTable);
        setMessage(`Deleted ${key} from index ${index}`);
      } else { setMessage(`${key} not found`); }
      await sleep(500);
      if (!operationRef.current) return;
      setAnimatingIndex(null); setProbeSequence([]); setProbeCalcs([]);
    } finally { setIsOperating(false); operationRef.current = false; }
  };


  const insertOpen = async (value) => {
    const key = parseInt(value); if (isNaN(key)) { setMessage('Please enter a valid number'); return; }
    operationRef.current = true; setIsOperating(true); setProbeSequence([]); setProbeCalcs([]);
    try {
      const sequence = [], calcs = [];
      let inserted = false;
      for (let i = 0; i < tableSize; i++) {
        if (!operationRef.current) return;
        const index = getProbeIndex(key, i);
        sequence.push(index); calcs.push(probeFormula(key, i, probingMethod));
        setProbeSequence([...sequence]); setProbeCalcs([...calcs]);
        setAnimatingIndex(index); animateSlot(index);
        if (sequence.length > 1) animateProbeIndicator(index, i);
        await sleep(600); if (!operationRef.current) return;
        if (table[index].status !== 'occupied') {
          const newTable = [...table];
          newTable[index] = { value: key, status: 'occupied' };
          setTable(newTable); inserted = true;
          setMessage(`Inserted ${key} at index ${index} after ${i + 1} probe(s)`);
          await sleep(100); if (!operationRef.current) return; animateSlotValue(index, 'insert');
          break;
        }
      }
      if (!inserted && operationRef.current) {
        setMessage(`Table is full! Cannot insert ${key}`);
      }
      await sleep(500); if (!operationRef.current) return; setAnimatingIndex(null);
    } finally { setIsOperating(false); operationRef.current = false; }
  };
  const searchOpen = async (value) => {
    const key = parseInt(value); if (isNaN(key)) { setMessage('Please enter a valid number'); return; }
    operationRef.current = true; setIsOperating(true); setProbeSequence([]); setProbeCalcs([]);
    try {
      const sequence = [], calcs = []; let found = false;
      for (let i = 0; i < tableSize; i++) {
        if (!operationRef.current) return;
        const index = getProbeIndex(key, i);
        sequence.push(index); calcs.push(probeFormula(key, i, probingMethod));
        setProbeSequence([...sequence]); setProbeCalcs([...calcs]);
        setAnimatingIndex(index); animateSlot(index);
        if (sequence.length > 1) animateProbeIndicator(index, i);
        await sleep(600); if (!operationRef.current) return;
        if (table[index].status === 'empty') {
          setMessage(`${key} not found (empty slot reached)`); break;
        }
        if (table[index].value === key && table[index].status === 'occupied') {
          setMessage(`Found ${key} at index ${index} after ${i + 1} probe(s)`); found = true;
          const valueEl = document.querySelector(`[data-slot-value="${index}"]`);
          if (valueEl) { anime({ targets: valueEl, scale: [1, 1.3, 1], duration: 600, easing: 'easeInOutQuad', }); }
          break;
        }
      }
      if (!found && sequence.length === tableSize && operationRef.current) {
        setMessage(`${key} not found after checking all slots`);
      }
      await sleep(500); if (!operationRef.current) return; setAnimatingIndex(null);
    } finally { setIsOperating(false); operationRef.current = false; }
  };
  const deleteOpen = async (value) => {
    const key = parseInt(value); if (isNaN(key)) { setMessage('Please enter a valid number'); return; }
    operationRef.current = true; setIsOperating(true); setProbeSequence([]); setProbeCalcs([]);
    try {
      const sequence = [], calcs = []; let deleted = false;
      for (let i = 0; i < tableSize; i++) {
        if (!operationRef.current) return;
        const index = getProbeIndex(key, i);
        sequence.push(index); calcs.push(probeFormula(key, i, probingMethod));

        setProbeSequence([...sequence]); setProbeCalcs([...calcs]);
        setAnimatingIndex(index); animateSlot(index);
        if (sequence.length > 1) animateProbeIndicator(index, i);
        await sleep(600); if (!operationRef.current) return;
        if (table[index].status === 'empty') {
          setMessage(`${key} not found (empty slot reached)`); break;
        }
        if (table[index].value === key && table[index].status === 'occupied') {
          animateSlotValue(index, 'delete');
          await sleep(400); if (!operationRef.current) return;
          const newTable = [...table];
          newTable[index] = { value: null, status: 'deleted' };
          setTable(newTable); deleted = true;
          setMessage(`Deleted ${key} from index ${index} after ${i + 1} probe(s)`); break;
        }
      }    
      if (!deleted && sequence.length === tableSize && operationRef.current) {
        setMessage(`${key} not found after checking all slots`);
      }
      await sleep(500); if (!operationRef.current) return; setAnimatingIndex(null);
    } finally { setIsOperating(false); operationRef.current = false; }
  };


  const handleInsert = () => {
    if (isOperating || !inputValue) return;
    if (hashingMethod === 'closed') insertClosed(inputValue);
    else insertOpen(inputValue);
    setInputValue('');
  };
  const handleSearch = () => {
    if (isOperating || !inputValue) return;
    if (hashingMethod === 'closed') searchClosed(inputValue);
    else searchOpen(inputValue);
  };
  const handleDelete = () => {
    if (isOperating || !inputValue) return;
    if (hashingMethod === 'closed') deleteClosed(inputValue);
    else deleteOpen(inputValue);
    setInputValue('');
  };
  const getSlotStyle = (slot, index) => {
    let baseStyle = { ...styles.slot };
    if (slot.status === 'occupied') baseStyle = { ...baseStyle, ...styles.slotOccupied };
    if (animatingIndex === index) baseStyle = { ...baseStyle, ...styles.slotAnimating };
    if (probeSequence.includes(index) && animatingIndex !== index)
      baseStyle = { ...baseStyle, ...styles.slotProbing };
    return baseStyle;
  };
  const getBucketStyle = (index) => {
    let baseStyle = { ...styles.bucket };
    if (animatingIndex === index) baseStyle = { ...baseStyle, ...styles.bucketAnimating };
    if (probeSequence.includes(index) && animatingIndex !== index)
      baseStyle = { ...baseStyle, ...styles.bucketProbing };
    return baseStyle;
  };
  const isTableReady = () => {
    if (!table || table.length === 0) return false;
    if (hashingMethod === 'closed') return Array.isArray(table[0]);
    else return table[0] && typeof table[0] === 'object' && 'status' in table[0];
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>  HASHING VISUALIZER </h1>
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Table Size:</label>
          <input style={styles.input} type="number" value={tableSize} onChange={(e) => setTableSize(Math.max(5, Math.min(20, parseInt(e.target.value) || 10)))} min="5" max="20" disabled={isOperating}/>
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Hashing Method:</label>
          <select style={styles.input} value={hashingMethod} onChange={(e) => setHashingMethod(e.target.value)} disabled={isOperating}>
            <option value="closed">Closed Hashing (Separate Chaining)</option>
            <option value="open">Open Addressing</option>
          </select>
        </div>
        {hashingMethod === 'open' && (
          <div style={styles.controlGroup}>
            <label style={styles.label}>Probing Method:</label>
            <select style={styles.input} value={probingMethod} onChange={(e) => setProbingMethod(e.target.value)} disabled={isOperating}>
              <option value="linear">Linear Probing</option>
              <option value="quadratic">Quadratic Probing</option>
              <option value="double">Double Hashing</option>
            </select>
          </div>
        )}
        <div style={styles.controlGroup}>
          <label style={styles.label}>Value:</label>
          <input style={styles.input} type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter number" onKeyDown={(e) => e.key === 'Enter' && handleInsert()} disabled={isOperating}/>
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={handleInsert} style={{...styles.btnBase, ...styles.btnInsert, ...(isOperating ? styles.btnDisabled : {})}} disabled={isOperating}>
            {isOperating ? 'Processing...' : '+ Insert'}
          </button>
          <button onClick={handleSearch} style={{...styles.btnBase, ...styles.btnSearch, ...(isOperating ? styles.btnDisabled : {})}} disabled={isOperating}>
            🔍 Search
          </button>
          <button onClick={handleDelete} style={{...styles.btnBase, ...styles.btnDelete, ...(isOperating ? styles.btnDisabled : {})}} disabled={isOperating}>
            🗑 Delete
          </button>
          <button onClick={initializeTable} style={{...styles.btnBase, ...styles.btnClear, ...(isOperating ? styles.btnDisabled : {})}} disabled={isOperating}>
            ⟲ Clear
          </button>
        </div>
      </div>
      {message && (<div ref={messageRef} style={styles.message}>{message}</div>)}
      <div style={styles.hashInfo}>
        <p style={styles.hashInfoText}>
          <strong>Hash Function:</strong> h(k) = k mod {tableSize}
        </p>
        {hashingMethod === 'open' && probingMethod === 'linear' && (
          <p style={styles.hashInfoText}>
            <strong>Probing:</strong> h(k, i) = (h(k) + i) mod {tableSize}
          </p>
        )}
        {hashingMethod === 'open' && probingMethod === 'quadratic' && (
          <p style={styles.hashInfoText}>
            <strong>Probing:</strong> h(k, i) = (h(k) + i²) mod {tableSize}
          </p>
        )}
        {hashingMethod === 'open' && probingMethod === 'double' && (
          <p style={styles.hashInfoText}>
            <strong>Probing:</strong> h(k, i) = (h₁(k) + i × h₂(k)) mod {tableSize}, where
            h₂(k) = {tableSize > 7 ? 7 : 5} - (k mod {tableSize > 7 ? 7 : 5})
          </p>
        )}
      </div>
      {hashingMethod === 'open' && probeCalcs.length > 0 && (
        <div style={styles.probeCalcs}>
          <strong style={{ color: '#fde047', fontSize: '17px', marginBottom: '12px', display: 'block' }}>
            Probe Calculations — Step-by-step:
          </strong>
          {probeCalcs.map((step, idx) => (
            <div key={idx} style={styles.probeCalcStep}>{step}</div>
          ))}
        </div>
      )}
      {isTableReady() && (
        <div style={styles.tableWrapper} ref={tableRef} key={hashingMethod}>
          {hashingMethod === 'closed' ? (
            <div style={styles.closedTable}>
              {table.map((bucket, index) => (
                <div key={index} style={getBucketStyle(index)} data-bucket={index}>
                  <div style={styles.bucketIndex}>{index}</div>
                  <div style={styles.bucketChain}>
                    {bucket.length === 0 ? (
                      <div style={{ ...styles.chainNode, ...styles.emptyNode }}>NULL</div>
                    ) : (
                      bucket.map((value, i) => (
                        <div key={`${value}-${i}`} style={styles.chainNode}>
                          <div style={styles.nodeValue} data-node={`${index}-${i}`}>{value}</div>
                          {i < bucket.length - 1 && (
                            <div style={styles.nodeArrow}>→</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.openTable}>
              {table.map((slot, index) => (
                <div key={index} style={getSlotStyle(slot, index)} data-slot={index}>
                  <div style={styles.slotIndex}>{index}</div>
                  {slot.status === 'occupied' ? (
                    <div style={styles.slotValue} data-slot-value={index}>{slot.value}</div>
                  ) : (
                    <div style={{ ...styles.slotValue, ...styles.slotValueEmpty }} data-slot-value={index}>—</div>
                  )}
                  {probeSequence.includes(index) && (
                    <div style={styles.probeIndicator} data-probe={index}>
                      P{probeSequence.indexOf(index)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {probeSequence.length > 0 && (
        <div ref={probeRef} style={styles.probeSequence}>
          <strong style={{ color: '#fde047', marginRight: '10px' }}>
            Probe Sequence:
          </strong>
          {probeSequence.join(' → ')}
        </div>
      )}
    </div>
  );
};


export default App ;

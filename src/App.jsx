import React, { useState, useEffect } from 'react';
import './App.css';

const HASH_TABLE_SIZE = 11; 
const EMPTY = null;
const DELETED = 'DELETED';

function App() {
  const [hashTable, setHashTable] = useState(Array(HASH_TABLE_SIZE).fill(EMPTY));
  const [collisionMethod, setCollisionMethod] = useState('linear');
  const [addressingType, setAddressingType] = useState('open');
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState('insert');
  const [probingSteps, setProbingSteps] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [message, setMessage] = useState('');

  // Hash function
  const hash1 = (key) => key % HASH_TABLE_SIZE;
  
  // Secondary hash function for double hashing
  const hash2 = (key) => 7 - (key % 7);

  // Reset current step when animation completes
  useEffect(() => {
    if (currentStepIndex >= probingSteps.length && probingSteps.length > 0) {
      setTimeout(() => {
        setCurrentStepIndex(-1);
        setIsAnimating(false);
      }, 1000);
    }
  }, [currentStepIndex, probingSteps.length]);

  // Get probe sequence based on collision resolution method
  const getProbeIndex = (key, attempt, method) => {
    const h1 = hash1(key);
    switch (method) {
      case 'linear':
        return (h1 + attempt) % HASH_TABLE_SIZE;
      case 'quadratic':
        return (h1 + attempt * attempt) % HASH_TABLE_SIZE;
      case 'double':
        const h2 = hash2(key);
        return (h1 + attempt * h2) % HASH_TABLE_SIZE;
      default:
        return h1;
    }
  };

  // Insert operation for open addressing
  const insertOpenAddressing = (key) => {
    const steps = [];
    let attempt = 0;
    let index = getProbeIndex(key, attempt, collisionMethod);
    
    steps.push({
      type: 'start',
      message: `Inserting ${key}. Initial hash: h1(${key}) = ${hash1(key)}`,
      index: index,
      attempt: 0
    });

    while (attempt < HASH_TABLE_SIZE) {
      index = getProbeIndex(key, attempt, collisionMethod);
      
      if (hashTable[index] === EMPTY || hashTable[index] === DELETED) {
        steps.push({
          type: 'success',
          message: `Found empty slot at index ${index} after ${attempt} probes`,
          index: index,
          attempt: attempt
        });
        
        const newTable = [...hashTable];
        newTable[index] = key;
        setHashTable(newTable);
        setMessage(`✓ Successfully inserted ${key} at index ${index}`);
        return steps;
      } else {
        let probeFormula = '';
        if (collisionMethod === 'linear') {
          probeFormula = `(${hash1(key)} + ${attempt}) % ${HASH_TABLE_SIZE}`;
        } else if (collisionMethod === 'quadratic') {
          probeFormula = `(${hash1(key)} + ${attempt}²) % ${HASH_TABLE_SIZE}`;
        } else {
          probeFormula = `(${hash1(key)} + ${attempt} * ${hash2(key)}) % ${HASH_TABLE_SIZE}`;
        }
        
        steps.push({
          type: 'collision',
          message: `Collision at index ${index}. Probing: ${probeFormula} = ${index}`,
          index: index,
          attempt: attempt
        });
      }
      attempt++;
    }

    setMessage(`✗ Hash table is full! Cannot insert ${key}`);
    return steps;
  };

  // Insert operation for closed addressing (chaining)
  const insertClosedAddressing = (key) => {
    const steps = [];
    const index = hash1(key);
    
    steps.push({
      type: 'start',
      message: `Inserting ${key}. Hash: h(${key}) = ${index}`,
      index: index,
      attempt: 0
    });

    const newTable = [...hashTable];
    if (!Array.isArray(newTable[index])) {
      newTable[index] = [];
    }
    newTable[index].push(key);
    
    steps.push({
      type: 'success',
      message: `Added ${key} to chain at index ${index}`,
      index: index,
      attempt: 0
    });

    setHashTable(newTable);
    setMessage(`✓ Successfully inserted ${key} in chain at index ${index}`);
    return steps;
  };

  // Search operation for open addressing
  const searchOpenAddressing = (key) => {
    const steps = [];
    let attempt = 0;
    
    steps.push({
      type: 'start',
      message: `Searching for ${key}. Initial hash: h1(${key}) = ${hash1(key)}`,
      index: hash1(key),
      attempt: 0
    });

    while (attempt < HASH_TABLE_SIZE) {
      const index = getProbeIndex(key, attempt, collisionMethod);
      
      if (hashTable[index] === EMPTY) {
        steps.push({
          type: 'fail',
          message: `Empty slot at index ${index}. Key ${key} not found`,
          index: index,
          attempt: attempt
        });
        setMessage(`✗ Key ${key} not found in hash table`);
        return steps;
      } else if (hashTable[index] === key) {
        steps.push({
          type: 'success',
          message: `Found ${key} at index ${index} after ${attempt} probes`,
          index: index,
          attempt: attempt
        });
        setMessage(`✓ Key ${key} found at index ${index}`);
        return steps;
      } else {
        steps.push({
          type: 'probing',
          message: `Index ${index} contains ${hashTable[index]}. Continue probing...`,
          index: index,
          attempt: attempt
        });
      }
      attempt++;
    }

    setMessage(`✗ Key ${key} not found after checking all slots`);
    return steps;
  };

  // Search operation for closed addressing
  const searchClosedAddressing = (key) => {
    const steps = [];
    const index = hash1(key);
    
    steps.push({
      type: 'start',
      message: `Searching for ${key}. Hash: h(${key}) = ${index}`,
      index: index,
      attempt: 0
    });

    if (Array.isArray(hashTable[index]) && hashTable[index].includes(key)) {
      steps.push({
        type: 'success',
        message: `Found ${key} in chain at index ${index}`,
        index: index,
        attempt: 0
      });
      setMessage(`✓ Key ${key} found in chain at index ${index}`);
    } else {
      steps.push({
        type: 'fail',
        message: `Key ${key} not found in chain at index ${index}`,
        index: index,
        attempt: 0
      });
      setMessage(`✗ Key ${key} not found`);
    }
    
    return steps;
  };

  // Delete operation for open addressing
  const deleteOpenAddressing = (key) => {
    const steps = [];
    let attempt = 0;
    
    steps.push({
      type: 'start',
      message: `Deleting ${key}. Initial hash: h1(${key}) = ${hash1(key)}`,
      index: hash1(key),
      attempt: 0
    });

    while (attempt < HASH_TABLE_SIZE) {
      const index = getProbeIndex(key, attempt, collisionMethod);
      
      if (hashTable[index] === EMPTY) {
        steps.push({
          type: 'fail',
          message: `Empty slot at index ${index}. Key ${key} not found`,
          index: index,
          attempt: attempt
        });
        setMessage(`✗ Key ${key} not found for deletion`);
        return steps;
      } else if (hashTable[index] === key) {
        steps.push({
          type: 'success',
          message: `Found ${key} at index ${index}. Marking as DELETED`,
          index: index,
          attempt: attempt
        });
        
        const newTable = [...hashTable];
        newTable[index] = DELETED;
        setHashTable(newTable);
        setMessage(`✓ Successfully deleted ${key} from index ${index}`);
        return steps;
      } else {
        steps.push({
          type: 'probing',
          message: `Index ${index} contains ${hashTable[index]}. Continue probing...`,
          index: index,
          attempt: attempt
        });
      }
      attempt++;
    }

    setMessage(`✗ Key ${key} not found after checking all slots`);
    return steps;
  };

  // Delete operation for closed addressing
  const deleteClosedAddressing = (key) => {
    const steps = [];
    const index = hash1(key);
    
    steps.push({
      type: 'start',
      message: `Deleting ${key}. Hash: h(${key}) = ${index}`,
      index: index,
      attempt: 0
    });

    const newTable = [...hashTable];
    if (Array.isArray(newTable[index])) {
      const keyIndex = newTable[index].indexOf(key);
      if (keyIndex !== -1) {
        newTable[index].splice(keyIndex, 1);
        setHashTable(newTable);
        
        steps.push({
          type: 'success',
          message: `Deleted ${key} from chain at index ${index}`,
          index: index,
          attempt: 0
        });
        setMessage(`✓ Successfully deleted ${key} from chain at index ${index}`);
      } else {
        steps.push({
          type: 'fail',
          message: `Key ${key} not found in chain at index ${index}`,
          index: index,
          attempt: 0
        });
        setMessage(`✗ Key ${key} not found in chain`);
      }
    } else {
      steps.push({
        type: 'fail',
        message: `No chain exists at index ${index}`,
        index: index,
        attempt: 0
      });
      setMessage(`✗ Key ${key} not found`);
    }
    
    return steps;
  };

  // Handle operation execution
  const handleExecute = () => {
    const key = parseInt(inputValue);
    if (isNaN(key)) {
      setMessage('✗ Please enter a valid number');
      return;
    }

    let steps = [];
    
    if (addressingType === 'open') {
      if (operation === 'insert') {
        steps = insertOpenAddressing(key);
      } else if (operation === 'search') {
        steps = searchOpenAddressing(key);
      } else if (operation === 'delete') {
        steps = deleteOpenAddressing(key);
      }
    } else {
      if (operation === 'insert') {
        steps = insertClosedAddressing(key);
      } else if (operation === 'search') {
        steps = searchClosedAddressing(key);
      } else if (operation === 'delete') {
        steps = deleteClosedAddressing(key);
      }
    }

    setProbingSteps(steps);
    setCurrentStepIndex(0);
    setIsAnimating(true);
    setInputValue('');
  };

  // Animate through steps
  useEffect(() => {
    if (isAnimating && currentStepIndex < probingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStepIndex, probingSteps.length]);

  // Clear hash table
  const handleClear = () => {
    setHashTable(Array(HASH_TABLE_SIZE).fill(EMPTY));
    setProbingSteps([]);
    setCurrentStepIndex(-1);
    setMessage('Hash table cleared');
  };

  // Get cell class based on current animation state
  const getCellClass = (index) => {
    if (currentStepIndex >= 0 && currentStepIndex < probingSteps.length) {
      const currentStep = probingSteps[currentStepIndex];
      if (currentStep.index === index) {
        if (currentStep.type === 'success') return 'cell success';
        if (currentStep.type === 'collision' || currentStep.type === 'probing') return 'cell probing';
        if (currentStep.type === 'fail') return 'cell fail';
        if (currentStep.type === 'start') return 'cell start';
      }
    }
    return 'cell';
  };

  return (
    <div className="App">
      <h1>Hash Table Visualizer</h1>
      
      <div className="controls">
        <div className="control-group">
          <label>Addressing Type:</label>
          <select 
            value={addressingType} 
            onChange={(e) => setAddressingType(e.target.value)}
            disabled={isAnimating}
          >
            <option value="open">Open Addressing</option>
            <option value="closed">Closed Addressing (Chaining)</option>
          </select>
        </div>

        {addressingType === 'open' && (
          <div className="control-group">
            <label>Collision Resolution:</label>
            <select 
              value={collisionMethod} 
              onChange={(e) => setCollisionMethod(e.target.value)}
              disabled={isAnimating}
            >
              <option value="linear">Linear Probing</option>
              <option value="quadratic">Quadratic Probing</option>
              <option value="double">Double Hashing</option>
            </select>
          </div>
        )}

        <div className="control-group">
          <label>Operation:</label>
          <select 
            value={operation} 
            onChange={(e) => setOperation(e.target.value)}
            disabled={isAnimating}
          >
            <option value="insert">Insert</option>
            <option value="search">Search</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        <div className="control-group">
          <label>Key:</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
            disabled={isAnimating}
            placeholder="Enter a number"
          />
        </div>

        <button onClick={handleExecute} disabled={isAnimating}>
          Execute
        </button>
        <button onClick={handleClear} disabled={isAnimating}>
          Clear Table
        </button>
      </div>

      {message && (
        <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="hash-table-container">
        <h3>Hash Table (Size: {HASH_TABLE_SIZE})</h3>
        <div className="hash-table">
          {hashTable.map((value, index) => (
            <div key={index} className={getCellClass(index)}>
              <div className="cell-index">{index}</div>
              <div className="cell-value">
                {addressingType === 'closed' && Array.isArray(value) ? (
                  <div className="chain">
                    {value.length === 0 ? '[]' : value.join(' → ')}
                  </div>
                ) : (
                  value === EMPTY ? '—' : value === DELETED ? 'DEL' : value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {probingSteps.length > 0 && (
        <div className="probing-steps">
          <h3>Probing Steps</h3>
          <div className="steps-list">
            {probingSteps.map((step, idx) => (
              <div 
                key={idx} 
                className={`step ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}
              >
                <span className="step-number">Step {idx + 1}:</span>
                <span className="step-message">{step.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-panel">
        <h3>Hash Functions</h3>
        <p><strong>Primary Hash:</strong> h₁(k) = k mod {HASH_TABLE_SIZE}</p>
        {addressingType === 'open' && collisionMethod === 'double' && (
          <p><strong>Secondary Hash:</strong> h₂(k) = 7 - (k mod 7)</p>
        )}
        {addressingType === 'open' && (
          <>
            <p><strong>Probe Formula:</strong></p>
            <ul>
              {collisionMethod === 'linear' && <li>Linear: h(k, i) = (h₁(k) + i) mod {HASH_TABLE_SIZE}</li>}
              {collisionMethod === 'quadratic' && <li>Quadratic: h(k, i) = (h₁(k) + i²) mod {HASH_TABLE_SIZE}</li>}
              {collisionMethod === 'double' && <li>Double: h(k, i) = (h₁(k) + i × h₂(k)) mod {HASH_TABLE_SIZE}</li>}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FlashcardList() {
  const [flashcards, setFlashcards] = useState([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('/api/flashcards/');
      setFlashcards(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch flashcards');
      console.error('Fetch flashcards error:', error);
    }
  };

  const handleCreateFlashcard = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/api/flashcards/', { front: front, back: back });
      setFront('');
      setBack('');
      fetchFlashcards();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create flashcard');
      console.error('Create flashcard error:', error);
    }
  };

  const handleDeleteFlashcard = async (id) => {
    try {
      await axios.delete(`/api/flashcards/${id}/`);
      fetchFlashcards();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete flashcard');
      console.error('Delete flashcard error:', error);
    }
  };

  return (
    <div>
      <h2>Flashcards</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreateFlashcard}>
        <label>
          Front:
          <input type="text" value={front} onChange={(e) => setFront(e.target.value)} required />
        </label>
        <label>
          Back:
          <input type="text" value={back} onChange={(e) => setBack(e.target.value)} required />
        </label>
        <button type="submit">Add Flashcard</button>
      </form>
      {flashcards.length === 0 ? (
        <p>Нет флешек</p>
      ) : (
        <ul>
          {flashcards.map((flashcard) => (
            <li key={flashcard.id}>
              {flashcard.front} - {flashcard.back}
              <button onClick={() => handleDeleteFlashcard(flashcard.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FlashcardList;

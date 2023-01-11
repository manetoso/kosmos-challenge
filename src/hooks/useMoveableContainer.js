import { useEffect, useState } from 'react';
import { randomValue } from '../utils/utils';

export const useMoveableContainer = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  const [images, setImages] = useState([]);

  // CREATE A NEW MOVEABLE COMPONENT
  const addMoveable = async () => {
    const COLORS = ['red', 'blue', 'yellow', 'green', 'purple'];
    const POSITIONS = [
      'contain',
      'cover',
      'fill',
      'inherit',
      'initial',
      'none',
      'revert',
      'revert-layer',
      'scale-down',
    ];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[randomValue(1, COLORS.length)],
        image: images[randomValue(0, 5000)].url,
        position: POSITIONS[randomValue(1, POSITIONS.length)],
        updateEnd: true,
      },
    ]);
  };

  // UPDATE THE MOVEABLE COMPONENT DATA
  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  // DELETE THE MOVEABLE COMPONENT FROM THE ARRAY
  const deleteMoveable = id => {
    const newMoveables = moveableComponents.filter(value => value.id !== id);
    setMoveableComponents(newMoveables);
  };

  /**
   * THIS useEffect ALLOW ME TO GET THE DATA FOR THE IMAGES FROM THE API
   * IT FIRES WHEN THE PAGE LOADS
   * https://jsonplaceholder.typicode.com/photos
   */
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch('https://jsonplaceholder.typicode.com/photos');
      const data = await resp.json();
      setImages(data);
    };
    fetchData();
  }, []);

  return {
    addMoveable,
    deleteMoveable,
    images,
    moveableComponents,
    selected,
    setSelected,
    updateMoveable,
  };
};

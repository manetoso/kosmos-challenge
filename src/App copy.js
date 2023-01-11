import React, { useEffect, useRef, useState } from 'react';
import Moveable from 'react-moveable';
import { randomValue } from './utils/utils';

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  const [images, setImages] = useState([]);

  /**
   * THIS useEffect ALLOW ME TO GET THE DATA FOR THE IMAGES FROM THE API
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

  const addMoveable = async () => {
    // Create a new moveable component and add it to the array
    const COLORS = ['red', 'blue', 'yellow', 'green', 'purple'];
    const POSITIONS = ['contain', 'cover', 'fill', 'inherit', 'initial', 'none', 'revert', 'revert-layer', 'scale-down'];

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

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const deleteMoveable = (id) => {
    const newMoveables = moveableComponents.filter((value) => value.id !== id)
    setMoveableComponents(newMoveables)
  }

  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      {images.length === 0 ? (
        <p>Loading Images..</p>
      ) : (
        <button onClick={addMoveable}>Add Moveable1</button>
      )}
      <div
        id='parent'
        style={{
          position: 'relative',
          background: 'black',
          height: '80vh',
          width: '80vw',
        }}>
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
            deleteMoveable={deleteMoveable}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  image,
  position,
  id,
  setSelected,
  isSelected = false,
  deleteMoveable,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = document.getElementById('parent');
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async e => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
      image: image,
      position: position,
    });


    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onResizeEnd = async e => {
    let newWidth = e.lastEvent?.width;
    let newHeight = e.lastEvent?.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    let absoluteTop = top;
    let absoluteLeft = left;

    updateMoveable(
      id,
      {
        top: absoluteTop,
        left: absoluteLeft,
        width: newWidth,
        height: newHeight,
        color,
        image: image,
        position: position,
      },
      true
    );
  };

  const onDrag = e => {
    let newTop = e.top
    let newLeft = e.left

    if (e.top <= 0)
      newTop = 0
    if (e.top >= parentBounds?.height - height)
      newTop = parentBounds.height - height
    if (e.left <= 0)
      newLeft = 0
    if (e.left >= parentBounds?.width - width)
      newLeft = parentBounds?.width - width

    updateMoveable(id, {
      top: newTop,
      left: newLeft,
      width,
      height,
      color,
      image: image,
      position: position,
    });
  }

  return (
    <>
      <img
        ref={ref}
        className='draggable'
        id={'component-' + id}
        style={{
          position: 'absolute',
          top: top,
          left: left,
          width: width,
          height: height,
          objectFit: position,
          objectPosition: 'center',
        }}
        src={image}
        onClick={() => setSelected(id)}
        onDoubleClick={() => deleteMoveable(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={e => {onDrag(e)}}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

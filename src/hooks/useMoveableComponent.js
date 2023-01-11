import { useRef, useState } from 'react';

export const useMoveableComponent = ({
  color,
  height,
  id,
  image,
  index,
  left,
  position,	
  top,
  updateMoveable,
  width,
}) => {
  const itemRef = useRef();
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

  // HANDLE RESIZE OF THE MOVEABLE COMPONENT
  const onResize = async e => {
    // UPDATE WIDTH AND HEIGHT
    let newWidth = e.width;
    let newHeight = e.height;

    // UPDATE SELECTED MOVEABLE OBJECT
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

    itemRef.current.style.width = `${e.width}px`;
    itemRef.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    itemRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  // HANDLE RESIZE END OF THE MOVEABLE COMPONENT
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

  // HANDLE DRAG OF THE MOVEABLE COMPONENT
  const onDrag = e => {
    let newTop = e.top;
    let newLeft = e.left;

    if (e.top <= 0) newTop = 0;
    if (e.top >= parentBounds?.height - height)
      newTop = parentBounds.height - height;
    if (e.left <= 0) newLeft = 0;
    if (e.left >= parentBounds?.width - width)
      newLeft = parentBounds?.width - width;

    updateMoveable(id, {
      top: newTop,
      left: newLeft,
      width,
      height,
      color,
      image: image,
      position: position,
    });
  };

  return {
    itemRef,
    onDrag,
    onResize,
    onResizeEnd,
  };
};

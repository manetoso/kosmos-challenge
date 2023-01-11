import Moveable from 'react-moveable';
import { useMoveableComponent } from '../hooks/useMoveableComponent';

export const MoveableComponent = ({
  color,
  deleteMoveable,
  height,
  id,
  image,
  index,
  isSelected = false,
  left,
  position,
  setSelected,
  top,
  updateMoveable,
  width,
}) => {
  /**
   * INITIALIZATION OF THE MOVEABLE COMPONENT
   * THE COMPONENT SHOULD TAKE CARE OF THE RESIZE AND DRAG EVENTS
   * SO IT SHOULD:
   *  RESIZE MOVEABLE
   *  DRAG MOVEABLE
   */
  const { itemRef, onDrag, onResize, onResizeEnd } = useMoveableComponent({
    color,
    height,
    id,
    image,
    index,
    left,
    position,
    setSelected,
    top,
    updateMoveable,
    width,
  });

  return (
    <>
      <img
        ref={itemRef}
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
        target={isSelected && itemRef.current}
        resizable
        draggable
        onDrag={e => {
          onDrag(e);
        }}
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

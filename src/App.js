import { MoveableComponent } from './components/MoveableComponent';
import { useMoveableContainer } from './hooks/useMoveableContainer';
import './styles.css';

const App = () => {
  /**
   * INITIALIZATION OF THE MOVEABLE CONTAINER
   * THE CONTAINER SHOULD TAKE CARE OF THE DATA OF MOVEABLES
   * SO IT SHOULD:
   *  CREATE MOVEABLES
   *  UPDATE MOVEABLES
   *  DELTE MOVEABLES
   */
  const {
    addMoveable,
    deleteMoveable,
    images,
    moveableComponents,
    selected,
    setSelected,
    updateMoveable,
  } = useMoveableContainer();

  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <section style={{ height: '80vh', width: '80vw' }}>
        <p>Choose the item you want to resize/drag to focus them and do it</p>
        <p>To create a new item click on the button on the bototm right.</p>
        <p>If you want to delete it, press double click on it</p>
        <div
          id='parent'
          style={{
            position: 'relative',
            background: '#18181b',
            height: '100%',
            width: '100%',
          }}>
          {moveableComponents.map((item, index) => (
            <MoveableComponent
              {...item}
              key={index}
              updateMoveable={updateMoveable}
              setSelected={setSelected}
              isSelected={selected === item.id}
              deleteMoveable={deleteMoveable}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {images.length === 0 ? (
            <p>Loading Images..</p>
          ) : (
            <button className='button' onClick={addMoveable}>
              Add Item
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default App;

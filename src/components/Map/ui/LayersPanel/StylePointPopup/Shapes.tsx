import classNames from 'classnames';
import styles from './StylePointPopup.module.scss';
import { Shape } from 'components/Map/styles/shapes';
import { useSelector } from 'react-redux';
import { addShape, selectShapes } from 'store/reducers/shapesSlice';
import { useDispatch } from 'react-redux';
import { IconForm } from './IconForm';
import { setFillAttr } from './utils/setFillAttr';

interface Props {
  color: string;
  shape: Shape;
  setSelectedShape: React.Dispatch<React.SetStateAction<Shape>>;
};

const Shapes: React.FC<Props> = (props) => {
  const { color, setSelectedShape, shape: shapeProps } = props;

  const shapesFromRedux = useSelector(selectShapes);
  const dispatch = useDispatch();

  const handleClick = (shape: Shape) => {
    setSelectedShape(shape);
  }

  const onChange = async (event: any) => {
    const file = event.target.files.item(0);
    try {
      const text = await file.text();

      dispatch(addShape({
        name: file.name.split('.')[0].split('-').map((el: string) => el[0].toUpperCase() + el.slice(1)).join(' '),
        svg: setFillAttr(text)
      }))
    } catch (err) {
      console.log(err)
    }
  }

  return <section className={styles.column} data-testid="shape-component">
    <div className={styles.titleBox}>
      <h1 className={styles.heading}>Shape</h1>
    </div>
    <div className={styles.shapes}>
      {
        shapesFromRedux.map((shape: Shape, i: number) => {
          return <div key={i} className={classNames(styles.shapePair, {
            [styles.active]: shape.name === shapeProps.name
          })}
            onClick={() => handleClick(shape)}>
            <div className={styles.shapeValue} dangerouslySetInnerHTML={{ __html: shape.svg.replace('%COLOR%', color) }} />
            <div className={styles.shapeName}>{shape.name}</div>
          </div>
        })
      }

      <IconForm onChange={onChange} />

    </div>
  </section>
}

export default Shapes;
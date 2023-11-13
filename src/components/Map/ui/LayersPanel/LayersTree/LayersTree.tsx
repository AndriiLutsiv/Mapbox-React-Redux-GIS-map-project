import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { LayerItem } from "./LayerItem";

import styles from '../LayersPanel.module.scss'

export const LayersTree = () => {
  const defaultList = [
    {
      id: 1,
      layerName: 'Layer Name 1',
      indicator: {
        color: '#f00',
        shape: 'line'
      }
    },
    {
      id: 2,
      layerName: 'Layer Name 2',
      indicator: {
        color: '#00f',
        shape: 'circle'
      }
    },
    {
      id: 3,
      layerName: 'Layer Name 3',
      // indicator: {
      //   color: '#0f0',
      //   shape: 'square'
      // },
      children: [
        {
          id: '3-1',
          layerName: 'Layer Name 3-1',
          indicator: {
            color: '#0fd',
            shape: 'square'
          }
        },
        {
          id: '3-2',
          layerName: 'Layer Name 3-2',
          indicator: {
            color: '#0fe',
            shape: 'line'
          },
          children: [
            {
              id: '3-1-1',
              layerName: 'Layer Name 3-1-1',
              indicator: {
                color: '#f0d',
                shape: 'square'
              }
            }
          ]
        }
      ]
    }
  ];

  const [itemList, setItemList] = useState(defaultList);

  const handleDrop = (droppedItem: any) => {
    if (!droppedItem.destination) return;
    const updatedList = [...itemList];

    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    setItemList(updatedList);
  };

  return <div className={styles.drawerSection} data-testid="LayerTree">
    <h3 className={styles.title}>Layers</h3>
    <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="list-container">
        {(provided) => (
          <div
            className="list-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {itemList.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.layerName}
                index={index}>
                {(provided) => (
                  <div
                    className="item-container"
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                  >
                    <LayerItem
                      key={item.id}
                      layerName={item.layerName}
                      indicator={item.indicator}
                      children={item?.children}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </div>
}
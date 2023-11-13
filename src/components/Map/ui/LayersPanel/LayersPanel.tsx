import { ConfigProvider, Drawer, Tabs } from 'antd';
import styles from './LayersPanel.module.scss';
import { Button } from 'components/Button';
import { useEffect, useState } from 'react';
import { CustomTabs } from './CustomTabs';
import { ShareMapView } from '../ShareMapView';
import { Layer } from 'models/Map';
import { Spinner } from 'components/Spinner';
import { useMap } from 'app/providers/MapProvider';

interface Props {
    shareView?: boolean;
}

const LayersPanel: React.FC<Props> = ({ shareView }) => {
    const { mapLoading } = useMap();
    const [open, setOpen] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

    const showDrawer = () => setOpen(true);

    const onClose = () => {
        setSelectedLayer(null);
        setOpen(false);
    };

    return <>
        <div className={styles.btnPosition}
            data-testid="LayerPanel">

            <Button onClick={showDrawer}>
                Menu
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Button>
        </div>
        <ConfigProvider
            theme={{
                token: {
                    colorBgElevated: '#141414',
                    padding: 16,
                    paddingLG: 16,
                },
            }}
        >
            <Drawer
                placement="left"
                closable={false}
                onClose={onClose}
                open={open}
                mask={false}
                getContainer={false}
                className={styles.drawerLayout}
                width={360}
                data-testid="LayerPanel-Drawer"
                bodyStyle={{ overflow: 'hidden' }}
            >
                <div className={styles.drawerBtnClose}>
                    <Button onClick={onClose}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="#F5F5F5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>
                <CustomTabs selectedLayer={selectedLayer} setSelectedLayer={setSelectedLayer} />
                <div className={styles.footer}>
                    {mapLoading && <Spinner />}
                    <hr className={styles.drawerSeparator} />
                    {shareView && <ShareMapView className={styles.shareView} />}
                </div>
            </Drawer>
        </ConfigProvider>
    </>
}

export default LayersPanel;
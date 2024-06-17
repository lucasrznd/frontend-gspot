import { Sidebar } from "primereact/sidebar";
import RadioPlayer from "../media/player/RadioPlayer";
import logo from "../../assets/images/logo-horizontal.png";

export default function SidebarApp(props) {
    const streamUrl = process.env.REACT_APP_STREAM_URL;

    return <div>
        <Sidebar visible={props.visibleRight} position="right" onHide={() => props.setVisibleRight(false)}>
            <h2 className="text-primary">Ouvir a Rádio</h2>
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round bg-primary" style={{ height: '100px', width: '100%', overflow: 'hidden' }}>
                <div className="flex justify-content-between">
                    <div>
                        <span className="block text-primary font-bold mb-3"></span>
                    </div>
                </div>
                <div className="flex align-items-center justify-content-center" style={{ height: 'calc(100% - 48px)' }}>
                    <div className="flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                        <RadioPlayer url={streamUrl} />
                    </div>
                </div>
            </div>

            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round mt-2" style={{ height: '100px', width: '100%', overflow: 'hidden' }}>
                <div className="flex justify-content-between">
                    <div>
                        <span className="block text-primary font-bold mb-3"></span>
                    </div>
                </div>
                <div className="flex align-items-center justify-content-center" style={{ height: 'calc(100% - 48px)' }}>
                    <div className="flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                        <img alt="logo" src={logo} height={70} className="mr-2 mt-3" />
                    </div>
                </div>
            </div>
        </Sidebar>
    </div>
}
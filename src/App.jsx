import Layout from "./Layout/index.jsx";
import VideoRecorder from "./VideoRecorder/index.jsx";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
const App = () => {
    return (
        <Layout>
            <VideoRecorder/>
            <ToastContainer />
        </Layout>
    );
};

export default App;

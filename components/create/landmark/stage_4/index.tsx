// Tools
// Types
import type { FunctionComponent } from "react";
// Material UI Components
import Fade from "@mui/material/Fade";
// Other components
import StageHeader from "@/components/create/_utils/StageHeader";

interface StageOneProps {
    //
}

const StageOne: FunctionComponent<StageOneProps> = (props) => {
    return (
        <Fade in={true}>
            <div>
                <StageHeader title="Description" stageNumber={4}></StageHeader>
            </div>
        </Fade>
    );
};

export default StageOne;

// Tools
import { styled } from "@mui/system";
import stated from "@/utils/client/stated";
import { CreateReviewContext } from "../context";
import useWindowSizes from "@/hooks/useWindowSizes";
import { useMemo, useContext, useState } from "react";
// Types
import type { FunctionComponent } from "react";
import type { StatedDataField } from "@/@types/StatedDataField";
// Other components
import OptionsRow from "./OptionsRow";
import SelectScoreDialog from "./SelectScoreDialog";
import ReviewScore from "@/components/_utils/ReviewScore";
// Styled components
import FlexBox from "@/components/_utils/styled/FlexBox";
import StyledButton from "@/components/create/_utils/forms/Button";

const StyledReviewScore = styled(ReviewScore)(({ theme }) => ({
    width: "90px",
    height: "80px",
    fontSize: "3rem",
    marginRight: "10px",
    fontWeight: "700",
    transition: "background .3s ease-in-out",
}));

const SelectScoreWrapper = styled("header")(({ theme }) => ({
    display: "flex",
    position: "relative",
    alignItems: "center",
    margin: "20px 0",
    button: {
        marginLeft: "10px",
    },
    h3: {
        position: "relative",
        zIndex: 2,
        margin: "0 0 20px 0",
        strong: {
            marginLeft: "10px",
            fontWeight: "900",
        },
    },
}));

interface SelectScoreProps {
    /** The final review score consists of [scoreInt].[scoreFloat] */
    scoreInt: StatedDataField<number>;
    scoreFloat: StatedDataField<number>;
}

const SelectScore: FunctionComponent<SelectScoreProps> = (props) => {
    const { width } = useWindowSizes();
    const { scoreFloat, scoreInt } = props;
    const context = useContext(CreateReviewContext);
    const [openChangeScoreDialog, setOpenChangeScoreDialog] = useState<boolean>(false);

    const points = useMemo<number>(() => {
        if (scoreInt.value === 10) return 10;
        return (scoreInt.value * 10 + scoreFloat.value) / 10;
    }, [scoreFloat, scoreInt]);
    return (
        <SelectScoreWrapper>
            <StyledReviewScore type={context.estimatedReviewType} points={points} />
            {(() => {
                if (width > 700) {
                    return (
                        <FlexBox column sx={{ flexGrow: 1 }}>
                            <OptionsRow
                                range={{ start: 0, end: 10 }} //
                                value={scoreInt}
                            ></OptionsRow>
                            <OptionsRow
                                range={{ start: 0, end: 9 }} //
                                value={scoreFloat}
                                disabled={scoreInt.value === 10}
                            ></OptionsRow>
                        </FlexBox>
                    );
                } else {
                    return (
                        <>
                            <StyledButton onClick={() => setOpenChangeScoreDialog(true)}>Change score</StyledButton>
                            <SelectScoreDialog
                                scoreInt={scoreInt} //
                                scoreFloat={scoreFloat}
                                open={stated(openChangeScoreDialog, setOpenChangeScoreDialog)}
                            ></SelectScoreDialog>
                        </>
                    );
                }
            })()}
        </SelectScoreWrapper>
    );
};

export default SelectScore;

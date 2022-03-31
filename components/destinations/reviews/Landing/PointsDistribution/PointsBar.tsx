// Tools
import { styled, alpha } from "@mui/system";
import getColorBasedOnScore from "@/utils/client/getColorBasedOnScore";
// Types
import type { FunctionComponent } from "react";
import type { ReviewType } from "@prisma/client";
import type { PointsDistribution } from "@/@types/pages/api/ReviewsAPI";
// Styled components
const Wrapper = styled("div")(({ theme }) => ({
    marginBottom: "10px",
}));
const Label = styled("span")(({ theme, ...props }) => ({
    textTransform: "capitalize",
    userSelect: "none",
    letterSpacing: "1px",
    strong: {
        color: theme.palette.primary.main,
    },
}));

const Bar = styled("div")<{ ratio: number; type: ReviewType }>(({ theme, ...props }) => ({
    width: "100%",
    height: "5px",
    background: alpha(theme.palette.text.primary, 0.1),
    position: "relative",
    "&::after": {
        content: "''",
        position: "absolute",
        height: "100%",
        width: `${props.ratio}%`,
        background: getColorBasedOnScore(props.type),
        left: "0",
    },
}));

interface PointsBarProps {
    type: ReviewType;
    pointsDistribution: PointsDistribution;
    predominant: ReviewType;
}

const PointsBar: FunctionComponent<PointsBarProps> = (props) => {
    const { type, pointsDistribution, predominant } = props;
    const ratio: number = Math.floor((pointsDistribution[type] * 100) / pointsDistribution[predominant]);

    return (
        <Wrapper>
            <Bar ratio={ratio} type={type}></Bar>
            <Label>
                <span>{type.toLowerCase()}: </span>
                <strong>{pointsDistribution[type]}</strong>
            </Label>
        </Wrapper>
    );
};

export default PointsBar;

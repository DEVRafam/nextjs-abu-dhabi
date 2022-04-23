// Tools
import { styled } from "@mui/system";
import { useState, useEffect, useRef } from "react";
// Types
import type { SxProps } from "@mui/system";
import type { FunctionComponent, ReactNode } from "react";
// Material UI Components
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
// Other components
import SectionHeader from "@/components/destinations/single/_utils/SectionHeader";
// Redux
import { useAppSelector } from "@/hooks/useRedux";
// Styled Components
const Wrapper = styled(Box)({
    width: "100%",
    padding: "100px 0",
    position: "relative",
    overflow: "hidden",
});
const Container = styled("div")(({ theme }) => ({
    width: "1450px",
    maxWidth: "calc(100vw - 400px)",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
    ["@media (max-width:1400px)"]: {
        maxWidth: "calc(100vw - 340px)",
    },
    ["@media (max-width:1300px)"]: {
        maxWidth: "calc(100vw - 300px)",
    },
    ["@media (max-width:1000px)"]: {
        maxWidth: "calc(100vw - 100px)",
    },
    ["@media (max-width:800px)"]: {
        maxWidth: "calc(100vw - 40px)",
    },
    ["@media (max-width:600px)"]: {
        maxWidth: "calc(100vw - 0px)",
    },
}));

interface SectionProps {
    children: ReactNode;
    id: string;
    background: string;
    header: {
        text: string;
        buttonMsg?: string;
        biggerHeader?: string;
        onClick?: () => void;
        url?: string;
    };
    // Optional
    fadeThresholdRatio?: number;
    sx?: SxProps;
}
const Section: FunctionComponent<SectionProps> = (props) => {
    const { scrollY, height } = useAppSelector((state) => state.windowSizes);
    const [fade, setFade] = useState<boolean>(true);
    const element = useRef<HTMLElement | null>(null);

    const fadeThresholdRatio = props.fadeThresholdRatio ?? 0.25;
    const fadeThreshold = height * fadeThresholdRatio;

    useEffect(() => {
        if (element.current) {
            const { bottom } = element.current.getBoundingClientRect();
            if (fade && bottom < fadeThreshold) setFade(false);
            else if (!fade && bottom > fadeThreshold) setFade(true);
        }
    }, [scrollY, fadeThreshold, fade]);

    return (
        <Wrapper
            id={props.id} //
            component="section"
            ref={element}
            sx={{ background: props.background, ...props.sx }}
        >
            <Fade in={fade}>
                <Container>
                    <SectionHeader
                        header={props.header.text} //
                        buttonMsg={props.header.buttonMsg}
                        onClick={props.header.onClick}
                        url={props.header.url}
                        biggerHeader={props.header.biggerHeader}
                    ></SectionHeader>
                    {props.children}
                </Container>
            </Fade>
        </Wrapper>
    );
};

export default Section;
